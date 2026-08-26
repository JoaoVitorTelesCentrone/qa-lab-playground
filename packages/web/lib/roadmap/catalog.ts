import type { RoadmapChallenge } from "./qa-do-zero";
import { findQaDoZeroChallenge, qaDoZeroChallenges } from "./qa-do-zero";
import { findFullRoadmapChallenge, fullRoadmapChallenges } from "./full-catalog.generated";

export const allRoadmapChallenges: RoadmapChallenge[] = [...qaDoZeroChallenges, ...fullRoadmapChallenges];
export function findRoadmapChallenge(id: string) { return findQaDoZeroChallenge(id) ?? findFullRoadmapChallenge(id); }
