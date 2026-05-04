import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getRazorpayInstance } from "@/lib/razorpay";
import { generateOrderId } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

const PRICES: Record<number, number> = { 3: 50, 6: 100 };

const schema = z.object({
  cardCount: z.union([z.literal(3), z.literal(6)]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { cardCount } = parsed.data;
  const amount = PRICES[cardCount];
  if (!amount) {
    return NextResponse.json({ error: "Invalid card count" }, { status: 400 });
  }

  try {
    const razorpay = getRazorpayInstance();
    const orderId = generateOrderId();

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: orderId,
      notes: {
        userId: session.user.id,
        cardCount: cardCount.toString(),
      },
    });

    // Create a placeholder reading to satisfy the FK constraint
    const placeholderReading = await prisma.reading.create({
      data: {
        userId: session.user.id,
        question: "Pending payment",
        context: "Pending payment",
        cardCount,
        cards: [],
        isFree: false,
        status: "PENDING",
      },
    });

    await prisma.payment.create({
      data: {
        userId: session.user.id,
        readingId: placeholderReading.id,
        orderId,
        amount,
        status: "PENDING",
        paytmResponse: { razorpayOrderId: razorpayOrder.id },
      },
    });

    return NextResponse.json({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
  }
}
