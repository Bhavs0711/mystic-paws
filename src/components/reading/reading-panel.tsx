"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getCardBySlug } from "@/data/tarot-cards";
import { slugToName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, RefreshCw, MessageCircle, Moon } from "lucide-react";

interface Props {
  cards: string[];
  interpretation: string;
  isLoading: boolean;
  question: string;
  onNewReading: () => void;
  whatsappNumber: string;
}

const POSITION_NAMES_3 = ["Past / Root", "Present / Heart", "Future / Path"];
const POSITION_NAMES_6 = [
  "The Situation",
  "The Challenge",
  "Hidden Influence",
  "Recent Past",
  "Near Future",
  "The Outcome",
];

export function ReadingPanel({
  cards,
  interpretation,
  isLoading,
  question,
  onNewReading,
  whatsappNumber,
}: Props) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [allFlipped, setAllFlipped] = useState(false);

  const positionNames = cards.length === 3 ? POSITION_NAMES_3 : POSITION_NAMES_6;

  const flipCard = (index: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      next.add(index);
      if (next.size === cards.length) setAllFlipped(true);
      return next;
    });
  };

  const flipAllCards = () => {
    const all = new Set(cards.map((_, i) => i));
    setFlippedCards(all);
    setAllFlipped(true);
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi! I'd like to book a personal 1:1 tarot reading."
  )}`;

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-2 gap-8"
      >
        {/* Left: Card spread */}
        <div>
          <div className="text-center mb-6">
            <h2 className="font-cinzel text-2xl font-bold text-foreground mb-1">
              Your Cards
            </h2>
            <p className="font-cormorant text-muted-foreground italic text-sm">
              &ldquo;{question}&rdquo;
            </p>
            {!allFlipped && (
              <Button
                onClick={flipAllCards}
                variant="outline"
                size="sm"
                className="mt-3 border-blood/30 font-cinzel text-xs tracking-wider hover:border-blood/60"
              >
                Reveal All Cards
              </Button>
            )}
          </div>

          {/* Cards grid */}
          <div
            className={`grid gap-4 ${
              cards.length === 3 ? "grid-cols-3" : "grid-cols-3"
            }`}
          >
            {cards.map((slug, index) => {
              const card = getCardBySlug(slug);
              const isFlipped = flippedCards.has(index);

              return (
                <motion.div
                  key={`${slug}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15 }}
                  className="flex flex-col items-center gap-2"
                >
                  {/* Position label */}
                  <p className="font-cinzel text-xs text-muted-foreground tracking-wider text-center">
                    {positionNames[index]}
                  </p>

                  {/* Card flip container */}
                  <div
                    className="tarot-card-container w-full relative cursor-pointer group"
                    style={{ height: "200px" }}
                    onClick={() => !isFlipped && flipCard(index)}
                  >
                    <div
                      className={`tarot-card-inner w-full h-full ${
                        isFlipped ? "flipped" : ""
                      }`}
                    >
                      {/* Back */}
                      <div className="tarot-card-back rounded-xl overflow-hidden mystic-border group-hover:shadow-blood-glow">
                        <Image
                          src="/tarot_cards/back/tarot-card-back.png"
                          alt="Card back"
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                        {!isFlipped && (
                          <div className="absolute inset-0 flex items-end justify-center pb-3">
                            <span className="font-cinzel text-xs text-white/70">
                              Tap to reveal
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Front */}
                      <div className="tarot-card-front rounded-xl overflow-hidden mystic-border shadow-blood-glow">
                        <Image
                          src={`/tarot_cards/front/${slug}.png`}
                          alt={card?.name ?? slug}
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card name */}
                  <AnimatePresence>
                    {isFlipped && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-cinzel text-xs text-center text-foreground font-semibold"
                      >
                        {card?.name ?? slugToName(slug)}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Human reading CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 glass mystic-border rounded-xl p-5 text-center"
          >
            <p className="font-cinzel text-sm text-foreground mb-1">
              Want a personal 1:1 reading from us?
            </p>
            <p className="font-cormorant text-muted-foreground text-sm mb-3">
              Connect directly with our gifted human readers via WhatsApp.
            </p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="sm"
                className="border-blood/40 hover:bg-blood/10 font-cinzel text-xs tracking-wider"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                Book via WhatsApp
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Right: Interpretation panel */}
        <div className="glass mystic-border rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-blood/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blood/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blood" />
            </div>
            <div>
              <h3 className="font-cinzel text-base font-semibold text-foreground">
                Your Reading
              </h3>
              <p className="font-cormorant text-xs text-muted-foreground">
                {cards.length}-card interpretation
              </p>
            </div>
          </div>

          <ScrollArea className="flex-1" style={{ height: "600px" }}>
            <div className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center gap-6 py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Moon className="w-10 h-10 text-blood" />
                  </motion.div>
                  <div className="text-center">
                    <p className="font-cinzel text-base text-foreground mb-2">
                      The Oracle Weaves Your Reading
                    </p>
                    <p className="font-cormorant text-muted-foreground text-sm">
                      This wisdom is crafted especially for you. Please wait...
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {interpretation.split("\n\n").map((para, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`font-cormorant text-base leading-relaxed mb-4 ${
                        para.startsWith("**") || para.startsWith("##")
                          ? "font-cinzel text-sm font-semibold text-blood uppercase tracking-widest"
                          : "text-muted-foreground"
                      }`}
                    >
                      {para.replace(/\*\*/g, "").replace(/##/g, "")}
                    </motion.p>
                  ))}
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Footer actions */}
          {!isLoading && interpretation && (
            <div className="p-4 border-t border-blood/10">
              <Button
                onClick={onNewReading}
                variant="outline"
                className="w-full border-blood/30 font-cinzel text-xs tracking-wider hover:border-blood/60"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Begin a New Reading
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
