"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import {
  Users,
  BookOpen,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AdminStats {
  stats: {
    totalUsers: number;
    totalReadings: number;
    freeReadings: number;
    paidReadings: number;
    revenue: number;
    successfulPayments: number;
    failedPayments: number;
    usersWithFreeUsed: number;
    conversionRate: number;
  };
  blockReasonCounts: Record<string, number>;
  blockedQuestions: Array<{
    id: string;
    question: string;
    reason: string;
    createdAt: string;
    userId: string;
  }>;
  recentPayments: Array<{
    id: string;
    orderId: string;
    amount: number;
    status: string;
    createdAt: string;
    user: { name: string | null; email: string };
  }>;
  recentReadings: Array<{
    id: string;
    question: string;
    cardCount: number;
    isFree: boolean;
    status: string;
    createdAt: string;
    user: { name: string | null; email: string };
  }>;
}

const STAT_CARDS = [
  { key: "totalUsers", label: "Total Users", icon: Users, color: "text-plum-light" },
  { key: "totalReadings", label: "Total Readings", icon: BookOpen, color: "text-blood" },
  { key: "revenue", label: "Total Revenue", icon: IndianRupee, color: "text-yellow-500", format: "currency" },
  { key: "conversionRate", label: "Conversion Rate", icon: TrendingUp, color: "text-green-500", suffix: "%" },
  { key: "successfulPayments", label: "Paid Readings", icon: CreditCard, color: "text-blue-400" },
  { key: "failedPayments", label: "Failed Payments", icon: AlertTriangle, color: "text-red-500" },
];

export function AdminDashboardClient() {
  const [data, setData] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "payments" | "blocked" | "readings">("overview");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { setData(d as AdminStats); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-cinzel text-3xl font-bold text-foreground mb-1">
            ✦ Admin Dashboard
          </h1>
          <p className="font-cormorant text-muted-foreground">
            Mystic Paws analytics and management
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="font-cinzel text-muted-foreground animate-pulse">
              Loading oracle data...
            </p>
          </div>
        ) : data ? (
          <>
            {/* Stat grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {STAT_CARDS.map((card, i) => {
                const value = data.stats[card.key as keyof typeof data.stats];
                return (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="glass mystic-border rounded-xl p-4"
                  >
                    <card.icon className={`w-5 h-5 ${card.color} mb-3`} />
                    <p className={`font-cinzel text-xl font-bold ${card.color}`}>
                      {card.format === "currency"
                        ? formatCurrency(Number(value))
                        : card.suffix
                        ? `${value}${card.suffix}`
                        : value}
                    </p>
                    <p className="font-cormorant text-xs text-muted-foreground mt-1">
                      {card.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Free vs Paid breakdown */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="glass mystic-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-blood" />
                  <h3 className="font-cinzel text-sm text-foreground">Reading Breakdown</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-cormorant text-sm text-muted-foreground">Free Readings</span>
                    <span className="font-cinzel text-sm text-foreground">{data.stats.freeReadings}</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div
                      className="bg-blood h-1.5 rounded-full"
                      style={{ width: `${(data.stats.freeReadings / Math.max(data.stats.totalReadings, 1)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-cormorant text-sm text-muted-foreground">Paid Readings</span>
                    <span className="font-cinzel text-sm text-foreground">{data.stats.paidReadings}</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div
                      className="bg-plum-light h-1.5 rounded-full"
                      style={{ width: `${(data.stats.paidReadings / Math.max(data.stats.totalReadings, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="glass mystic-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-cinzel text-sm text-foreground">Blocked Question Categories</h3>
                </div>
                <div className="space-y-2">
                  {Object.entries(data.blockReasonCounts).map(([reason, count]) => (
                    <div key={reason} className="flex justify-between">
                      <span className="font-cormorant text-sm text-muted-foreground capitalize">{reason}</span>
                      <span className="font-cinzel text-sm text-yellow-500">{count}</span>
                    </div>
                  ))}
                  {Object.keys(data.blockReasonCounts).length === 0 && (
                    <p className="font-cormorant text-sm text-muted-foreground">No blocked questions yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {(["readings", "payments", "blocked"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-cinzel text-xs tracking-widest uppercase px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-blood text-white"
                      : "glass border border-border text-muted-foreground hover:border-blood/40"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "readings" && (
              <div className="glass mystic-border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-blood/10">
                      {["User", "Question", "Cards", "Type", "Status", "Date"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-cinzel text-xs text-muted-foreground tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentReadings.map((r) => (
                      <tr key={r.id} className="border-b border-border/30 hover:bg-blood/5">
                        <td className="px-4 py-3 font-cormorant text-sm text-foreground">{r.user.name ?? r.user.email}</td>
                        <td className="px-4 py-3 font-cormorant text-sm text-muted-foreground max-w-xs truncate">{r.question}</td>
                        <td className="px-4 py-3 font-cinzel text-sm text-foreground">{r.cardCount}</td>
                        <td className="px-4 py-3">
                          <span className={`font-cinzel text-xs px-2 py-0.5 rounded-full ${r.isFree ? "bg-green-900/30 text-green-400" : "bg-blood/20 text-blood"}`}>
                            {r.isFree ? "Free" : "Paid"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-cinzel text-xs text-muted-foreground">{r.status}</td>
                        <td className="px-4 py-3 font-cormorant text-xs text-muted-foreground">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="glass mystic-border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-blood/10">
                      {["User", "Order ID", "Amount", "Status", "Date"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-cinzel text-xs text-muted-foreground tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentPayments.map((p) => (
                      <tr key={p.id} className="border-b border-border/30 hover:bg-blood/5">
                        <td className="px-4 py-3 font-cormorant text-sm text-foreground">{p.user.name ?? p.user.email}</td>
                        <td className="px-4 py-3 font-cormorant text-xs text-muted-foreground">{p.orderId}</td>
                        <td className="px-4 py-3 font-cinzel text-sm text-blood">₹{p.amount}</td>
                        <td className="px-4 py-3">
                          <span className={`font-cinzel text-xs px-2 py-0.5 rounded-full ${
                            p.status === "SUCCESS" ? "bg-green-900/30 text-green-400" :
                            p.status === "FAILED" ? "bg-red-900/30 text-red-400" :
                            "bg-yellow-900/30 text-yellow-400"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-cormorant text-xs text-muted-foreground">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "blocked" && (
              <div className="space-y-3">
                {data.blockedQuestions.map((bq) => (
                  <div key={bq.id} className="glass mystic-border rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-cormorant text-sm text-muted-foreground flex-1">&ldquo;{bq.question}&rdquo;</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-cinzel text-xs px-2 py-0.5 rounded-full bg-yellow-900/30 text-yellow-400 capitalize">
                          {bq.reason}
                        </span>
                        <span className="font-cormorant text-xs text-muted-foreground">
                          {new Date(bq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {data.blockedQuestions.length === 0 && (
                  <div className="text-center py-12">
                    <p className="font-cinzel text-muted-foreground">No blocked questions yet</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="font-cinzel text-muted-foreground">Failed to load dashboard data.</p>
          </div>
        )}
      </div>
    </div>
  );
}
