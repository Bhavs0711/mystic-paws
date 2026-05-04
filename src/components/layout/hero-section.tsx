"use client";

import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Moon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const { data: session } = useSession();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blood/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-plum/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blood/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-6"
            >
              <Moon className="w-4 h-4 text-blood" />
              <span className="text-xs font-cinzel tracking-widest text-muted-foreground uppercase">
                Ancient Wisdom · Modern Insight
              </span>
              <Star className="w-4 h-4 text-plum-light" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-cinzel text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              <span className="text-foreground">The Cards</span>
              <br />
              <span className="text-gradient">Know Your</span>
              <br />
              <span className="text-foreground">Story</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-cormorant text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg"
            >
              Receive deeply personal AI tarot readings guided by our mystical
              black cat familiar. Every interpretation is woven uniquely from your
              situation — no templates, no generalities. Only truth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {session?.user ? (
                <Link href="/reading">
                  <Button
                    size="lg"
                    className="bg-blood hover:bg-blood-light text-white font-cinzel tracking-wider blood-glow transition-all duration-300 hover:scale-105 px-8 py-6 text-base"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Begin Your Reading
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  onClick={() => signIn("google")}
                  className="bg-blood hover:bg-blood-light text-white font-cinzel tracking-wider blood-glow transition-all duration-300 hover:scale-105 px-8 py-6 text-base"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Begin Your Free Reading
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border-blood/30 text-muted-foreground hover:text-foreground hover:border-blood/60 font-cinzel tracking-wider px-8 py-6 text-base"
              >
                How It Works
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 text-sm text-muted-foreground font-cormorant italic"
            >
              ✦ First reading is always free — no card required
            </motion.p>
          </motion.div>

          {/* Right: Cat mascot + floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full border border-blood/20 animate-pulse-glow" />
              <div className="absolute w-72 h-72 rounded-full border border-plum/20" />
            </div>

            {/* Cat image */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <div className="relative w-72 h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden mystic-border">
                <Image
                  src="/cat-mascot.jpg"
                  alt="Mystic Paws — Your Tarot Guide"
                  fill
                  className="object-cover scale-110"
                  sizes="(max-width: 1024px) 288px, 320px"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent" />
              </div>

              {/* Caption */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-1.5 rounded-full border border-blood/30 whitespace-nowrap">
                <p className="text-xs font-cinzel text-muted-foreground tracking-widest">
                  YOUR MYSTICAL GUIDE
                </p>
              </div>
            </motion.div>

            {/* Floating tarot card decorations */}
            <motion.div
              animate={{ rotate: ["-8deg", "-5deg", "-8deg"], y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 top-1/4 w-20 h-32 rounded-lg overflow-hidden mystic-border opacity-70"
              style={{ transform: "rotate(-15deg)" }}
            >
              <Image
                src="/tarot_cards/back/tarot-card-back.png"
                alt="Tarot card"
                fill
                className="object-cover"
                sizes="80px"
              />
            </motion.div>

            <motion.div
              animate={{ rotate: ["8deg", "11deg", "8deg"], y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-4 top-1/3 w-20 h-32 rounded-lg overflow-hidden mystic-border opacity-70"
              style={{ transform: "rotate(15deg)" }}
            >
              <Image
                src="/tarot_cards/back/tarot-card-back.png"
                alt="Tarot card"
                fill
                className="object-cover"
                sizes="80px"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
