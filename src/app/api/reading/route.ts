import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { buildTarotPrompt } from "@/lib/tarot-prompt";
import { CARD_SLUGS } from "@/data/tarot-cards";
import { shuffle } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  question: z.string().min(10).max(500),
  context: z.string().min(20).max(2000),
  cardCount: z.union([z.literal(3), z.literal(6)]),
  cards: z.array(z.string()).optional(),
  paymentOrderId: z.string().nullable().optional(),
});

function drawCards(count: number): string[] {
  return shuffle([...CARD_SLUGS]).slice(0, count);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = checkRateLimit(`reading:${session.user.id}`, {
    maxRequests: 5,
    windowMs: 300_000,
  });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many reading requests. Please wait." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    console.error("Validation error:", parsed.error.errors);
    return NextResponse.json({ error: "Invalid input", details: parsed.error.errors }, { status: 400 });
  }

  const { question, context, cardCount, cards, paymentOrderId } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isFree = !user.hasUsedFreeReading;

  if (!isFree) {
    if (!paymentOrderId) {
      return NextResponse.json({ error: "Payment required", requiresPayment: true }, { status: 402 });
    }
    const payment = await prisma.payment.findUnique({ where: { orderId: paymentOrderId } });
    if (!payment || payment.status !== "SUCCESS" || payment.userId !== user.id) {
      return NextResponse.json({ error: "Payment not verified" }, { status: 402 });
    }
  }

  const drawnCards = cards && cards.length === cardCount ? cards : drawCards(cardCount);
  const prompt = buildTarotPrompt(question, context, drawnCards);

  let interpretation = "";
  try {
    // Support multiple AI providers
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    if (groqKey) {
      // Groq (Free and fast!)
      const aiResp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: cardCount === 3 ? 1500 : 2500,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!aiResp.ok) {
        console.error("Groq error:", await aiResp.text());
        throw new Error("Groq API failed");
      }

      const aiData = await aiResp.json() as { choices: Array<{ message: { content: string } }> };
      interpretation = aiData.choices[0]?.message?.content ?? "";
    } else if (anthropicKey) {
      // Anthropic Claude
      const aiResp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: cardCount === 3 ? 1500 : 2500,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!aiResp.ok) {
        console.error("Anthropic error:", await aiResp.text());
        throw new Error("Anthropic API failed");
      }

      const aiData = await aiResp.json() as { content: Array<{ type: string; text: string }> };
      interpretation = aiData.content.find((b) => b.type === "text")?.text ?? "";
    } else if (openaiKey) {
      // OpenAI GPT
      const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: cardCount === 3 ? 1500 : 2500,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!aiResp.ok) {
        console.error("OpenAI error:", await aiResp.text());
        throw new Error("OpenAI API failed");
      }

      const aiData = await aiResp.json() as { choices: Array<{ message: { content: string } }> };
      interpretation = aiData.choices[0]?.message?.content ?? "";
    } else if (openrouterKey) {
      // OpenRouter (supports many free models)
      const aiResp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openrouterKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!aiResp.ok) {
        console.error("OpenRouter error:", await aiResp.text());
        throw new Error("OpenRouter API failed");
      }

      const aiData = await aiResp.json() as { choices: Array<{ message: { content: string } }> };
      interpretation = aiData.choices[0]?.message?.content ?? "";
    } else {
      return NextResponse.json({ 
        error: "No AI provider configured. Add GROQ_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY to .env.local" 
      }, { status: 503 });
    }
  } catch (e) {
    console.error("AI call failed:", e);

    return NextResponse.json({ error: "AI service error" }, { status: 503 });
  }

  const reading = await prisma.reading.create({
    data: {
      userId: user.id,
      question,
      context,
      cardCount,
      cards: drawnCards,
      interpretation,
      isFree,
      status: "COMPLETED",
    },
  });

  if (isFree) {
    await prisma.user.update({
      where: { id: user.id },
      data: { hasUsedFreeReading: true },
    });
  }

  if (!isFree && paymentOrderId) {
    await prisma.payment.update({
      where: { orderId: paymentOrderId },
      data: { readingId: reading.id },
    }).catch(() => null);
  }

  return NextResponse.json({
    success: true,
    reading: { id: reading.id, cards: drawnCards, interpretation, isFree },
  });
}
