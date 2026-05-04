import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Mystic Paws — AI Tarot Readings",
  description:
    "Receive deeply personal AI tarot readings guided by the mystical black cat. Illuminate your path with ancient wisdom and modern insight.",
  keywords: "tarot reading, AI tarot, mystical, spiritual guidance, tarot cards",
  openGraph: {
    title: "Mystic Paws — AI Tarot Readings",
    description: "Deeply personal AI tarot readings. Your journey illuminated.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${cinzel.variable} ${cormorant.variable} font-cormorant bg-void text-foreground antialiased`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
