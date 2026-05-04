export interface TarotCard {
  slug: string;
  name: string;
  number: number;
  arcana: "major" | "minor";
  suit: "cups" | "wands" | "swords" | "pentacles" | null;
  upright: string;
  reversed: string;
  love: string;
  career: string;
  conflict: string;
  advice: string;
  shadow: string;
}

export interface Reading {
  id: string;
  userId: string;
  question: string;
  context: string;
  cardCount: number;
  cards: string[];
  interpretation: string | null;
  isFree: boolean;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isAdmin: boolean;
  hasUsedFreeReading: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  readingId: string;
  orderId: string;
  txnId: string | null;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  createdAt: Date;
}

export type ReadingStep =
  | "form"
  | "shuffle"
  | "spread"
  | "reading";

export interface ReadingFormData {
  question: string;
  context: string;
  cardCount: 3 | 6;
}
