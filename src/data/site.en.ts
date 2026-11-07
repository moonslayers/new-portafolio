import type { SiteContent } from "./types";

export const siteEn: SiteContent = {
  locale: "en",
  seo: {
    title: "Jorge Márquez Luna — AI-Native Tech Lead",
    description:
      "Portfolio of Jorge Márquez Luna, AI-Native Tech Lead. Agent systems with multi-model orchestration, auditable skills and human gates. Angular 16–22, Laravel 10–13, MCP.",
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
      { label: "Stack", href: "#stack" },
      { label: "Projects", href: "#work" },
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
      "I turn business requirements into AI systems that run in production, with explicit rules: multi-model orchestration, auditable skills and human review at every critical decision.",
    ctaPrimary: { label: "View projects →", href: "#work" },
    ctaSecondary: { label: "Let's talk", href: "#contact" },
    badges: [
      "MCP",
      "Skills",
      "Subagents",
      "GitHub Actions",
      "Angular",
      "Laravel",
      "TypeScript",
    ],
    scrollLabel: "Scroll",
  },
  about: {
    tag: "01 — about",
    title: "From prompt to product.",
    body: `I turn business requirements into AI systems that run in production, with explicit rules: multi-model orchestration, auditable skills and human review at every critical decision.

I am a project lead at Integranet. Over 3 years I have delivered 10+ platforms for the state government of Baja California and private companies: credit systems, environmental permits, tax incentives, helpdesk, procurement, warehousing and a mobile app. I have led teams of up to 5 developers and owned the full cycle: stakeholder discovery, architecture, implementation, QA, deployment and support. I work as a player-coach: I delegate, review, and step in to fix urgent bugs or incidents; I present progress, requests and support reports to clients and leadership.

My current specialty is agent-assisted engineering. I designed a method on top of opencode that versions context in the repository (AGENTS.md), splits delivery into commands (/context-gather → /plan → /execute → /validate), installs skills with a lockfile and hash, and assigns subagents with defined scope and output. Timbria carries dozens of versioned skills; the Environmental platform carries dozens of domain skills.

I also build the missing pieces: a custom MCP server with 10 tools that controls WhatsApp Desktop over CDP, with rate limiting and tests; doc2issue, a 3-agent pipeline that turns PDF, Word, PPT and Excel into GitHub issues; and issue-scout-agent, a tool-using agent inside GitHub Actions.

Architecture principle: cheap models do the heavy lifting, premium models review, analyze requirements and handle hard perception, and a human approves. I used vector databases for agent memory and rejected them as a black box; for operational knowledge I prefer versioned, auditable skills. I know when a problem needs RAG over a large document corpus and when it does not.

I write Beyond the Hype, a newsletter where I test technology before recommending it.

Next step: an AI-Native Tech Lead or AI Solutions Architect role in a team already pushing agents to production, where I can bring order to architecture, standards, evaluation and delivery.`,
    kpis: [
      { value: "3", label: "Years delivering platforms" },
      { value: "10+", label: "Government and private platforms" },
      { value: "5", label: "Up to 5 engineers" },
    ],
  },
  method: {
    tag: "02 — method",
    title: "How I work.",
    intro:
      "An agent-assisted engineering method on top of opencode: versioned context, commands for the delivery cycle, skills with a lockfile, scoped subagents, MCP and human gates.",
    items: [
      {
        title: "Versioned context (AGENTS.md)",
        description:
          "Project knowledge lives in the repository, not in one person's head.",
      },
      {
        title: "Delivery commands",
        description: "/context-gather → /plan → /execute → /validate.",
      },
      {
        title: "Skills with lockfile",
        description:
          "Versioned skills with a hash; auditable and reproducible changes.",
      },
      {
        title: "Scoped subagents",
        description: "Roles with defined scope and output; no loose agents.",
      },
      {
        title: "MCP",
        description:
          "Laravel Boost, Nx, shadcn, Spartan UI and a custom WhatsApp MCP (10 tools).",
      },
      {
        title: "Human gates",
        description:
          "A human approves; lint, tests and build are merge conditions.",
      },
      {
        title: "Quality on every PR",
        description:
          "Manual review of every PR, with lint, tests and build gates.",
      },
    ],
  },
  projects: {
    tag: "03 — projects",
    title: "Things I built.",
    intro:
      "Six projects spanning product, open source, government work and technical leadership.",
    items: [
      {
        id: "timbria",
        title: "Timbria",
        tag: "Startup · CFDI 4.0",
        category: "Own product",
        role: "Technical co-founder",
        period: "2026–present",
        problem:
          "Businesses in Mexico issue CFDI 4.0 invoices through slow portals; the goal is to invoice from WhatsApp by scanning a QR and photographing the ticket.",
        decision:
          "Architecture with Laravel 13 + Next.js 16 + PostgreSQL, shared CFDI and types packages, Turbo monorepo, CFDI generation and PAC client.",
        result:
          "Product in development with a defined architecture, working technical base and dozens of versioned skills; clear separation between business and technology.",
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
      },
      {
        id: "whatsapp-cdp-mcp",
        title: "whatsapp-cdp-mcp",
        tag: "Open source · MCP",
        category: "Open source",
        role: "Author",
        period: "2026",
        problem:
          "Agents need to operate WhatsApp Desktop without unofficial APIs or parallel accounts.",
        decision:
          "MCP server in TypeScript over CDP, layered architecture, decoupled rate limiter, 10 tools with structured errors.",
        result:
          "10 MCP tools, anti-ban rate limiting, simulated typing and rate-limiter tests.",
        stack: ["Node.js ≥23", "TypeScript", "JSON-RPC", "CDP", "WebSocket"],
        links: [
          {
            label: "GitHub",
            href: "https://github.com/moonslayers/whatsapp-cdp-mcp",
          },
        ],
        featured: true,
      },
      {
        id: "doc2issue",
        title: "doc2issue",
        tag: "Open source · Agents",
        category: "Open source",
        role: "Author",
        period: "2026",
        problem:
          "Turn requirement documents (PDF, Word, PPT, Excel) into structured GitHub Project issues.",
        decision:
          "3-agent pipeline (analyzer, vision, creator) with per-format skills and a reviewable intermediate JSON.",
        result:
          "Automated document-to-issue conversion with an auditable intermediate artifact.",
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
      },
      {
        id: "issue-scout-agent",
        title: "issue-scout-agent",
        tag: "Open source · CI",
        category: "Open source",
        role: "Author",
        period: "2026",
        problem:
          "Investigate issues and generate technical plans inside CI, without coupling to a single model.",
        decision:
          "Multi-provider GitHub Action with tool use (listDir, readFile, searchCode, getFileTree, gitDiff), opt-in activation with /scout.",
        result:
          "An agent that proposes actionable plans; a human approves. Distributed as a versioned Action.",
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
      },
      {
        id: "creditos-fondosbc",
        title: "Credit system — FondosBC",
        tag: "Government · Integranet",
        category: "Government",
        role: "Frontend → Project lead",
        period: "2024–present",
        problem:
          "Migrate a legacy system from an external vendor into an in-house credit platform.",
        decision:
          "Leadership of up to 5 devs, Angular 17→22, Laravel 12, MySQL, WhatsApp Cloud API, feature/unit tests.",
        result:
          "Legacy migration completed; active support; grew from frontend to project lead.",
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
      },
      {
        id: "age-of-agents",
        title: "age-of-agents",
        tag: "Open source · npm",
        category: "Open source",
        role: "Author",
        period: "2026",
        problem:
          "Visualize agent sessions from four tools in real time as a pixel-art kingdom.",
        decision:
          "Local transcript reading, event-to-game-state translation, local server on 127.0.0.1.",
        result: "Published npm package; supports multiple projects as cities.",
        stack: ["Node.js ≥22", "TypeScript", "PixiJS v8", "WebSocket", "Vite"],
        links: [
          { label: "npm", href: "https://www.npmjs.com/package/age-of-agents" },
          {
            label: "Site",
            href: "https://agentsmill.github.io/age-of-agents/",
          },
        ],
        featured: true,
      },
    ],
  },
  stack: {
    tag: "04 — stack",
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
    tag: "05 — experience",
    title: "How I got here.",
    items: [
      {
        company: "Integranet",
        location: "Ensenada, B.C., Mexico",
        period: "2023–present",
        role: "Consultant and Project Lead",
        description: "Government and private sector; simultaneous projects.",
        highlights: [
          "Led teams of up to 5 developers across simultaneous projects.",
          "Owned the full cycle: requirements, design, implementation, review, deployment and support.",
          "Quality gates (lint, tests, build, e2e) and manual review of every PR.",
          "Major production migrations: Angular 16→18, 17→22; Laravel 10→13.",
        ],
      },
      {
        company: "Timbria",
        location: "Remote",
        period: "2026–present",
        role: "Technical co-founder",
        description: "Startup for CFDI 4.0 invoicing over WhatsApp.",
        highlights: [
          "Architecture, backend, CFDI generation and PAC client.",
          "PostgreSQL data model and shared packages.",
          "Admin portal in Next.js 16 and mobile app in React Native/Expo.",
        ],
      },
      {
        company: "Universidad Autónoma de Baja California (UABC)",
        location: "Ensenada, B.C., Mexico",
        period: "2019–2023",
        role: "B.Sc. in Computer Science",
        description:
          "Two internship periods (2022 and 2023) plus capstone projects.",
        highlights: [
          "Mobile app for student psychological support: authentication, roles and secure storage.",
          "Stack: Flutter, Dart, Firebase Auth, Firestore and Storage.",
        ],
      },
    ],
    education: [
      {
        institution: "Universidad Autónoma de Baja California (UABC)",
        location: "Ensenada, B.C., Mexico",
        period: "2019–2023",
        degree: "B.Sc. in Computer Science",
        details: [
          "Faculty of Sciences",
          "Two internship periods (2022 and 2023)",
        ],
      },
    ],
  },
  writing: {
    tag: "06 — writing",
    title: "Beyond the Hype.",
    name: "Beyond the Hype",
    description:
      "A newsletter where I test technology before recommending it: agents, MCP, multi-model orchestration and architecture trade-offs. No hype.",
    href: "https://substack.com/@jrmarquez",
    cta: "Read on Substack",
  },
  contact: {
    tag: "07 — contact",
    title: "Let's build something.",
    body: "If you are figuring out how to bring agents into your team without the world catching fire, let's talk.",
    email: "jorge.marquez.luna@uabc.edu.mx",
    links: [
      { label: "Email", href: "mailto:jorge.marquez.luna@uabc.edu.mx" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/jorge-marquez-luna/",
      },
      { label: "GitHub", href: "https://github.com/moonslayers/" },
      { label: "Substack", href: "https://substack.com/@jrmarquez" },
    ],
  },
  footer: {
    text: "built by agents (and by me)",
    copyright: "© 2026 Jorge Márquez Luna",
  },
};

export const site = siteEn;
export default siteEn;
export { siteEn as siteEN };
