import { apiRequest } from "@/lib/apiClient";

import type {
  HealthResponse,
  ProfileId,
  ProfilesResponse,
  SessionInfo,
} from "../types";

export function fetchHealth() {
  return apiRequest<HealthResponse>("/api/health");
}

export function fetchProfiles() {
  return apiRequest<ProfilesResponse>("/api/profiles");
}

export function createSession(profile: ProfileId) {
  return apiRequest<SessionInfo>("/api/session", {
    method: "POST",
    body: { profile },
  });
}
