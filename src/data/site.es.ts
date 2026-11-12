import type { SiteContent } from "./types";

export const siteEs: SiteContent = {
  locale: "es",
  seo: {
    title: "Jorge Marquez — AI-Native Tech Lead",
    description:
      "Portafolio de Jorge Marquez, AI-Native Tech Lead. Sistemas de agentes con orquestación multi-modelo, skills auditables y gates humanos. Angular 16–22, Laravel 10–13, MCP.",
    keywords: [
      "AI-Native Tech Lead",
      "agentes",
      "MCP",
      "Angular",
      "Laravel",
      "TypeScript",
      "opencode",
      "skills",
      "subagentes",
    ],
  },
  nav: {
    items: [
      { label: "Sobre mí", href: "#about" },
      { label: "Método", href: "#method" },
      { label: "Proyectos", href: "#work" },
      { label: "Stack", href: "#stack" },
      { label: "Experiencia", href: "#experience" },
      { label: "Writing", href: "#writing" },
      { label: "Contacto", href: "#contact" },
    ],
    cta: { label: "Hablemos", href: "#contact" },
  },
  hero: {
    kicker: "// ai-native tech lead",
    title: "AI-Native\nTech Lead",
    subtitle:
      "Sistemas de agentes que llegan a producción: orquestación multi-modelo, skills auditables y gates humanos.",
    ctaPrimary: { label: "Ver proyectos →", href: "#work" },
    ctaSecondary: { label: "Hablemos", href: "#contact" },
    badges: ["MCP", "Skills", "Subagentes", "Angular", "Laravel"],
    scrollLabel: "Scroll",
  },
  about: {
    tag: "01 — sobre mí",
    title: "Del prompt al producto.",
    body: `Líder de proyecto en Integranet (2023–presente): 10+ plataformas de gobierno y privado con equipos de hasta 5. De requisitos a soporte.

Especialidad en ingeniería asistida por agentes con opencode: contexto versionado, skills con lockfile y subagentes. MCP propio, doc2issue y agentes en CI.`,
    image: {
      src: "me.webp",
      alt: "Retrato de estudio en interior, fondo negro, banco de madera",
    },
    kpis: [
      { value: "3", label: "Años entregando plataformas" },
      { value: "10+", label: "Plataformas de gobierno y sector privado" },
      { value: "5", label: "Desarrolladores máximo en equipo" },
    ],
  },
  method: {
    tag: "02 — método",
    title: "Cómo trabajo.",
    intro: "Ingeniería asistida por agentes sobre opencode.",
    items: [
      {
        title: "Contexto versionado (AGENTS.md)",
        description: "El repo es la fuente de verdad.",
      },
      {
        title: "Comandos del ciclo",
        description: "/context-gather → /plan → /execute → /validate.",
      },
      {
        title: "Skills y subagentes",
        description:
          "Skills con lockfile; subagentes con rol y salida definidos.",
      },
      {
        title: "MCP y gates humanos",
        description:
          "MCPs a medida y aprobación humana con lint, tests y build.",
      },
    ],
  },
  projects: {
    tag: "03 — proyectos",
    title: "Cosas que construí.",
    intro: "Producto, open source, gobierno y liderazgo técnico.",
    items: [
      {
        id: "timbria",
        title: "Timbria",
        tag: "Startup · CFDI 4.0",
        category: "Producto propio",
        role: "Cofundador técnico",
        period: "2026–presente",
        problem: "Facturar CFDI 4.0 desde WhatsApp sin portales lentos.",
        decision:
          "Laravel 13 + Next.js 16 + PostgreSQL, monorepo Turbo y paquetes CFDI compartidos.",
        result:
          "En desarrollo: arquitectura definida y base técnica operativa.",
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
          alt: "Landing de Timbria: ticket convertido en factura CFDI 4.0",
        },
      },
      {
        id: "whatsapp-cdp-mcp",
        title: "whatsapp-cdp-mcp",
        tag: "Open source · MCP",
        category: "Open source",
        role: "Autor",
        period: "2026",
        problem: "Agentes operan WhatsApp Desktop sin APIs no oficiales.",
        decision:
          "Servidor MCP en TS sobre CDP, rate limiter y 10 tools con errores estructurados.",
        result: "10 tools, anti-ban y typing simulado con tests.",
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
          alt: "Diagrama del servidor MCP operando WhatsApp vía CDP",
        },
      },
      {
        id: "doc2issue",
        title: "doc2issue",
        tag: "Open source · Agentes",
        category: "Open source",
        role: "Autor",
        period: "2026",
        problem: "Convertir PDF/Word/PPT/Excel en issues de GitHub.",
        decision:
          "Pipeline de 3 agentes (analyzer, vision, creator) con skills por formato y JSON auditable.",
        result: "Conversión automatizada con artefacto intermedio revisable.",
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
          alt: "Pipeline de 3 agentes: PDF · DOCX · PPTX · XLSX a issues",
        },
      },
      {
        id: "issue-scout-agent",
        title: "issue-scout-agent",
        tag: "Open source · CI",
        category: "Open source",
        role: "Autor",
        period: "2026",
        problem: "Investigar issues y generar planes técnicos en CI.",
        decision:
          "GitHub Action multi-proveedor con tool use; activación con /scout.",
        result: "Planes accionables; humano aprueba. Action versionada.",
        stack: [
          "TypeScript",
          "Vercel AI SDK (cliente multi-proveedor)",
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
          alt: "Maqueta: comentario del agente con plan en acme/api #42",
        },
      },
      {
        id: "creditos-fondosbc",
        title: "Sistema de créditos — FondosBC",
        tag: "Gobierno · Integranet",
        category: "Gobierno",
        role: "Frontend → Líder de proyecto",
        period: "2024–presente",
        problem: "Migrar sistema legacy de créditos a plataforma propia.",
        decision:
          "Liderazgo de hasta 5 devs; Angular 17→22, Laravel 12, MySQL y WhatsApp Cloud API.",
        result: "Migración completada y soporte activo.",
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
          alt: "Panel de análisis de solicitudes del sistema FondosBC",
        },
      },
      {
        id: "cuadra",
        title: "Cuadra",
        tag: "Producto propio · PWA",
        category: "Producto propio",
        role: "Dueño",
        period: "2026",
        problem: "En Ensenada agua y luz por colonia se pierden entre chats.",
        decision:
          "PWA offline Laravel 13 + Vue 3/Inertia + PostgreSQL 18: reportes vecinales con upvotes.",
        result: "Bitácora pública visible y estado claro al instante.",
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
          alt: "Panel El pulso de tu cuadra con estado de Agua y Luz",
        },
      },
    ],
  },
  stack: {
    tag: "05 — stack",
    title: "Las piezas del sistema.",
    groups: [
      { title: "Frontend", items: ["Angular 16–22", "TypeScript"] },
      { title: "Backend", items: ["Laravel 10–13", "PHP", "Node.js"] },
      { title: "Datos", items: ["MySQL", "PostgreSQL", "SQLite"] },
      {
        title: "Calidad y entrega",
        items: ["Docker", "Nx", "GitHub Actions", "Pest/PHPUnit", "Vitest"],
      },
      { title: "Agentes", items: ["MCP", "opencode"] },
    ],
  },
  experience: {
    tag: "06 — experiencia",
    title: "Cómo llegué acá.",
    items: [
      {
        company: "Integranet",
        location: "Ensenada, B.C., México",
        period: "2023–presente",
        role: "Consultor y Líder de Proyecto",
        highlights: [
          "Hasta 5 devs en proyectos simultáneos; ciclo completo de requisitos a soporte.",
          "10+ plataformas de gobierno y privado entregadas y en soporte.",
        ],
      },
      {
        company: "Timbria",
        location: "Remoto",
        period: "2026–presente",
        role: "Cofundador técnico",
        highlights: [
          "Arquitectura, backend, generación CFDI y cliente PAC.",
          "Portal Next.js 16 y app móvil React Native/Expo.",
        ],
      },
      {
        company: "Universidad Autónoma de Baja California (UABC)",
        location: "Ensenada, B.C., México",
        period: "2019–2023",
        role: "Licenciatura en Ciencias de la Computación",
        highlights: [
          "Prácticas en 2022 y 2023.",
          "App móvil de apoyo psicológico: auth, roles y almacenamiento seguro.",
        ],
      },
    ],
  },
  writing: {
    tag: "07 — writing",
    title: "Escribo sobre agentes y arquitectura.",
    name: "Jorge Marquez · Espacio Latente",
    description:
      "Blog donde pruebo tecnología antes de recomendarla: agentes, MCP y arquitectura sin hype.",
    href: "https://moonslayers.github.io/blog/",
    cta: "Leer el blog",
  },
  contact: {
    tag: "08 — contacto",
    title: "Construyamos algo.",
    body: "¿Quieres sumar agentes a tu equipo sin romper producción? Hablemos.",
    email: "jorge.marquez.luna@uabc.edu.mx",
    links: [
      { label: "Email", href: "mailto:jorge.marquez.luna@uabc.edu.mx" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/jorge-marquez-luna/",
      },
      { label: "GitHub", href: "https://github.com/moonslayers/" },
      { label: "Blog", href: "https://moonslayers.github.io/blog/" },
    ],
  },
  footer: {
    text: "construido por agentes (y por mí)",
    copyright: "© 2026 Jorge Marquez",
  },
};

export const site = siteEs;
export default siteEs;
export { siteEs as siteES };
