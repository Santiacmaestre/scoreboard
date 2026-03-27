import { UserProfile, Contribution, ContributionTypeConfig } from "./types";
import { AVATAR_COLORS } from "./utils";

export const MOCK_CONTRIBUTION_TYPES: ContributionTypeConfig[] = [
  { slug: "lightning-talk", name: "Charla Lightning", appliesTo: "both", colorDot: "#EF9F27", colorBadgeBg: "#FAEEDA", colorBadgeText: "#854F0B", active: true, createdAt: "2025-03-01T00:00:00Z" },
  { slug: "foundational-talk", name: "Charla Foundational", appliesTo: "both", colorDot: "#378ADD", colorBadgeBg: "#E6F1FB", colorBadgeText: "#185FA5", active: true, createdAt: "2025-03-01T00:00:00Z" },
  { slug: "advanced-talk", name: "Charla Advanced", appliesTo: "both", colorDot: "#7F77DD", colorBadgeBg: "#EEEDFE", colorBadgeText: "#534AB7", active: true, createdAt: "2025-03-01T00:00:00Z" },
  { slug: "workshop", name: "Workshop", appliesTo: "both", colorDot: "#D85A30", colorBadgeBg: "#FAECE7", colorBadgeText: "#993C1D", active: true, createdAt: "2025-03-01T00:00:00Z" },
  { slug: "event-lead", name: "Full Event Lead", appliesTo: "both", colorDot: "#1D9E75", colorBadgeBg: "#E1F5EE", colorBadgeText: "#0F6E56", active: true, createdAt: "2025-03-01T00:00:00Z" },
  { slug: "mentor", name: "Mentor", appliesTo: "both", colorDot: "#D4537E", colorBadgeBg: "#FBEAF0", colorBadgeText: "#993556", active: true, createdAt: "2025-03-01T00:00:00Z" },
  { slug: "bring-sponsor", name: "Bring Sponsor", appliesTo: "both", colorDot: "#854F0B", colorBadgeBg: "#FAEEDA", colorBadgeText: "#633806", active: true, createdAt: "2025-03-01T00:00:00Z" },
  { slug: "voluntario", name: "Voluntario", appliesTo: "both", colorDot: "#639922", colorBadgeBg: "#EAF3DE", colorBadgeText: "#3B6D11", active: true, createdAt: "2025-03-20T00:00:00Z" },
];

export const MOCK_CONTRIBUTORS: UserProfile[] = [
  {
    userId: "001", name: "María Camila R.", initials: "MC", avatarColor: AVATAR_COLORS[0],
    section: "contributors", totalPoints: 1284, totalContributions: 5,
    rank: 1, createdAt: "2025-03-01T00:00:00Z",
  },
  {
    userId: "002", name: "Andrés Salazar", initials: "AS", avatarColor: AVATAR_COLORS[1],
    section: "contributors", totalPoints: 1150, totalContributions: 3,
    rank: 2, createdAt: "2025-01-15T00:00:00Z",
  },
  {
    userId: "003", name: "Laura Pineda", initials: "LP", avatarColor: AVATAR_COLORS[2],
    section: "contributors", totalPoints: 1087, totalContributions: 3,
    rank: 3, createdAt: "2025-02-10T00:00:00Z",
  },
  {
    userId: "004", name: "Juan David M.", initials: "JD", avatarColor: AVATAR_COLORS[3],
    section: "contributors", totalPoints: 943, totalContributions: 2,
    rank: 4, createdAt: "2025-04-01T00:00:00Z",
  },
  {
    userId: "005", name: "Sofía Velásquez", initials: "SV", avatarColor: AVATAR_COLORS[4],
    section: "contributors", totalPoints: 876, totalContributions: 2,
    rank: 5, createdAt: "2025-05-01T00:00:00Z",
  },
  {
    userId: "006", name: "Carlos Henao", initials: "CH", avatarColor: AVATAR_COLORS[5],
    section: "contributors", totalPoints: 721, totalContributions: 1,
    rank: 6, createdAt: "2025-06-01T00:00:00Z",
  },
  {
    userId: "007", name: "Diana Restrepo", initials: "DR", avatarColor: AVATAR_COLORS[6],
    section: "contributors", totalPoints: 654, totalContributions: 2,
    rank: 7, createdAt: "2025-03-05T00:00:00Z",
  },
];

export const MOCK_LEADERS: UserProfile[] = [
  {
    userId: "101", name: "Camilo Ríos", initials: "CR", avatarColor: AVATAR_COLORS[7],
    section: "leaders", totalPoints: 2340, totalContributions: 8,
    rank: 1, createdAt: "2025-01-10T00:00:00Z",
  },
  {
    userId: "102", name: "Valentina Ospina", initials: "VO", avatarColor: AVATAR_COLORS[8],
    section: "leaders", totalPoints: 2100, totalContributions: 6,
    rank: 2, createdAt: "2025-02-01T00:00:00Z",
  },
  {
    userId: "103", name: "Felipe Arango", initials: "FA", avatarColor: AVATAR_COLORS[9],
    section: "leaders", totalPoints: 1870, totalContributions: 5,
    rank: 3, createdAt: "2025-03-01T00:00:00Z",
  },
  {
    userId: "104", name: "Natalia Bermúdez", initials: "NB", avatarColor: AVATAR_COLORS[10],
    section: "leaders", totalPoints: 1560, totalContributions: 4,
    rank: 4, createdAt: "2025-01-20T00:00:00Z",
  },
];

