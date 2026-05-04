"use client";

import { motion } from "framer-motion";
import { LogIn, FileText, Layers, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: LogIn,
    number: "01",
    title: "Sign In",
    description:
      "Connect with Google to begin. Your identity anchors the reading to your unique energy.",
  },
  {
    icon: FileText,
    number: "02",
    title: "Share Your Story",
    description:
      "Tell the cards your situation and question. The more honest you are, the more the cards reveal.",
  },
  {
    icon: Layers,
    number: "03",
    title: "Choose Your Cards",
    description:
      "Watch the deck shuffle. Then reach into the spread and draw the cards that call to you.",
  },
  {
    icon: Sparkles,
    number: "04",
    title: "Receive Your Reading",
    description:
      "Our AI oracle weaves your cards into a deeply personal, psychologically rich interpretation.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-blood/20 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-cinzel tracking-widest text-blood uppercase mb-3">
            The Ritual
          </p>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="font-cormorant text-xl text-muted-foreground max-w-2xl mx-auto">
            A four-step ceremony between you, the cards, and the ancient
            intelligence that moves through both.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative group"
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-blood/30 to-transparent z-0 -translate-y-1/2" />
              )}

              <div className="relative z-10 glass mystic-border rounded-2xl p-6 hover:border-blood/50 transition-all duration-300 group-hover:shadow-blood-glow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blood/10 border border-blood/20 flex items-center justify-center group-hover:bg-blood/20 transition-colors">
                    <step.icon className="w-5 h-5 text-blood" />
                  </div>
                  <span className="font-cinzel text-3xl font-bold text-blood/20 group-hover:text-blood/40 transition-colors">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-cinzel text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="font-cormorant text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
