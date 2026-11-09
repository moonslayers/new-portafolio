import type { SiteContent } from "./types";

export const siteEn: SiteContent = {
  locale: "en",
  seo: {
    title: "Jorge Marquez — AI-Native Tech Lead",
    description:
      "Portfolio of Jorge Marquez, AI-Native Tech Lead. Agent systems with multi-model orchestration, auditable skills and human gates. Angular 16–22, Laravel 10–13, MCP.",
    keywords: [
      "AI-Native Tech Lead",
      "agents",
      "MCP",
      "Angular",
      "Laravel",
      "TypeScript",
      "opencode",
      "skills",
      "subagents",
    ],
  },
  nav: {
    items: [
      { label: "About", href: "#about" },
      { label: "Method", href: "#method" },
      { label: "Projects", href: "#work" },
      { label: "Stack", href: "#stack" },
      { label: "Experience", href: "#experience" },
      { label: "Writing", href: "#writing" },
      { label: "Contact", href: "#contact" },
    ],
    cta: { label: "Let's talk", href: "#contact" },
  },
  hero: {
    kicker: "// ai-native tech lead",
    title: "AI-Native\nTech Lead",
    subtitle:
      "Agent systems that ship to production: multi-model orchestration, auditable skills and human gates.",
    ctaPrimary: { label: "View projects →", href: "#work" },
    ctaSecondary: { label: "Let's talk", href: "#contact" },
    badges: ["MCP", "Skills", "Subagents", "Angular", "Laravel"],
    scrollLabel: "Scroll",
  },
  about: {
    tag: "01 — about",
    title: "From prompt to product.",
    body: `Project lead at Integranet (2023–present): 10+ government and private platforms with teams of up to 5. From requirements to support.

Specialized in agent-assisted engineering with opencode: versioned context, lockfile-backed skills and subagents. Custom MCP and CI agents.`,
    image: {
      src: "me.webp",
      alt: "Studio portrait on black backdrop, seated on wooden stool",
    },
    kpis: [
      { value: "3", label: "Years delivering platforms" },
      { value: "10+", label: "Government and private platforms" },
      { value: "5", label: "Up to 5 engineers" },
    ],
  },
  method: {
    tag: "02 — method",
    title: "How I work.",
    intro: "Agent-assisted engineering on top of opencode.",
    items: [
      {
        title: "Versioned context (AGENTS.md)",
        description: "Repo is the source of truth.",
      },
      {
        title: "Delivery commands",
        description: "/context-gather → /plan → /execute → /validate.",
      },
      {
        title: "Skills and subagents",
        description:
          "Lockfile-backed skills; scoped subagents with clear output.",
      },
      {
        title: "MCP and human gates",
        description:
          "Custom MCPs and human approval with lint, tests and build.",
      },
    ],
  },
  projects: {
    tag: "03 — projects",
    title: "Things I built.",
    intro: "Product, open source, government and technical leadership.",
    items: [
      {
        id: "timbria",
        title: "Timbria",
        tag: "Startup · CFDI 4.0",
        category: "Own product",
        role: "Technical co-founder",
        period: "2026–present",
        problem: "Invoice CFDI 4.0 from WhatsApp without slow portals.",
        decision:
          "Laravel 13 + Next.js 16 + PostgreSQL, Turbo monorepo and shared CFDI packages.",
        result: "In development: defined architecture and working base.",
        stack: [
          "Laravel 13",
          "PHP 8.3+",
          "Next.js 16",
          "React",
          "React Native/Expo",
          "PostgreSQL",
          "Turbo",
          "CFDI 4.0",
          "WhatsApp Cloud API",
        ],
        links: [],
        featured: true,
        image: {
          src: "projects/timbria.webp",
          alt: "Timbria landing: receipt turned into CFDI 4.0 invoice",
        },
      },
      {
        id: "whatsapp-cdp-mcp",
        title: "whatsapp-cdp-mcp",
        tag: "Open source · MCP",
        category: "Open source",
        role: "Author",
        period: "2026",
        problem: "Agents operate WhatsApp Desktop without unofficial APIs.",
        decision:
          "MCP server in TS over CDP, rate limiter and 10 tools with structured errors.",
        result: "10 tools, anti-ban and simulated typing with tests.",
        stack: ["Node.js ≥23", "TypeScript", "JSON-RPC", "CDP", "WebSocket"],
        links: [
          {
            label: "GitHub",
            href: "https://github.com/moonslayers/whatsapp-cdp-mcp",
          },
        ],
        featured: true,
        image: {
          src: "projects/whatsapp-cdp-mcp.webp",
          alt: "Architecture diagram of MCP server driving WhatsApp via CDP",
        },
      },
      {
        id: "doc2issue",
        title: "doc2issue",
        tag: "Open source · Agents",
        category: "Open source",
        role: "Author",
        period: "2026",
        problem: "Turn PDF/Word/PPT/Excel into GitHub issues.",
        decision:
          "3-agent pipeline (analyzer, vision, creator) with per-format skills and auditable JSON.",
        result: "Automated conversion with reviewable intermediate artifact.",
        stack: [
          "Python",
          "uv",
          "OpenCode",
          "OpenRouter",
          "GitHub CLI",
          "PyMuPDF",
          "python-docx",
          "python-pptx",
          "pandas",
        ],
        links: [
          { label: "GitHub", href: "https://github.com/moonslayers/doc2issue" },
        ],
        featured: true,
        image: {
          src: "projects/doc2issue.webp",
          alt: "3-agent pipeline: PDF · DOCX · PPTX · XLSX to issues",
        },
      },
      {
        id: "issue-scout-agent",
        title: "issue-scout-agent",
        tag: "Open source · CI",
        category: "Open source",
        role: "Author",
        period: "2026",
        problem: "Investigate issues and generate technical plans in CI.",
        decision:
          "Multi-provider GitHub Action with tool use; triggered by /scout.",
        result: "Actionable plans; human approves. Versioned Action.",
        stack: [
          "TypeScript",
          "Vercel AI SDK (multi-provider client)",
          "GitHub Actions",
          "Jest",
          "ESLint",
        ],
        links: [
          {
            label: "GitHub",
            href: "https://github.com/moonslayers/issue-scout-agent",
          },
        ],
        featured: true,
        image: {
          src: "projects/issue-scout-agent.webp",
          alt: "Mock agent comment with technical plan on acme/api #42",
        },
      },
      {
        id: "creditos-fondosbc",
        title: "Credit system — FondosBC",
        tag: "Government · Integranet",
        category: "Government",
        role: "Frontend → Project lead",
        period: "2024–present",
        problem: "Migrate a legacy credit system to an in-house platform.",
        decision:
          "Led up to 5 devs; Angular 17→22, Laravel 12, MySQL and WhatsApp Cloud API.",
        result: "Migration completed; active support.",
        stack: [
          "Angular 17→22",
          "Laravel 12",
          "MySQL",
          "GitHub Actions",
          "Pest/PHPUnit",
          "WhatsApp Cloud API",
        ],
        links: [],
        featured: true,
        image: {
          src: "projects/creditos-fondosbc.webp",
          alt: "Analytics dashboard of FondosBC credit applications",
        },
      },
      {
        id: "cuadra",
        title: "Cuadra",
        tag: "Own product · PWA",
        category: "Own product",
        role: "Owner",
        period: "2026",
        problem: "In Ensenada water and power status by colonia lost in chats.",
        decision:
          "Offline PWA with Laravel 13 + Vue 3/Inertia + PostgreSQL 18: neighbor reports and upvotes.",
        result: "Public log visible and state clear without delay.",
        stack: [
          "Laravel 13",
          "PHP 8.5",
          "PostgreSQL 18",
          "Vue 3/Inertia",
          "Tailwind 4",
          "Pinia",
          "Pest 5",
          "PWA offline",
        ],
        links: [],
        featured: true,
        image: {
          src: "projects/cuadra.webp",
          alt: "El pulso de tu cuadra panel with Water and Power status",
        },
      },
    ],
  },
  stack: {
    tag: "05 — stack",
    title: "The pieces of the system.",
    groups: [
      { title: "Frontend", items: ["Angular 16–22", "TypeScript"] },
      { title: "Backend", items: ["Laravel 10–13", "PHP", "Node.js"] },
      { title: "Data", items: ["MySQL", "PostgreSQL", "SQLite"] },
      {
        title: "Quality & delivery",
        items: ["Docker", "Nx", "GitHub Actions", "Pest/PHPUnit", "Vitest"],
      },
      { title: "Agents", items: ["MCP", "opencode"] },
    ],
  },
  experience: {
    tag: "06 — experience",
    title: "How I got here.",
    items: [
      {
        company: "Integranet",
        location: "Ensenada, B.C., Mexico",
        period: "2023–present",
        role: "Consultant and Project Lead",
        highlights: [
          "Up to 5 devs across simultaneous projects; full cycle from requirements to support.",
          "10+ government and private platforms shipped and maintained.",
        ],
      },
      {
        company: "Timbria",
        location: "Remote",
        period: "2026–present",
        role: "Technical co-founder",
        highlights: [
          "Architecture, backend, CFDI generation and PAC client.",
          "Admin portal in Next.js 16 and mobile app in React Native/Expo.",
        ],
      },
      {
        company: "Universidad Autónoma de Baja California (UABC)",
        location: "Ensenada, B.C., Mexico",
        period: "2019–2023",
        role: "B.Sc. in Computer Science",
        highlights: [
          "Internships in 2022 and 2023.",
          "Mobile app for student psychological support: auth, roles and secure storage.",
        ],
      },
    ],
  },
  writing: {
    tag: "07 — writing",
    title: "I write about agents and architecture.",
    name: "Jorge Marquez · Substack",
    description:
      "Newsletter where I test tech before recommending it: agents, MCP and architecture, no hype.",
    href: "https://jrmarquez.substack.com/",
    cta: "Read on Substack",
  },
  contact: {
    tag: "08 — contact",
    title: "Let's build something.",
    body: "Want to bring agents to your team without breaking production? Let's talk.",
    email: "jorge.marquez.luna@uabc.edu.mx",
    links: [
      { label: "Email", href: "mailto:jorge.marquez.luna@uabc.edu.mx" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/jorge-marquez-luna/",
      },
      { label: "GitHub", href: "https://github.com/moonslayers/" },
      { label: "Substack", href: "https://jrmarquez.substack.com/" },
    ],
  },
  footer: {
    text: "built by agents (and by me)",
    copyright: "© 2026 Jorge Marquez",
  },
};

export const site = siteEn;
export default siteEn;
export { siteEn as siteEN };
