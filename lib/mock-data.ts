export type MemberRole = "admin" | "member";
export type MemberKind = "startup" | "student" | "tech";

export interface Member {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: MemberRole;
  kind: MemberKind;
  title: string;
  bio: string;
  skills: string[];
  links: { github?: string; x?: string; linkedin?: string; website?: string };
  joinedAt: string;
  banned: boolean;
  color: string;
}

export type EventCategory = "workshop" | "talk" | "demo-day" | "social" | "hackathon" | "office-hours";
export interface HubEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  start: string;
  end: string;
  location: string;
  discordLink: string;
  published: boolean;
  attendees: string[];
}

export type ProjectStatus = "approved" | "pending" | "rejected";
export interface Project {
  id: string;
  name: string;
  ownerId: string;
  tags: string[];
  tagline: string;
  description: string;
  links: { github?: string; live?: string };
  status: ProjectStatus;
  createdAt: string;
  color: string;
}

export interface DiscussionReply {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
  flagged?: boolean;
}
export interface DiscussionThread {
  id: string;
  title: string;
  authorId: string;
  body: string;
  tags: string[];
  replies: DiscussionReply[];
  createdAt: string;
  lastActivityAt: string;
  pinned: boolean;
  locked: boolean;
  reported: boolean;
}

export type ResourceCategory = "guides" | "tools" | "templates" | "funding" | "hiring" | "learning";
export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  url: string;
  addedBy: string;
}

const now = Date.now();
const d = (daysFromNow: number, hour = 18, minute = 0) => {
  const t = new Date(now + daysFromNow * 86400000);
  t.setHours(hour, minute, 0, 0);
  return t.toISOString();
};

