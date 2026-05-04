"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock, Sparkles, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  cardCount: 3 | 6;
  onSuccess: (orderId: string) => void;
}

const PRICES: Record<number, number> = { 3: 50, 6: 100 };

export function PaymentModal({ open, onClose, cardCount, onSuccess }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const amount = PRICES[cardCount];

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardCount }),
      });

      const data = await res.json() as {
        orderId?: string;
        razorpayOrderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        error?: string;
      };

      if (!data.orderId || !data.razorpayOrderId || !data.keyId) {
        throw new Error(data.error ?? "Payment initiation failed");
      }

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: data.keyId,
          amount: data.amount! * 100,
          currency: data.currency,
          name: "Mystic Paws",
          description: `${cardCount}-Card Tarot Reading`,
          order_id: data.razorpayOrderId,
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            // Verify payment
            const verifyRes = await fetch("/api/payment/callback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              }),
            });

            const verifyData = await verifyRes.json() as { success?: boolean; orderId?: string };
            if (verifyData.success) {
              onSuccess(verifyData.orderId!);
              toast({
                title: "Payment Successful ✦",
                description: "Your offering has been received. The cards await.",
              });
            } else {
              throw new Error("Payment verification failed");
            }
          },
          prefill: {
            name: "",
            email: "",
          },
          theme: {
            color: "#8B0000",
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
    } catch {
      toast({
        title: "Payment Error",
        description: "Could not initiate payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass mystic-border bg-obsidian max-w-md border-blood/30">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-xl text-foreground flex items-center gap-2">
            {cardCount === 6 ? (
              <Crown className="w-5 h-5 text-blood" />
            ) : (
              <Sparkles className="w-5 h-5 text-blood" />
            )}
            Complete Your Offering
          </DialogTitle>
          <DialogDescription className="font-cormorant text-muted-foreground">
            Your free reading has been used. A modest offering opens the oracle
            once more.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Reading summary */}
          <div className="glass rounded-xl p-4 border border-blood/20">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-cinzel text-sm text-foreground">
                  {cardCount}-Card Reading
                </p>
                <p className="font-cormorant text-xs text-muted-foreground">
                  {cardCount === 3 ? "Past · Present · Future" : "Full 6-position spread"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-cinzel text-2xl font-bold text-blood">₹{amount}</p>
              </div>
            </div>

            <div className="border-t border-border pt-3 space-y-1.5">
              <p className="font-cormorant text-xs text-muted-foreground flex items-center gap-1.5">
                ✦ Deeply personalized AI interpretation
              </p>
              <p className="font-cormorant text-xs text-muted-foreground flex items-center gap-1.5">
                ✦ Synergy analysis between all {cardCount} cards
              </p>
              <p className="font-cormorant text-xs text-muted-foreground flex items-center gap-1.5">
                ✦ Emotional & subconscious insights
              </p>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5 text-plum-light" />
            <span className="font-cormorant">
              Payments secured by Razorpay. We never store your card details.
            </span>
          </div>

          {/* Pay button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-blood hover:bg-blood-light text-white font-cinzel tracking-wider py-6 blood-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <CreditCard className="w-4 h-4" />
                </motion.div>
                Opening Razorpay...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Pay ₹{amount} via Razorpay
              </span>
            )}
          </Button>

          <button
            onClick={onClose}
            className="w-full text-xs font-cinzel text-muted-foreground hover:text-foreground transition-colors tracking-wider"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
