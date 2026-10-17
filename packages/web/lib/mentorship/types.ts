export type MentorshipLevel = "beginner" | "intermediate";
export type MentorshipEnrollmentStatus = "invited" | "active" | "paused" | "completed" | "cancelled";
export type MentorshipSubmissionStatus = "draft" | "submitted" | "in_review" | "changes_requested" | "approved";

export type MentorshipEnrollment = {
  id: string;
  cohortId: string;
  userId: string;
  status: MentorshipEnrollmentStatus;
  level: MentorshipLevel;
  goal: string | null;
  diagnosticScore: Record<string, unknown>;
  joinedAt: string | null;
  completedAt: string | null;
};

export type MentorshipSubmission = {
  id: string;
  enrollmentId: string;
  assignmentKey: string;
  attemptNumber: number;
  level: MentorshipLevel;
  content: Record<string, unknown>;
  repositoryUrl: string | null;
  reportUrl: string | null;
  labSubmissionId: string | null;
  attachments: import("@/lib/product/journey").Attachment[];
  status: MentorshipSubmissionStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type MentorshipReview = {
  id: string;
  submissionId: string;
  reviewerId: string;
  rubricVersion: string;
  scores: Record<string, number>;
  strengths: string;
  improvements: string;
  nextAction: string;
  decision: "changes_requested" | "approved";
  createdAt: string;
};
