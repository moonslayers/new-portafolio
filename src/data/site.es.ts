import type { SiteContent } from "./types";

export const siteEs: SiteContent = {
  locale: "es",
  seo: {
    title: "Jorge Márquez Luna — AI-Native Tech Lead",
    description:
      "Portafolio de Jorge Márquez Luna, AI-Native Tech Lead. Sistemas de agentes con orquestación multi-modelo, skills auditables y gates humanos. Angular 16–22, Laravel 10–13, MCP.",
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
      { label: "Stack", href: "#stack" },
      { label: "Proyectos", href: "#work" },
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
      "Convierto requerimientos de negocio en sistemas de IA que operan en producción, con reglas claras: orquestación multi-modelo, skills auditables y revisión humana en cada decisión crítica.",
    ctaPrimary: { label: "Ver proyectos →", href: "#work" },
    ctaSecondary: { label: "Hablemos", href: "#contact" },
    badges: [
      "MCP",
      "Skills",
      "Subagentes",
      "GitHub Actions",
      "Angular",
      "Laravel",
      "TypeScript",
    ],
    scrollLabel: "Scroll",
  },
  about: {
    tag: "01 — sobre mí",
    title: "Del prompt al producto.",
    body: `Convierto requerimientos de negocio en sistemas de IA que operan en producción, con reglas claras: orquestación multi-modelo, skills auditables y revisión humana en cada decisión crítica.

Soy líder de proyecto en Integranet. Durante 3 años he entregado 10+ plataformas para gobierno del estado de Baja California y sector privado: créditos, trámites ambientales, estímulos fiscales, helpdesk, compras, almacenes y una app móvil. Lideré equipos de hasta 5 desarrolladores y cubrí el ciclo completo: levantamiento con stakeholders, arquitectura, implementación, QA, despliegue y soporte. Opero como player-coach: delego, reviso y entro a resolver bugs o incidentes urgentes; presento avances, solicitudes y reportes de soporte a clientes y dirección.

Mi especialidad hoy es la ingeniería asistida por agentes. Diseñé un método sobre opencode que versiona el contexto en el repositorio (AGENTS.md), divide el desarrollo en comandos (/context-gather → /plan → /execute → /validate), instala skills con lockfile y hash, y asigna subagentes con alcance y salida definidos. Timbria mantiene decenas de skills versionadas; la plataforma de Medio Ambiente, decenas de skills de dominio.

También construyo las piezas que faltan: un servidor MCP propio de 10 herramientas para controlar WhatsApp Desktop vía CDP, con rate limiting y tests; doc2issue, un pipeline de 3 agentes que convierte PDF, Word, PPT y Excel en issues de GitHub; e issue-scout-agent, un agente con tool use dentro de GitHub Actions.

Mi criterio: los modelos económicos hacen el trabajo pesado, los premium revisan, analizan requerimientos y resuelven percepción difícil; el humano aprueba. Usé bases vectoriales para memoria de agentes y las descarté como caja negra: para conocimiento operativo prefiero skills versionables y auditables. Sé cuándo un problema pide RAG sobre un corpus grande y cuándo no.

Escribo Beyond the Hype, una newsletter donde pruebo la tecnología antes de recomendarla.

Mi siguiente paso es un rol como AI-Native Tech Lead o AI Solutions Architect, en equipos que ya lleven agentes a producción y necesiten arquitectura, estándares, evaluación y entrega.`,
    kpis: [
      { value: "3", label: "Años entregando plataformas" },
      { value: "10+", label: "Plataformas de gobierno y sector privado" },
      { value: "5", label: "Desarrolladores máximo en equipo" },
    ],
  },
  method: {
    tag: "02 — método",
    title: "Cómo trabajo.",
    intro:
      "Un método de ingeniería asistida por agentes sobre opencode: contexto versionado, comandos para el ciclo, skills con lockfile, subagentes acotados, MCP y gates humanos.",
    items: [
      {
        title: "Contexto versionado (AGENTS.md)",
        description:
          "El conocimiento del proyecto vive en el repositorio, no en la cabeza de una persona.",
      },
      {
        title: "Comandos del ciclo",
        description: "/context-gather → /plan → /execute → /validate.",
      },
      {
        title: "Skills con lockfile",
        description:
          "Skills versionadas con hash; cambios auditables y reproducibles.",
      },
      {
        title: "Subagentes acotados",
        description:
          "Roles con alcance y salida definidos; no agentes sueltos.",
      },
      {
        title: "MCP",
        description:
          "Laravel Boost, Nx, shadcn, Spartan UI y un MCP propio para WhatsApp (10 tools).",
      },
      {
        title: "Gates humanos",
        description:
          "El humano aprueba; lint, tests y build como condición de merge.",
      },
      {
        title: "Calidad en cada PR",
        description:
          "Revisión manual de cada PR, con gates de lint, tests y build.",
      },
    ],
  },
  projects: {
    tag: "03 — proyectos",
    title: "Cosas que construí.",
    intro:
      "Seis proyectos que representan producto, open source, gobierno y liderazgo técnico.",
    items: [
      {
        id: "timbria",
        title: "Timbria",
        tag: "Startup · CFDI 4.0",
        category: "Producto propio",
        role: "Cofundador técnico",
        period: "2026–presente",
        problem:
          "Negocios en México emiten facturas CFDI 4.0 desde portales lentos; se busca facturar desde WhatsApp escaneando un QR y fotografiando el ticket.",
        decision:
          "Arquitectura Laravel 13 + Next.js 16 + PostgreSQL, paquetes compartidos de CFDI y tipos, monorepo Turbo, generación de CFDI y cliente PAC.",
        result:
          "Producto en desarrollo con arquitectura definida, base técnica operativa y decenas de skills versionadas; separación clara entre negocio y tecnología.",
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
        role: "Autor",
        period: "2026",
        problem:
          "Los agentes necesitan operar WhatsApp Desktop sin APIs no oficiales ni cuentas paralelas.",
        decision:
          "Servidor MCP en TypeScript sobre CDP, arquitectura por capas, rate limiter desacoplado, 10 tools con errores estructurados.",
        result:
          "10 tools MCP, rate limiting anti-ban, typing simulado y tests del rate limiter.",
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
        tag: "Open source · Agentes",
        category: "Open source",
        role: "Autor",
        period: "2026",
        problem:
          "Convertir documentos de requerimientos (PDF, Word, PPT, Excel) en issues estructurados de GitHub Projects.",
        decision:
          "Pipeline de 3 agentes (analyzer, vision, creator) con skills por formato y JSON intermedio revisable.",
        result:
          "Conversión automatizada de documentos a issues, con artefacto intermedio auditable.",
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
        role: "Autor",
        period: "2026",
        problem:
          "Investigar issues y generar planes técnicos dentro de CI, sin acoplarse a un solo modelo.",
        decision:
          "GitHub Action multi-proveedor con tool use (listDir, readFile, searchCode, getFileTree, gitDiff), activación opt-in con /scout.",
        result:
          "Agente que propone planes accionables; el humano aprueba. Distribuido como Action versionada.",
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
      },
      {
        id: "creditos-fondosbc",
        title: "Sistema de créditos — FondosBC",
        tag: "Gobierno · Integranet",
        category: "Gobierno",
        role: "Frontend → Líder de proyecto",
        period: "2024–presente",
        problem:
          "Migrar un sistema legacy de proveedor externo a una plataforma propia de créditos.",
        decision:
          "Liderazgo de hasta 5 devs, Angular 17→22, Laravel 12, MySQL, WhatsApp Cloud API, pruebas feature/unit.",
        result:
          "Migración legacy completada; soporte activo; evolución de frontend a líder de proyecto.",
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
        role: "Autor",
        period: "2026",
        problem:
          "Visualizar en tiempo real sesiones de agentes de cuatro herramientas como un reino pixel-art.",
        decision:
          "Lectura local de transcripts, traducción de eventos a estado de juego, servidor local en 127.0.0.1.",
        result:
          "Paquete publicado en npm; soporte de múltiples proyectos como ciudades.",
        stack: ["Node.js ≥22", "TypeScript", "PixiJS v8", "WebSocket", "Vite"],
        links: [
          { label: "npm", href: "https://www.npmjs.com/package/age-of-agents" },
          {
            label: "Sitio",
            href: "https://agentsmill.github.io/age-of-agents/",
          },
        ],
        featured: true,
      },
    ],
  },
  stack: {
    tag: "04 — stack",
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
    tag: "05 — trayectoria",
    title: "Cómo llegué acá.",
    items: [
      {
        company: "Integranet",
        location: "Ensenada, B.C., México",
        period: "2023–presente",
        role: "Consultor y Líder de Proyecto",
        description: "Sector gobierno y privado; proyectos simultáneos.",
        highlights: [
          "Liderazgo de hasta 5 desarrolladores en proyectos simultáneos.",
          "Ownership del ciclo completo: requisitos, diseño, implementación, revisión, despliegue y soporte.",
          "Gates de calidad (lint, tests, build, e2e) y revisión manual de cada PR.",
          "Migraciones mayores en producción: Angular 16→18, 17→22; Laravel 10→13.",
        ],
      },
      {
        company: "Timbria",
        location: "Remoto",
        period: "2026–presente",
        role: "Cofundador técnico",
        description: "Startup de facturación CFDI 4.0 por WhatsApp.",
        highlights: [
          "Arquitectura, backend, generación de CFDI y cliente PAC.",
          "Modelo de datos PostgreSQL y paquetes compartidos.",
          "Portal administrativo en Next.js 16 y app móvil en React Native/Expo.",
        ],
      },
      {
        company: "Universidad Autónoma de Baja California (UABC)",
        location: "Ensenada, B.C., México",
        period: "2019–2023",
        role: "Licenciatura en Ciencias de la Computación",
        description:
          "Prácticas profesionales en dos periodos (2022 y 2023) y proyectos de modalidad.",
        highlights: [
          "Aplicación móvil de apoyo psicológico para estudiantes: autenticación, roles y almacenamiento seguro.",
          "Stack: Flutter, Dart, Firebase Auth, Firestore y Storage.",
        ],
      },
    ],
    education: [
      {
        institution: "Universidad Autónoma de Baja California (UABC)",
        location: "Ensenada, B.C., México",
        period: "2019–2023",
        degree: "Licenciatura en Ciencias de la Computación",
        details: [
          "Facultad de Ciencias",
          "Prácticas profesionales en dos periodos (2022 y 2023)",
        ],
      },
    ],
  },
  writing: {
    tag: "06 — writing",
    title: "Beyond the Hype.",
    name: "Beyond the Hype",
    description:
      "Newsletter donde pruebo la tecnología antes de recomendarla: agentes, MCP, orquestación multi-modelo y decisiones de arquitectura con sus trade-offs. Sin hype.",
    href: "https://substack.com/@jrmarquez",
    cta: "Leer en Substack",
  },
  contact: {
    tag: "07 — contacto",
    title: "Construyamos algo.",
    body: "Si estás pensando cómo meter agentes en tu equipo sin que se te caiga el mundo, hablemos.",
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
    text: "construido por agentes (y por mí)",
    copyright: "© 2026 Jorge Márquez Luna",
  },
};

export const site = siteEs;
export default siteEs;
export { siteEs as siteES };
