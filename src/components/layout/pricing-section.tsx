"use client";

import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Check, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "First Sight",
    price: "Free",
    priceNote: "One time, forever",
    cards: 3,
    icon: Sparkles,
    highlight: false,
    features: [
      "3-Card Reading",
      "Past · Present · Future spread",
      "Full AI interpretation",
      "Deeply personalized insight",
      "One reading per account",
    ],
    cta: "Begin Free Reading",
  },
  {
    name: "Brief Reading",
    price: "₹50",
    priceNote: "Per reading",
    cards: 3,
    icon: Sparkles,
    highlight: false,
    features: [
      "3-Card Reading",
      "Past · Present · Future spread",
      "Full AI interpretation",
      "Personalized to your situation",
      "Unlimited readings",
    ],
    cta: "Get 3-Card Reading",
  },
  {
    name: "Deep Reading",
    price: "₹100",
    priceNote: "Per reading",
    cards: 6,
    icon: Crown,
    highlight: true,
    features: [
      "6-Card Reading",
      "Full Celtic Cross variant",
      "Extended AI interpretation",
      "Shadow & subconscious layers",
      "Contradiction & tension analysis",
      "Most popular choice",
    ],
    cta: "Get 6-Card Reading",
  },
];

export function PricingSection() {
  const { data: session } = useSession();

  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-plum/5 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-cinzel tracking-widest text-blood uppercase mb-3">
            Offerings
          </p>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Depth
          </h2>
          <p className="font-cormorant text-xl text-muted-foreground max-w-2xl mx-auto">
            Every seeker begins with one free reading. Those who wish to go
            deeper may return for a modest offering.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative rounded-2xl overflow-hidden ${
                plan.highlight
                  ? "ring-2 ring-blood shadow-blood-glow"
                  : "mystic-border"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blood via-crimson to-blood" />
              )}

              <div
                className={`p-8 ${
                  plan.highlight
                    ? "bg-gradient-to-b from-blood/10 to-plum/10"
                    : "glass"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      plan.highlight ? "bg-blood/20" : "bg-plum/10"
                    }`}
                  >
                    <plan.icon
                      className={`w-5 h-5 ${
                        plan.highlight ? "text-blood" : "text-plum-light"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-cinzel font-bold text-foreground">
                      {plan.name}
                    </h3>
                    {plan.highlight && (
                      <span className="text-xs font-cinzel text-blood tracking-widest uppercase">
                        Most Popular
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <span className="font-cinzel text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="ml-2 font-cormorant text-muted-foreground">
                    {plan.priceNote}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-blood mt-0.5 flex-shrink-0" />
                      <span className="font-cormorant text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {session?.user ? (
                  <Link href="/reading">
                    <Button
                      className={`w-full font-cinzel tracking-wider transition-all duration-300 ${
                        plan.highlight
                          ? "bg-blood hover:bg-blood-light blood-glow text-white hover:scale-105"
                          : "bg-plum/30 hover:bg-plum/50 border border-plum/40 text-foreground"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => signIn("google")}
                    className={`w-full font-cinzel tracking-wider transition-all duration-300 ${
                      plan.highlight
                        ? "bg-blood hover:bg-blood-light blood-glow text-white hover:scale-105"
                        : "bg-plum/30 hover:bg-plum/50 border border-plum/40 text-foreground"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Human reading CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-block glass mystic-border rounded-2xl px-8 py-6 max-w-2xl">
            <p className="font-cinzel text-lg text-foreground mb-2">
              Seeking a deeper, human connection?
            </p>
            <p className="font-cormorant text-muted-foreground mb-4">
              Our gifted human readers offer personalised 1:1 sessions for
              seekers who need more than the AI can offer.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="border-blood/40 text-foreground hover:bg-blood/10 font-cinzel tracking-wider"
              >
                Book a Human Reading via WhatsApp
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
