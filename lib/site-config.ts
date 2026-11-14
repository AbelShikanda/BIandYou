export const siteConfig = {
  name: "BIandYou",
  tagline: "Where startups, students, and tech build together.",
  description:
    "BIandYou is a members-only community hub for startups, students, and the tech community — events, projects, discussions, and resources in one living network.",
  logoText: "BIandYou",
  logoPlaceholder: "Logo goes here",
  url: "https://biandyou.example.com",
  discordInvite: "https://discord.gg/biandyou-demo",
  socials: {
    github: "https://github.com/AbelShikanda/BIandYou",
    x: "https://x.com/biandyou_demo",
    linkedin: "https://www.linkedin.com/company/biandyou-demo",
    youtube: "https://www.youtube.com/@biandyou-demo",
  },
  accents: {
    cyan: "#00E5FF",
    violet: "#7C3AED",
    lime: "#A3FF12",
    black: "#000000",
  },
  demoAccounts: [
    { email: "admin@biandyou.dev", password: "admin", role: "admin" as const, name: "Ada Admin" },
    { email: "member@biandyou.dev", password: "member", role: "member" as const, name: "Milo Member" },
  ],
  newsletterNote: "Demo placeholder — signup is non-functional.",
  email: "hello@biandyou.dev",
} as const;

export type SiteConfig = typeof siteConfig;