export const members: Member[] = [
  { id: "m-ada", name: "Ada Admin", handle: "ada", email: "admin@biandyou.dev", role: "admin", kind: "tech", title: "Community Lead", bio: "Runs BIandYou ops. Ex-SRE, currently obsessed with resilient systems and good coffee.", skills: ["Operations", "SRE", "Community"], links: { x: "https://x.com/ada_demo", github: "https://github.com/ada-demo" }, joinedAt: d(-400), banned: false, color: "#00E5FF" },
  { id: "m-milo", name: "Milo Member", handle: "milo", email: "member@biandyou.dev", role: "member", kind: "student", title: "CS Junior @ State U", bio: "Student builder. Interested in devtools and distributed systems.", skills: ["TypeScript", "React", "Postgres"], links: { github: "https://github.com/milo-demo" }, joinedAt: d(-120), banned: false, color: "#7C3AED" },
  { id: "m-sara", name: "Sara Okonkwo", handle: "sarabuilds", email: "sara@demo.dev", role: "member", kind: "startup", title: "Founder @ Fieldnote", bio: "Building Fieldnote, AI scribe for field engineers. YC alum, pre-seed.", skills: ["Go", "LLMs", "Fundraising"], links: { website: "https://fieldnote.example.com", linkedin: "https://www.linkedin.com/in/sara-demo" }, joinedAt: d(-300), banned: false, color: "#A3FF12" },
  { id: "m-jin", name: "Jin Park", handle: "jinpark", email: "jin@demo.dev", role: "member", kind: "tech", title: "Senior Frontend Engineer", bio: "Design systems goblin. Accessibility first, animations second.", skills: ["React", "Design Systems", "A11y"], links: { github: "https://github.com/jin-demo", x: "https://x.com/jin_demo" }, joinedAt: d(-260), banned: false, color: "#00E5FF" },
  { id: "m-priya", name: "Priya Raman", handle: "priya_r", email: "priya@demo.dev", role: "member", kind: "student", title: "MBA + MS CS @ Tech U", bio: "Product-minded engineer exploring fintech infra.", skills: ["Python", "SQL", "Product"], links: { linkedin: "https://www.linkedin.com/in/priya-demo" }, joinedAt: d(-90), banned: false, color: "#7C3AED" },
  { id: "m-leo", name: "Leo Martins", handle: "leomartins", email: "leo@demo.dev", role: "member", kind: "startup", title: "Co-founder & CTO @ Haulmark", bio: "Logistics routing engine. Rust inProd, gRPC everywhere.", skills: ["Rust", "gRPC", "Systems"], links: { website: "https://haulmark.example.com" }, joinedAt: d(-380), banned: false, color: "#A3FF12" },
  { id: "m-nina", name: "Nina Volkov", handle: "ninav", email: "nina@demo.dev", role: "member", kind: "tech", title: "Staff Data Engineer", bio: "Pipelines, dbt, and governance. Will happily pair on your warehouse model.", skills: ["dbt", "Snowflake", "Airflow"], links: { github: "https://github.com/nina-demo" }, joinedAt: d(-210), banned: false, color: "#00E5FF" },
  { id: "m-omar", name: "Omar Haddad", handle: "omarh", email: "omar@demo.dev", role: "member", kind: "student", title: "Freshman, CS @ Riverside", bio: "First-year hackathon regular. Learning Rust and shipping weekly.", skills: ["Rust", "C", "Linux"], links: { github: "https://github.com/omar-demo" }, joinedAt: d(-30), banned: false, color: "#7C3AED" },
  { id: "m-lena", name: "Lena Fischer", handle: "lenaf", email: "lena@demo.dev", role: "member", kind: "startup", title: "Designer & Founder @ Paperplane", bio: "Solo founder doing dev-tooling design. Portfolio site → live below.", skills: ["Figma", "Brand", "Webflow"], links: { website: "https://paperplane.example.com", x: "https://x.com/lena_demo" }, joinedAt: d(-150), banned: false, color: "#A3FF12" },
  { id: "m-tom", name: "Tom Becker", handle: "tbecker", email: "tom@demo.dev", role: "member", kind: "tech", title: "Platform Engineer", bio: "Kubernetes, Terraform, internal developer platforms.", skills: ["K8s", "Terraform", "Go"], links: { github: "https://github.com/tom-demo" }, joinedAt: d(-330), banned: false, color: "#00E5FF" },
  { id: "m-ivy", name: "Ivy Zhang", handle: "ivyzhang", email: "ivy@demo.dev", role: "member", kind: "student", title: "MS Robotics @ Tech U", bio: "ROS2 + perception stack. Building a warehouse nav demo for the spring hackathon.", skills: ["Python", "ROS2", "Perception"], links: { github: "https://github.com/ivy-demo" }, joinedAt: d(-14), banned: false, color: "#7C3AED" },
  { id: "m-rob", name: "Rob Draper", handle: "robspam", email: "rob@demo.dev", role: "member", kind: "tech", title: "(banned) Crypto promoter", bio: "Banned 2026-10-02 for spamming token launches in #general.", skills: ["Shilling"], links: {}, joinedAt: d(-500), banned: true, color: "#9CA3AF" },
];

