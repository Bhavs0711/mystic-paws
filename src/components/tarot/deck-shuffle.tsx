"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Props {
  onComplete: () => void;
}

export function DeckShuffle({ onComplete }: Props) {
  const [phase, setPhase] = useState<"gathering" | "shuffling" | "done">("gathering");
  const [message, setMessage] = useState("The cat senses your energy...");

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase("shuffling");
      setMessage("The deck is being shuffled...");
    }, 1500);

    const t2 = setTimeout(() => {
      setMessage("The cards are aligning to your question...");
    }, 3500);

    const t3 = setTimeout(() => {
      setMessage("Reach in and choose your cards.");
      setPhase("done");
    }, 5500);

    const t4 = setTimeout(() => {
      onComplete();
    }, 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const shuffleCards = Array.from({ length: 7 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-8">
      <div className="relative w-64 h-64 mb-12">
        {/* Glow under deck */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 bg-blood/20 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Shuffling cards */}
        {shuffleCards.map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 flex items-center justify-center"
            animate={
              phase === "shuffling"
                ? {
                    x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 8), 0],
                    y: [0, -i * 5, 0],
                    rotate: [0, (i % 2 === 0 ? 1 : -1) * (5 + i * 3), 0],
                    zIndex: i,
                  }
                : { x: 0, y: -i * 2, rotate: (i - 3) * 0.5 }
            }
            transition={{
              duration: 0.6,
              repeat: phase === "shuffling" ? Infinity : 0,
              delay: i * 0.08,
              ease: "easeInOut",
            }}
          >
            <div
              className="relative w-32 h-52 rounded-xl overflow-hidden mystic-border"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
            >
              <Image
                src="/tarot_cards/back/tarot-card-back.png"
                alt="Tarot card back"
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          </motion.div>
        ))}

        {/* Cat paw overlay on shuffle */}
        <AnimatePresence>
          {phase === "shuffling" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-4xl"
            >
              🐾
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-6">
        {["gathering", "shuffling", "done"].map((p, i) => (
          <motion.div
            key={p}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              phase === p
                ? "bg-blood w-6"
                : i < ["gathering", "shuffling", "done"].indexOf(phase)
                ? "bg-blood/50"
                : "bg-border"
            }`}
          />
        ))}
      </div>

      <motion.p
        key={message}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-cinzel text-lg text-center text-muted-foreground max-w-xs"
      >
        {message}
      </motion.p>
    </div>
  );
}
