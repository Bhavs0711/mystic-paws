"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/layout/hero-section";
import { PricingSection } from "@/components/layout/pricing-section";
import { HowItWorksSection } from "@/components/layout/how-it-works";
import { Footer } from "@/components/layout/footer";
import { ParticleBackground } from "@/components/ui/particle-background";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      // Redirect authenticated users to reading page
      // but only if they navigated here intentionally
    }
  }, [session, router]);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <HowItWorksSection />
        <PricingSection />
        <Footer />
      </div>
    </main>
  );
}
