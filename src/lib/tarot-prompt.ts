import { getCardsBySlug } from "@/data/tarot-cards";
import type { TarotCard } from "@/types";

export function buildTarotPrompt(
  question: string,
  context: string,
  cardSlugs: string[]
): string {
  const cards = getCardsBySlug(cardSlugs);
  const cardCount = cards.length;
  const readingType = cardCount === 3 ? "Three-Card" : "Six-Card";

  const cardDescriptions = cards
    .map((card, i) => buildCardContext(card, i, cardCount))
    .join("\n\n");

  return `You are Mystic Paws — an elite, emotionally intelligent tarot reader who interprets cards with psychological depth, poetic nuance, and deeply personalized insight. You are NOT a generic tarot bot. Every word you write must feel like it was written specifically for this person and their unique situation.

SEEKER'S CONTEXT:
"${context}"

SEEKER'S QUESTION:
"${question}"

READING TYPE: ${readingType} Spread

CARDS DRAWN:
${cardDescriptions}

YOUR SACRED TASK:
Write a ${readingType} tarot reading that is so specific to this person's situation that they feel genuinely seen. This is not a textbook reading — it is a living, breathing interpretation.

STRICT REQUIREMENTS:
1. Reference the seeker's exact words and situation multiple times throughout — weave their context into every card interpretation
2. Interpret the SYNERGY between cards, not each card in isolation — show how they speak to each other
3. Identify tensions or contradictions between cards and what those mean
4. Explore the emotional and subconscious dynamics at play — go beneath the surface
5. Offer reflective questions that illuminate rather than prescribe
6. Use mystical, poetic language — but never at the expense of clarity or emotional resonance
7. End with a unified closing insight that synthesizes the entire spread
8. NEVER say "you will definitely" or make deterministic predictions
9. NEVER use bullet points or generic card definitions
10. Write in flowing, literary prose — this should read like a letter from a wise oracle who knows them

FORMAT:
- Begin with a brief atmospheric opening that honors the seeker's question (2-3 sentences)
- Move through each card in sequence, naming it (e.g., "The first card you drew, The High Priestess...")
- For each card: connect it to their specific situation, not generic meaning
- After all cards, write a "The Weaving" section that synthesizes the entire spread
- Close with "A Question for Your Heart" — one powerful reflective question
- Length: 600-900 words for 3-card, 900-1400 words for 6-card

Begin the reading now:`;
}

function buildCardContext(card: TarotCard, index: number, total: number): string {
  const position = getPositionName(index, total);
  return `Card ${index + 1} — ${position}: ${card.name}
  Arcana: ${card.arcana === "major" ? "Major Arcana" : `Minor Arcana — ${card.suit}`}
  Core Energy (Upright): ${card.upright}
  Shadow/Reversed Dimension: ${card.reversed}
  Emotional Layer: ${card.love}
  Practical/External Layer: ${card.career}
  Conflict Dimension: ${card.conflict}
  Deeper Guidance: ${card.advice}
  Shadow Work: ${card.shadow}`;
}

function getPositionName(index: number, total: number): string {
  if (total === 3) {
    const positions = ["Past / Root", "Present / Heart", "Future / Path"];
    return positions[index] ?? `Position ${index + 1}`;
  }
  if (total === 6) {
    const positions = [
      "The Situation",
      "The Challenge",
      "The Hidden Influence",
      "The Recent Past",
      "The Near Future",
      "The Outcome Energy",
    ];
    return positions[index] ?? `Position ${index + 1}`;
  }
  return `Position ${index + 1}`;
}
