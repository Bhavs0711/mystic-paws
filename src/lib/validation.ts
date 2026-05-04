export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

const BLOCKED_PATTERNS = [
  // Exam / academic
  { pattern: /\b(exam|test|result|score|grade|marks|pass|fail|board|JEE|NEET|UPSC|CAT|GATE|rank)\b/i, reason: "exam" },
  // Death / mortality
  { pattern: /\b(die|death|dead|kill|murder|suicide|alive|lifespan|how long.*live|when.*die)\b/i, reason: "death" },
  // Medical / health predictions
  { pattern: /\b(cancer|disease|diagnosis|cure|sick|illness|tumor|surgery|HIV|AIDS|pregnant|pregnancy)\b/i, reason: "medical" },
  // Fertility
  { pattern: /\b(fertility|conceive|baby|pregnant|miscarriage|IVF|infertile)\b/i, reason: "fertility" },
  // Legal / criminal
  { pattern: /\b(court|case|judge|verdict|guilty|innocent|lawsuit|criminal|police|arrested|imprisoned|sentenced)\b/i, reason: "legal" },
];

const REFUSAL_MESSAGE =
  "This tarot service does not provide readings for high-stakes predictive topics such as exam outcomes, death, medical matters, or legal issues. Please ask a reflective or guidance-based question instead.";

export function validateQuestion(question: string): ValidationResult {
  const trimmed = question.trim();

  if (trimmed.length < 10) {
    return { valid: false, reason: "Please provide a more detailed question (at least 10 characters)." };
  }

  if (trimmed.length > 500) {
    return { valid: false, reason: "Your question is too long. Please keep it under 500 characters." };
  }

  for (const { pattern, reason } of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, reason: REFUSAL_MESSAGE, blockedCategory: reason } as ValidationResult & { blockedCategory: string };
    }
  }

  return { valid: true };
}

export function validateContext(context: string): ValidationResult {
  const trimmed = context.trim();
  if (trimmed.length < 20) {
    return { valid: false, reason: "Please share a bit more context (at least 20 characters) so the reading can be personalized." };
  }
  if (trimmed.length > 2000) {
    return { valid: false, reason: "Context is too long. Please keep it under 2000 characters." };
  }
  return { valid: true };
}
