"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-blood/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-blood/40 group-hover:ring-blood transition-all duration-300">
              <Image
                src="/cat-mascot.jpg"
                alt="Mystic Paws"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div>
              <span className="font-cinzel text-lg font-bold text-gradient tracking-wider">
                Mystic Paws
              </span>
              <p className="text-xs text-muted-foreground font-cormorant italic -mt-1">
                AI Tarot Readings
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#how-it-works"
              className="font-cormorant text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="font-cormorant text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                <Link href="/reading">
                  <Button
                    size="sm"
                    className="bg-blood hover:bg-blood-light text-white font-cinzel text-xs tracking-wider blood-glow transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Begin Reading
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-plum/40 hover:ring-blood/60 transition-all">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name ?? "User"}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      ) : (
                        <div className="w-full h-full bg-plum flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 glass border-blood/20 bg-obsidian"
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-cinzel text-foreground truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator className="bg-blood/20" />
                    {session.user.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="cursor-pointer text-red-400 focus:text-red-400"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                onClick={() => signIn("google")}
                size="sm"
                className="bg-blood hover:bg-blood-light text-white font-cinzel text-xs tracking-wider blood-glow"
              >
                Sign In with Google
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