export const events: HubEvent[] = [
  { id: "e-1", title: "Demo Day: Fall Batch", description: "Eight teams present 6-minute demos to member investors and mentors. Q&A after each slot. Demo founders: come with a single metric headline.", category: "demo-day", start: d(3, 17, 30), end: d(3, 21, 0), location: "BIandYou Main Stage + Discord stage", discordLink: "https://discord.gg/biandyou-demo/demo-day", published: true, attendees: ["m-sara", "m-leo", "m-lena", "m-milo"] },
  { id: "e-2", title: "Intro to R3F: 3D on the Web", description: "Hands-on workshop: scene graph, instancing, DPR tuning, reduced-motion patterns. Bring a laptop.", category: "workshop", start: d(6, 18, 0), end: d(6, 20, 0), location: "Room B + livestream", discordLink: "https://discord.gg/biandyou-demo/workshop-r3f", published: true, attendees: ["m-jin", "m-omar", "m-ivy"] },
  { id: "e-3", title: "Founder Office Hours", description: "Drop in with your pre-seed/seed questions: pricing, hiring your first eng, pitch decks. Partners from Northwind Ventures attending.", category: "office-hours", start: d(8, 11, 0), end: d(8, 12, 30), location: "BIandYou Lounge / Zoom", discordLink: "https://discord.gg/biandyou-demo/office-hours", published: true, attendees: ["m-sara", "m-leo"] },
  { id: "e-4", title: "Spring Hackathon: Agents Assemble", description: "24h hackathon. Theme: useful autonomous agents. $5k in prizes, mentors on-site, judging Sunday noon.", category: "hackathon", start: d(14, 9, 0), end: d(15, 14, 0), location: "BIandYou Floor + remote track", discordLink: "https://discord.gg/biandyou-demo/hack-agents", published: true, attendees: ["m-milo", "m-omar", "m-ivy", "m-priya"] },
  { id: "e-5", title: "Talk: Designing Pricing Pages That Convert", description: "Lena walks through paperplane's pricing page experiments: 11 variants, one winner. Live teardown.", category: "talk", start: d(10, 19, 0), end: d(10, 20, 0), location: "BIandYou Stage", discordLink: "https://discord.gg/biandyou-demo/pricing-talk", published: true, attendees: ["m-lena"] },
  { id: "e-6", title: "Community Social: Demo & Pizza", description: "Casual evening: bring a side project to show, pizza on the house, 3 random lightning talks.", category: "social", start: d(-4, 18, 30), end: d(-4, 21, 0), location: "BIandYou Rooftop", discordLink: "https://discord.gg/biandyou-demo/social-oct", published: true, attendees: ["m-milo", "m-jin", "m-nina", "m-tom"] },
  { id: "e-7", title: "Past: ML Infra Reading Group", description: "Read and discuss two papers: speculative decoding and KV-cache reuse. Notes in #papers.", category: "talk", start: d(-21, 19, 0), end: d(-21, 20, 30), location: "Room A", discordLink: "https://discord.gg/biandyou-demo/papers", published: true, attendees: ["m-nina", "m-tom", "m-jin"] },
  { id: "e-8", title: "Past: Resume Roast Night", description: "Alumni and hiring managers reviewed 40+ resumes. Recorded session in /resources.", category: "office-hours", start: d(-35, 17, 0), end: d(-35, 19, 0), location: "Room B", discordLink: "https://discord.gg/biandyou-demo/resume-roast", published: true, attendees: ["m-priya", "m-omar"] },
];

