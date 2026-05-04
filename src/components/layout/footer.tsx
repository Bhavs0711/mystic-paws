import Link from "next/link";
import Image from "next/image";
import { Moon } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-blood/10 py-12 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-blood/30">
              <Image
                src="/cat-mascot.jpg"
                alt="Mystic Paws"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="font-cinzel text-sm font-bold text-gradient">
              Mystic Paws
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/#how-it-works"
              className="text-xs font-cinzel text-muted-foreground hover:text-foreground transition-colors tracking-wider"
            >
              How It Works
            </Link>
            <Link
              href="/#pricing"
              className="text-xs font-cinzel text-muted-foreground hover:text-foreground transition-colors tracking-wider"
            >
              Pricing
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-cinzel text-muted-foreground hover:text-foreground transition-colors tracking-wider"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-cormorant">
            <Moon className="w-3 h-3 text-blood" />
            <span>
              © {new Date().getFullYear()} Mystic Paws. All rights reserved.
            </span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground/50 font-cormorant italic max-w-2xl mx-auto">
            Tarot readings are for entertainment and reflective purposes only.
            They do not constitute professional advice of any kind. Always seek
            qualified professional guidance for important life decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