export const MOCK_CONTRIBUTIONS: Record<string, Contribution[]> = {
  "001": [
    { id: "c1", userId: "001", typeSlug: "lightning-talk", title: "Intro a AWS Lambda", points: 45, date: "2026-03-18", createdAt: "2026-03-18T10:30:00Z" },
    { id: "c2", userId: "001", typeSlug: "foundational-talk", title: "Documentación API v3.2", points: 30, date: "2025-03-14", createdAt: "2025-03-14T14:20:00Z" },
    { id: "c3", userId: "001", typeSlug: "workshop", title: "Workshop de Terraform", points: 52, date: "2025-03-13", createdAt: "2025-03-13T09:15:00Z" },
    { id: "c4", userId: "001", typeSlug: "event-lead", title: "Lead meetup marzo", points: 80, date: "2025-03-10", createdAt: "2025-03-10T16:45:00Z" },
    { id: "c5", userId: "001", typeSlug: "mentor", title: "Mentoría onboarding equipo", points: 25, date: "2025-03-08", createdAt: "2025-03-08T11:00:00Z" },
  ],
  "002": [
    { id: "c6", userId: "002", typeSlug: "advanced-talk", title: "Deep dive en DynamoDB", points: 90, date: "2026-02-28", createdAt: "2026-02-28T08:00:00Z" },
    { id: "c7", userId: "002", typeSlug: "workshop", title: "Workshop CI/CD", points: 65, date: "2025-03-12", createdAt: "2025-03-12T13:30:00Z" },
    { id: "c8", userId: "002", typeSlug: "foundational-talk", title: "Guía de onboarding v2", points: 35, date: "2025-03-10", createdAt: "2025-03-10T10:00:00Z" },
  ],
  "003": [
    { id: "c9", userId: "003", typeSlug: "event-lead", title: "Lead hackathon Q1", points: 120, date: "2025-10-15", createdAt: "2025-10-15T09:00:00Z" },
    { id: "c10", userId: "003", typeSlug: "lightning-talk", title: "Lightning talk microservicios", points: 55, date: "2025-03-13", createdAt: "2025-03-13T15:00:00Z" },
    { id: "c11", userId: "003", typeSlug: "mentor", title: "Mentoría equipo backend", points: 70, date: "2025-03-11", createdAt: "2025-03-11T11:30:00Z" },
  ],
  "004": [
    { id: "c12", userId: "004", typeSlug: "foundational-talk", title: "Intro a REST APIs", points: 40, date: "2025-03-14", createdAt: "2025-03-14T16:00:00Z" },
    { id: "c13", userId: "004", typeSlug: "bring-sponsor", title: "Sponsor AWS meetup", points: 35, date: "2025-03-12", createdAt: "2025-03-12T09:45:00Z" },
  ],
  "005": [
    { id: "c14", userId: "005", typeSlug: "advanced-talk", title: "Arquitectura event-driven", points: 85, date: "2026-03-20", createdAt: "2026-03-20T06:00:00Z" },
    { id: "c15", userId: "005", typeSlug: "workshop", title: "Workshop Kubernetes", points: 50, date: "2025-03-13", createdAt: "2025-03-13T10:00:00Z" },
  ],
  "006": [
    { id: "c16", userId: "006", typeSlug: "lightning-talk", title: "Intro a GitHub Actions", points: 45, date: "2026-02-03", createdAt: "2026-02-03T14:00:00Z" },
  ],
  "007": [
    { id: "c17", userId: "007", typeSlug: "foundational-talk", title: "Intro a React Hooks", points: 20, date: "2026-03-10", createdAt: "2026-03-10T08:00:00Z" },
    { id: "c18", userId: "007", typeSlug: "event-lead", title: "Lead workshop NextJS", points: 75, date: "2025-03-12", createdAt: "2025-03-12T16:30:00Z" },
  ],
  "101": [
    { id: "c19", userId: "101", typeSlug: "event-lead", title: "Lead conferencia anual", points: 200, date: "2026-01-20", createdAt: "2026-01-20T09:00:00Z" },
    { id: "c20", userId: "101", typeSlug: "mentor", title: "Programa mentoría Q1", points: 150, date: "2025-03-05", createdAt: "2025-03-05T14:00:00Z" },
  ],
  "102": [
    { id: "c21", userId: "102", typeSlug: "advanced-talk", title: "Keynote serverless", points: 180, date: "2026-03-12", createdAt: "2026-03-12T10:00:00Z" },
    { id: "c22", userId: "102", typeSlug: "workshop", title: "Workshop avanzado CDK", points: 120, date: "2025-03-08", createdAt: "2025-03-08T15:00:00Z" },
  ],
  "103": [
    { id: "c23", userId: "103", typeSlug: "bring-sponsor", title: "Sponsor platinum evento", points: 250, date: "2025-03-14", createdAt: "2025-03-14T11:00:00Z" },
  ],
  "104": [
    { id: "c24", userId: "104", typeSlug: "event-lead", title: "Lead meetup regional", points: 160, date: "2025-03-11", createdAt: "2025-03-11T09:00:00Z" },
  ],
};
