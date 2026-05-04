"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { User, ReadingStep, ReadingFormData } from "@/types";
import { Navbar } from "@/components/layout/navbar";
import { ParticleBackground } from "@/components/ui/particle-background";
import { ReadingForm } from "@/components/reading/reading-form";
import { DeckShuffle } from "@/components/tarot/deck-shuffle";
import { CardSpread } from "@/components/tarot/card-spread";
import { ReadingPanel } from "@/components/reading/reading-panel";
import { PaymentModal } from "@/components/reading/payment-modal";
import { useToast } from "@/hooks/use-toast";

interface Props {
  user: User;
}

export function ReadingClient({ user }: Props) {
  const [step, setStep] = useState<ReadingStep>("form");
  const [formData, setFormData] = useState<ReadingFormData | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasUsedFree, setHasUsedFree] = useState(user.hasUsedFreeReading);
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);

  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Handle Paytm payment callback redirect
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const orderId = searchParams.get("orderId");

    if (paymentStatus === "success" && orderId) {
      setPaymentOrderId(orderId);
      toast({
        title: "Payment Successful ✦",
        description: "Your offering has been received. The cards await.",
      });
      // If we have formData stored, proceed to create reading
      const stored = sessionStorage.getItem("mysticpaws_formdata");
      if (stored) {
        const fd = JSON.parse(stored) as ReadingFormData;
        setFormData(fd);
        setStep("shuffle");
      }
    } else if (paymentStatus === "failed") {
      toast({
        title: "Payment Failed",
        description: "Your payment could not be processed. Please try again.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  const handleFormSubmit = async (data: ReadingFormData) => {
    // Validate question via API
    setIsLoading(true);
    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: data.question, context: data.context }),
      });
      const json = await res.json() as { valid: boolean; reason?: string };

      if (!json.valid) {
        toast({
          title: "Question Not Permitted",
          description: json.reason,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setFormData(data);

      // Check if payment required
      if (hasUsedFree) {
        // Store form data for after payment redirect
        sessionStorage.setItem("mysticpaws_formdata", JSON.stringify(data));
        setShowPaymentModal(true);
        setIsLoading(false);
        return;
      }

      setStep("shuffle");
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleShuffleComplete = () => {
    setStep("spread");
  };

  const handleCardsSelected = async (cards: string[]) => {
    setSelectedCards(cards);
    setIsLoading(true);
    setStep("reading");

    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: formData?.question,
          context: formData?.context,
          cardCount: formData?.cardCount,
          cards,
          paymentOrderId,
        }),
      });

      const json = await res.json() as {
        success?: boolean;
        reading?: { id: string; cards: string[]; interpretation: string; isFree: boolean };
        error?: string;
        requiresPayment?: boolean;
      };

      if (json.requiresPayment) {
        setShowPaymentModal(true);
        setStep("spread");
        setIsLoading(false);
        return;
      }

      if (!json.success || !json.reading) {
        throw new Error(json.error ?? "Reading failed");
      }

      setInterpretation(json.reading.interpretation);
      setSelectedCards(json.reading.cards);

      if (json.reading.isFree) {
        setHasUsedFree(true);
      }

      // Clear stored form data
      sessionStorage.removeItem("mysticpaws_formdata");
    } catch {
      toast({
        title: "Reading Failed",
        description: "The oracle could not be reached. Please try again.",
        variant: "destructive",
      });
      setStep("form");
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setStep("form");
    setFormData(null);
    setSelectedCards([]);
    setInterpretation("");
    setPaymentOrderId(null);
  };

  const handlePaymentSuccess = (orderId: string) => {
    setPaymentOrderId(orderId);
    setShowPaymentModal(false);
    setStep("shuffle");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="pt-16 min-h-screen">
          <AnimatePresence mode="wait">
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4"
              >
                <ReadingForm
                  user={user}
                  hasUsedFree={hasUsedFree}
                  isLoading={isLoading}
                  onSubmit={handleFormSubmit}
                />
              </motion.div>
            )}

            {step === "shuffle" && (
              <motion.div
                key="shuffle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-[calc(100vh-64px)]"
              >
                <DeckShuffle onComplete={handleShuffleComplete} />
              </motion.div>
            )}

            {step === "spread" && formData && (
              <motion.div
                key="spread"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 pt-8"
              >
                <CardSpread
                  cardCount={formData.cardCount}
                  onCardsSelected={handleCardsSelected}
                  isLoading={isLoading}
                />
              </motion.div>
            )}

            {step === "reading" && (
              <motion.div
                key="reading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 pt-8"
              >
                <ReadingPanel
                  cards={selectedCards}
                  interpretation={interpretation}
                  isLoading={isLoading}
                  question={formData?.question ?? ""}
                  onNewReading={handleReset}
                  whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        cardCount={formData?.cardCount ?? 3}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
