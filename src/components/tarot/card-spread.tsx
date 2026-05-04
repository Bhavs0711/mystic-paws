"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CARD_SLUGS } from "@/data/tarot-cards";
import { shuffle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon } from "lucide-react";

interface Props {
  cardCount: 3 | 6;
  onCardsSelected: (cards: string[]) => void;
  isLoading: boolean;
}

export function CardSpread({ cardCount, onCardsSelected, isLoading }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const shuffledSlugs = useMemo(() => shuffle(CARD_SLUGS), []);

  const toggleCard = (index: number) => {
    if (isLoading) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else if (next.size < cardCount) {
        next.add(index);
      }
      return next;
    });
  };

  const handleReveal = () => {
    const chosenSlugs = Array.from(selected).map((i) => shuffledSlugs[i]);
    onCardsSelected(chosenSlugs);
  };

  const remaining = cardCount - selected.size;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-foreground mb-2">
          Choose Your {cardCount} Cards
        </h2>
        <p className="font-cormorant text-lg text-muted-foreground">
          {remaining > 0
            ? `Touch the cards that call to you — ${remaining} more to select`
            : "Your cards have been chosen. The oracle is ready."}
        </p>
      </motion.div>

      {/* Card grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="grid gap-1.5 mb-8"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
        }}
      >
        {shuffledSlugs.map((slug, index) => {
          const isSelected = selected.has(index);
          const canSelect = !isSelected && selected.size < cardCount;

          return (
            <motion.div
              key={`${slug}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.008 }}
              onClick={() => toggleCard(index)}
              className={`relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "card-selected ring-2 ring-blood scale-105 z-10"
                  : canSelect
                  ? "card-hover-glow hover:-translate-y-1"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <Image
                src="/tarot_cards/back/tarot-card-back.png"
                alt="Tarot card"
                fill
                className="object-cover"
                sizes="70px"
              />
              {/* Selection overlay */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-blood/30 flex items-center justify-center"
                  >
                    <span className="text-white font-cinzel text-xs font-bold">
                      {Array.from(selected).indexOf(index) + 1}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Selected count & CTA */}
      <div className="flex flex-col items-center gap-4">
        {/* Selection indicator */}
        <div className="flex gap-2">
          {Array.from({ length: cardCount }, (_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i < selected.size ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`w-3 h-3 rounded-full transition-all ${
                i < selected.size ? "bg-blood shadow-blood-glow" : "bg-border"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleReveal}
          disabled={selected.size < cardCount || isLoading}
          className="bg-blood hover:bg-blood-light text-white font-cinzel tracking-wider px-10 py-6 text-base blood-glow transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Moon className="w-4 h-4 animate-spin" />
              The Oracle Reads...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Reveal My Reading
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
