"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Moon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { User, ReadingFormData } from "@/types";

interface Props {
  user: User;
  hasUsedFree: boolean;
  isLoading: boolean;
  onSubmit: (data: ReadingFormData) => void;
}

export function ReadingForm({ user, hasUsedFree, isLoading, onSubmit }: Props) {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [cardCount, setCardCount] = useState<3 | 6>(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ question, context, cardCount });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full max-w-2xl"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block text-4xl mb-4"
        >
          🐱
        </motion.div>
        <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-foreground mb-3">
          The Oracle Awaits
        </h1>
        <p className="font-cormorant text-lg text-muted-foreground">
          Welcome, <span className="text-foreground font-medium">{user.name?.split(" ")[0] ?? "Seeker"}</span>.{" "}
          {hasUsedFree
            ? "Choose your reading depth and share what the cards should illuminate."
            : "Your first reading is complimentary. Speak honestly — the cards already know."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Count Selection */}
        <div className="space-y-3">
          <Label className="font-cinzel text-xs tracking-widest text-muted-foreground uppercase">
            Reading Depth
          </Label>
          <div className="grid grid-cols-2 gap-4">
            {([3, 6] as const).map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setCardCount(count)}
                className={`relative p-5 rounded-xl border text-left transition-all duration-300 ${
                  cardCount === count
                    ? "border-blood bg-blood/10 shadow-blood-glow"
                    : "border-border glass hover:border-blood/40"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-cinzel text-lg font-bold text-foreground">
                    {count} Cards
                  </span>
                  {hasUsedFree && (
                    <span className={`font-cinzel text-sm font-bold ${
                      cardCount === count ? "text-blood" : "text-muted-foreground"
                    }`}>
                      ₹{count === 3 ? "50" : "100"}
                    </span>
                  )}
                  {!hasUsedFree && (
                    <span className="font-cinzel text-xs text-blood">FREE</span>
                  )}
                </div>
                <p className="font-cormorant text-sm text-muted-foreground">
                  {count === 3
                    ? "Past · Present · Future — swift, clear guidance"
                    : "Six-position spread — deep psychological insight and shadow work"}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Context */}
        <div className="space-y-2">
          <Label
            htmlFor="context"
            className="font-cinzel text-xs tracking-widest text-muted-foreground uppercase"
          >
            Your Situation
          </Label>
          <textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe what is happening in your life right now. Be as honest and specific as you can — the depth of your reading depends on the depth of your sharing..."
            rows={5}
            maxLength={2000}
            required
            className="w-full glass mystic-border rounded-xl px-4 py-3 font-cormorant text-base text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-blood/60 focus:shadow-blood-glow transition-all"
          />
          <p className="text-xs text-muted-foreground/60 text-right">
            {context.length}/2000
          </p>
        </div>

        {/* Question */}
        <div className="space-y-2">
          <Label
            htmlFor="question"
            className="font-cinzel text-xs tracking-widest text-muted-foreground uppercase"
          >
            Your Question for the Cards
          </Label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What do you wish the cards to illuminate? Frame it as seeking guidance rather than certainty — e.g., 'What is blocking me from...?' or 'What do I need to understand about...?'"
            rows={3}
            maxLength={500}
            required
            className="w-full glass mystic-border rounded-xl px-4 py-3 font-cormorant text-base text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-blood/60 focus:shadow-blood-glow transition-all"
          />
          <p className="text-xs text-muted-foreground/60 text-right">
            {question.length}/500
          </p>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2.5 glass rounded-xl px-4 py-3 border border-plum/20">
          <Info className="w-4 h-4 text-plum-light mt-0.5 flex-shrink-0" />
          <p className="font-cormorant text-sm text-muted-foreground">
            Readings are not available for questions about exam results, death,
            medical conditions, fertility, or legal outcomes. Please ask
            reflective, guidance-based questions.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !question.trim() || !context.trim()}
          className="w-full bg-blood hover:bg-blood-light text-white font-cinzel tracking-wider py-6 text-base blood-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Moon className="w-4 h-4 animate-spin" />
              Consulting the Oracle...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Shuffle the Deck
            </span>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
