import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      console.error("Razorpay signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Update payment in DB
    await prisma.payment.update({
      where: { orderId },
      data: {
        txnId: razorpay_payment_id,
        status: "SUCCESS",
        paytmResponse: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
        },
      },
    }).catch((e) => console.error("Payment update error:", e));

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
