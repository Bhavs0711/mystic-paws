import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { validateQuestion, validateContext } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  question: z.string().min(1).max(500),
  context: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = checkRateLimit(`validate:${session.user.id}`, {
    maxRequests: 20,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { question, context } = parsed.data;

  const qResult = validateQuestion(question);
  if (!qResult.valid) {
    // Log blocked question
    if ((qResult as { blockedCategory?: string }).blockedCategory) {
      await prisma.blockedQuestion.create({
        data: {
          userId: session.user.id,
          question,
          reason: (qResult as { blockedCategory?: string }).blockedCategory ?? "unknown",
        },
      });
    }
    return NextResponse.json({ valid: false, reason: qResult.reason }, { status: 200 });
  }

  const cResult = validateContext(context);
  if (!cResult.valid) {
    return NextResponse.json({ valid: false, reason: cResult.reason }, { status: 200 });
  }

  return NextResponse.json({ valid: true });
}
