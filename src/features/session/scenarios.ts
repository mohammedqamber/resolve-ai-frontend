import type { ProfileId } from "./types";

// Seeded demo scenarios, taken from the API contract (section 10).
// Profiles themselves come from GET /api/profiles; this only adds prompts.

export type ExamplePrompt = { prompt: string; hint: string };

export type ProfileScenario = {
  summary: string;
  examples: ExamplePrompt[];
};

export const PROFILE_SCENARIOS: Record<ProfileId, ProfileScenario> = {
  alice: {
    summary: "A refund whose bank transfer failed, and one that completed.",
    examples: [
      {
        prompt: "I returned my headphones but have not received my refund.",
        hint: "Failed refund transfer · proposes a ticket",
      },
      {
        prompt: "Has my keyboard refund (ORD-1002) arrived in my bank?",
        hint: "Completed refund",
      },
      { prompt: "Where is order ORD-1003?", hint: "Delivered order" },
      {
        prompt: "Show me order ORD-2001",
        hint: "Another customer's order · privacy check",
      },
    ],
  },
  ben: {
    summary: "A pending refund, a possible duplicate charge and a parcel in transit.",
    examples: [
      {
        prompt: "I think I was charged twice for my USB-C hub.",
        hint: "Possible duplicate charge",
      },
      { prompt: "Where is my smartwatch refund?", hint: "Pending refund" },
      { prompt: "Where is my webcam?", hint: "Shipped, not delivered" },
    ],
  },
  chloe: {
    summary: "A parcel marked delivered that never arrived, and a declined payment.",
    examples: [
      {
        prompt: "My backpack says delivered but I never got it.",
        hint: "Missing delivery · proposes a ticket",
      },
      {
        prompt: "Why did my e-reader order not go through?",
        hint: "Declined payment · existing ticket",
      },
      { prompt: "Where is my yoga mat?", hint: "Shipped order" },
    ],
  },
};

export function getScenario(profile: string): ProfileScenario | undefined {
  return PROFILE_SCENARIOS[profile as ProfileId];
}
