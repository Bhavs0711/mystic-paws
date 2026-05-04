import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    totalUsers,
    totalReadings,
    freeReadings,
    paidReadings,
    successfulPayments,
    failedPayments,
    blockedQuestions,
    recentPayments,
    recentReadings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.reading.count(),
    prisma.reading.count({ where: { isFree: true } }),
    prisma.reading.count({ where: { isFree: false } }),
    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.count({ where: { status: "FAILED" } }),
    prisma.blockedQuestion.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        question: true,
        reason: true,
        createdAt: true,
        userId: true,
      },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.reading.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const usersWithFreeUsed = await prisma.user.count({
    where: { hasUsedFreeReading: true },
  });

  const conversionRate =
    usersWithFreeUsed > 0
      ? ((paidReadings / usersWithFreeUsed) * 100).toFixed(1)
      : "0";

  // Block reason breakdown
  const blockReasonCounts = blockedQuestions.reduce<Record<string, number>>(
    (acc, bq) => {
      acc[bq.reason] = (acc[bq.reason] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return NextResponse.json({
    stats: {
      totalUsers,
      totalReadings,
      freeReadings,
      paidReadings,
      revenue: successfulPayments._sum.amount ?? 0,
      successfulPayments: successfulPayments._count,
      failedPayments,
      usersWithFreeUsed,
      conversionRate: parseFloat(conversionRate),
    },
    blockReasonCounts,
    blockedQuestions,
    recentPayments,
    recentReadings,
  });
}
