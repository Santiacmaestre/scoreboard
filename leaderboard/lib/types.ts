export type Section = "contributors" | "leaders";
export type AppliesTo = "contributors" | "leaders" | "both";

export interface ContributionTypeConfig {
  slug: string;
  name: string;
  appliesTo: AppliesTo;
  colorDot: string;
  colorBadgeBg: string;
  colorBadgeText: string;
  active: boolean;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  name: string;
  initials: string;
  email?: string;
  avatarColor: string;
  section: Section;
  totalPoints: number;
  totalContributions: number;
  rank: number;
  createdAt: string;
}

export interface Contribution {
  id: string;
  userId: string;
  typeSlug: string;
  title: string;
  description?: string;
  points: number;
  date: string;
  createdAt: string;
  createdBy?: string;
}

export interface UserDetail {
  profile: UserProfile;
  contributions: Contribution[];
  lastContributionAt: string | null;
}

export interface CreateContributionInput {
  personId: string | null;
  newPerson?: {
    name: string;
    email?: string;
    section: Section;
  };
  typeSlug: string;
  title: string;
  description?: string;
  points: number;
  date: string;
}