export const projects: Project[] = [
  { id: "p-1", name: "Fieldnote", ownerId: "m-sara", tags: ["ai", "devtools", "b2b"], tagline: "AI scribe for field engineers", description: "Voice-to-work-order pipeline for utility field crews. Offline-first mobile capture, LLM extraction, syncs to ServiceNow. 14 pilot crews live.", links: { live: "https://fieldnote.example.com" }, status: "approved", createdAt: d(-200), color: "#00E5FF" },
  { id: "p-2", name: "Haulmark Routing", ownerId: "m-leo", tags: ["rust", "logistics", "infra"], tagline: "Sub-100ms truck routing at scale", description: "Custom VRP solver + real-time telemetry ingestion. 40k routes/day for 3 mid-size carriers.", links: { github: "https://github.com/haulmark-demo/routing" }, status: "approved", createdAt: d(-260), color: "#A3FF12" },
  { id: "p-3", name: "graphui", ownerId: "m-jin", tags: ["react", "design-systems", "oss"], tagline: "Headless graph-viz primitives for React", description: "Accessible, keyboard-navigable node/edge visualizations. 1.2k GitHub stars, adopted by two member startups.", links: { github: "https://github.com/jin-demo/graphui", live: "https://graphui-demo.example.com" }, status: "approved", createdAt: d(-180), color: "#7C3AED" },
  { id: "p-4", name: "dbt-sentinel", ownerId: "m-nina", tags: ["data", "dbt", "quality"], tagline: "Catch broken models before prod", description: "Statistical drift detection for dbt models; posts CI annotations to Slack.", links: { github: "https://github.com/nina-demo/dbt-sentinel" }, status: "approved", createdAt: d(-140), color: "#00E5FF" },
  { id: "p-5", name: "Paperplane", ownerId: "m-lena", tags: ["design", "devtools", "saas"], tagline: "Onboarding flows for dev tools", description: "Opinionated onboarding templates for technical SaaS. Currently in closed beta with 6 teams.", links: { live: "https://paperplane.example.com" }, status: "approved", createdAt: d(-120), color: "#A3FF12" },
  { id: "p-6", name: "K8sGPT-lite", ownerId: "m-tom", tags: ["k8s", "ai", "ops"], tagline: "Incident triage copilot for clusters", description: "Read-only cluster inspector that drafts triage notes from events + logs. Hackathon project → internal tool.", links: { github: "https://github.com/tom-demo/k8sgpt-lite" }, status: "approved", createdAt: d(-75), color: "#7C3AED" },
  { id: "p-7", name: "warehouse-nav", ownerId: "m-ivy", tags: ["robotics", "ros2", "student"], tagline: "Nav demo for spring hackathon", description: "ROS2 Nav2 stack tuned for narrow aisles with lidar + apriltags. Seeking teammates for the hackathon track.", links: { github: "https://github.com/ivy-demo/warehouse-nav" }, status: "pending", createdAt: d(-2), color: "#00E5FF" },
  { id: "p-8", name: "captable-os", ownerId: "m-priya", tags: ["fintech", "legal", "saas"], tagline: "Cap tables for student founders", description: "Dead-simple cap table + SAFE tracker aimed at pre-seed student teams. Awaiting security review.", links: {}, status: "pending", createdAt: d(-1), color: "#A3FF12" },
];

