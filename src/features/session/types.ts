// Types from the ResolveAI API contract (section 5).

export type ProfileId = "alice" | "ben" | "chloe";

export type Profile = { profile: ProfileId; name: string };

export type ProfilesResponse = { profiles: Profile[] };

export type SessionResponse = {
  sessionToken: string;
  profile: ProfileId;
  name: string;
};

/** What our proxy returns to the browser: the token stays in an httpOnly cookie. */
export type SessionInfo = { profile: ProfileId; name: string };

export type HealthResponse = { status: "ok" };
