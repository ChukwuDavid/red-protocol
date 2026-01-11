// A lightweight "Procedural Generation" engine for tactical messages.
// This simulates AI without the 500MB download size.

const PHRASES = {
  MENSTRUATION: {
    openers: [
      "Hey babe,",
      "Just checking in,",
      "Thinking of you,",
      "Status check:",
    ],
    context: [
      "know energy is low today,",
      "if you're feeling drained,",
      "since it's that time,",
      "if you need to crash,",
    ],
    actions: [
      "I'm picking up pizza and we're doing Netflix tonight.",
      "I'll handle dinner, you just relax.",
      "I'm grabbing chocolate and heating pads. Be there soon.",
      "clearing my schedule to hang out with you tonight.",
    ],
    closers: [
      "Love you.",
      "You rest, I'll handle the rest.",
      "See you soon.",
      "❤️",
    ],
  },
  FOLLICULAR: {
    openers: ["Hey,", "Quick thought:", "Energy levels look high,"],
    context: [
      "since you're back to 100%,",
      "weather looks good,",
      "weekend is coming up,",
    ],
    actions: [
      "let's hit the gym together later?",
      "want to try that new hiking trail?",
      "let's go grab drinks tonight?",
      "planning a date night. Be ready at 7.",
    ],
    closers: ["Let's go.", "Can't wait.", "🚀", "See ya."],
  },
  OVULATION: {
    openers: ["Hey beautiful,", "Damn,", "Just thinking about you,"],
    context: [
      "you've been glowing lately,",
      "confidence is looking high,",
      "since we're free tonight,",
    ],
    actions: [
      "wear that black dress tonight. We're going out.",
      "cancel your plans. I'm taking you out.",
      "let's do something fun tonight.",
      "I'm coming over later.",
    ],
    closers: ["See you tonight.", "😉", "Be ready.", "xoxo"],
  },
  LUTEAL: {
    // The "Diplomat" Phase
    openers: ["Hey,", "I'm at the store,", "Heads up,"],
    context: [
      "picking up some snacks,",
      "saw these dark chocolates,",
      "grabbing some comfort food,",
    ],
    actions: [
      "need anything else while I'm out?",
      "want me to grab your favorite ice cream?",
      "do you need a resupply on anything?",
      "bringing them over now.",
    ],
    closers: ["Let me know.", "Text me back.", "Stay put.", "Love you."],
  },
};

const getRandom = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export const generateTacticalMessage = (
  phase: string,
  partnerName: string = "Babe"
) => {
  // Normalize phase to ensure we have a key
  const key = (phase || "LUTEAL") as keyof typeof PHRASES;
  const bank = PHRASES[key] || PHRASES.LUTEAL;

  const opener = getRandom(bank.openers);
  const context = getRandom(bank.context);
  const action = getRandom(bank.actions);
  const closer = getRandom(bank.closers);

  // We can inject the partner name into some openers if generic
  // For V1, we keep it simple.

  return `${opener} ${context} ${action} ${closer}`;
};