export const discussions: DiscussionThread[] = [
  { id: "t-1", title: "What should demo day 3 look like?", authorId: "m-ada", body: "Collecting feedback: keep 6 speakers + 1 investor Q&A, or add a 2-min silent demo round? Drop thoughts.", tags: ["demo-day", "community"], createdAt: d(-1, 9), lastActivityAt: d(0, 8), pinned: true, locked: false, reported: false, replies: [
    { id: "r-1a", authorId: "m-sara", body: "Silent demo round is underrated — investors watch the product, not the pitch.", createdAt: d(-1, 11) },
    { id: "r-1b", authorId: "m-jin", body: "Keep talks ≤6 min or nobody asks questions after minute 5.", createdAt: d(-1, 15) },
    { id: "r-1c", authorId: "m-milo", body: "Live demo or it didn't happen.", createdAt: d(0, 8) },
  ] },
  { id: "t-2", title: "Postgres vs. SQLite for pre-seed apps?", authorId: "m-milo", body: "Starting a weekend project. Is SQLite + litestream enough, or reach for Postgres immediately?", tags: ["postgres", "sqlite", "architecture"], createdAt: d(-2, 14), lastActivityAt: d(-1, 20), pinned: false, locked: false, reported: false, replies: [
    { id: "r-2a", authorId: "m-nina", body: "SQLite until you have concurrent writes that matter. You'll know.", createdAt: d(-2, 16) },
    { id: "r-2b", authorId: "m-tom", body: "Postgres if you want RLS/row-level auth from day one.", createdAt: d(-1, 20) },
  ] },
  { id: "t-3", title: "Hiring founding engineer: worth equity-only?", authorId: "m-sara", body: "I can offer 2-4% + small stipend for a founding engineer. Too aggressive? Too low? Genuine question.", tags: ["hiring", "founders"], createdAt: d(-3, 10), lastActivityAt: d(-2, 9), pinned: false, locked: false, reported: false, replies: [
    { id: "r-3a", authorId: "m-leo", body: "Below market unless you have strong traction. 4%+ and conviction pitch.", createdAt: d(-3, 18) },
    { id: "r-3b", authorId: "m-lena", body: "Students will take it. Seniors won't without salary.", createdAt: d(-2, 9) },
  ] },
  { id: "t-4", title: "Rate my R3F hero: 30fps on my phone", authorId: "m-omar", body: "Node graph hero drops frames on mid-range Android. DPR cap and instancing helped. What else?", tags: ["r3f", "performance", "webgl"], createdAt: d(-4, 21), lastActivityAt: d(-2, 22), pinned: false, locked: false, reported: false, replies: [
    { id: "r-4a", authorId: "m-jin", body: "DPR 1.5, instancing, and no per-frame allocations. Also disable bloom.", createdAt: d(-4, 23) },
    { id: "r-4b", authorId: "m-tom", body: "frameloop='demand' + invalidate on interaction if it's mostly idle.", createdAt: d(-2, 22) },
  ] },
  { id: "t-5", title: "OFF: spam links in #jobs every morning", authorId: "m-priya", body: "Someone keeps posting referral-farm links at 7am. Can we lock #jobs or require approval?", tags: ["moderation", "meta"], createdAt: d(-5, 8), lastActivityAt: d(-3, 12), pinned: false, locked: true, reported: true, replies: [
    { id: "r-5a", authorId: "m-rob", body: "My links help people!! Guaranteed returns, click NOW", createdAt: d(-5, 9), flagged: true },
    { id: "r-5b", authorId: "m-ada", body: "Thanks @priya — locking the thread, Rob is banned pending review.", createdAt: d(-3, 12) },
  ] },
  { id: "t-6", title: "Reading group: speculative decoding paper", authorId: "m-nina", body: "Link below. 30-min summary Sunday, bring one question each. Notes to #papers.", tags: ["reading-group", "llm"], createdAt: d(-6, 13), lastActivityAt: d(-4, 19), pinned: false, locked: false, reported: false, replies: [
    { id: "r-6a", authorId: "m-milo", body: "Will bring: how does acceptance rate interact with batch size?", createdAt: d(-4, 19) },
  ] },
];

export const resources: Resource[] = [
  { id: "res-1", title: "BIandYou Founder's Pitch Checklist", description: "The exact 12-slide structure member founders used to raise; includes example decks.", category: "templates", url: "https://docs.google.com/biandyou-pitch-demo", addedBy: "Ada Admin" },
  { id: "res-2", title: "YC Startup Library (link)", description: "Curated external library — essays on doing things that don't scale, hiring, pricing.", category: "learning", url: "https://www.ycombinator.com/library", addedBy: "Ada Admin" },
  { id: "res-3", title: "Vercel for Startups", description: "Deployment credits and templates for member teams. Apply via #perks in Discord.", category: "funding", url: "https://vercel.com/startups", addedBy: "Tom Becker" },
  { id: "res-4", title: "The Pragmatist's Postgres Guide", description: "Internal member guide: schema review checklist, indexing rules, backup drills.", category: "guides", url: "https://biandyou.example.com/guides/postgres", addedBy: "Nina Volkov" },
  { id: "res-5", title: "Design System Boilerplate (graphui)", description: "Jin's starter: tokens, a11y linting, Storybook, visual regression in CI.", category: "tools", url: "https://github.com/jin-demo/graphui-starter", addedBy: "Jin Park" },
  { id: "res-6", title: "Hiring Your First Engineer", description: "Talk recording + rubric: sourcing channels, comp bands, and the trial-project policy.", category: "hiring", url: "https://www.youtube.com/biandyou-demo/first-engineer", addedBy: "Sara Okonkwo" },
];

export const memberById = (id: string) => members.find((m) => m.id === id);
