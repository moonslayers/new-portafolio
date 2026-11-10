# Portafolio — Jorge Marquez

Portafolio personal bilingüe (español/inglés) construido con Astro. Se publica como GitHub Pages project page en `https://moonslayers.github.io/new-portafolio/`.

## Nombres y rutas

- Carpeta local del proyecto: `new-portfolio` (con guion simple).
- Repositorio y URL publicada: `new-portafolio` (con doble `o`): `https://moonslayers.github.io/new-portafolio/`.
- `astro.config.mjs` mantiene `base: '/new-portafolio/'`. No cambiar.

## Stack

- Astro 6 (output estático), TypeScript
- Tailwind CSS 4 (vía `@tailwindcss/vite`)
- GSAP (motor de animación)
- `@astrojs/sitemap`
- Fuentes self-hosted: Fraunces, Inter, JetBrains Mono (`@fontsource/*`)

## Estructura

```text
/
├── .github/workflows/deploy.yml   # Deploy a GitHub Pages
├── public/                        # Assets estáticos (favicon, og-image, robots, .nojekyll)
├── src/
│   ├── assets/placeholders/       # SVGs placeholder (retrato, portadas)
│   ├── components/                # layout, ui, sections
│   ├── data/                      # site.es.ts, site.en.ts, types.ts
│   ├── i18n/ui.ts                 # Etiquetas UI por idioma
│   ├── layouts/                   # BaseLayout, LandingPage
│   ├── pages/                     # index.astro (ES), en/index.astro (EN)
│   ├── scripts/agents/            # Motor de animación
│   └── styles/                    # global.css, agents.css
├── astro.config.mjs               # site, base, i18n, sitemap
├── package.json
└── .nvmrc                         # Node 22
```

## Comandos

```sh
npm install          # o npm ci en CI
npm run dev          # servidor dev en localhost:4321
npm run build        # build a ./dist/
npm run preview      # preview del build
npm run check        # astro check (tipos)
npm run format       # prettier --write .
```

Node 22 (ver `.nvmrc`).

## Editar contenido ES/EN

La fuente de verdad del contenido es `src/data/site.es.ts` y `src/data/site.en.ts` (tipado por `src/data/types.ts`). Las etiquetas de UI (nav, botones, aria) viven en `src/i18n/ui.ts`. Mantener paridad entre ambos idiomas: cada cambio editorial debe aplicarse en los dos archivos.

## Sustituir retrato, portadas y OG image

- Retrato: `src/assets/placeholders/portrait.svg` (600×800, 3:4). Sustituir por foto real y aplicar clase `.editorial-img`.
- Portadas: `project-1.svg`, `project-2.svg`, `project-3.svg` (800×450, 16:9). Mantener `aspect-video` y `.editorial-img`.
- OG image: `public/og-image.png` (1200×630) y su fuente `public/og-image.svg`. Actualizar ambos.
- Formato preferido: SVG o WebP/PNG optimizado. Self-host; no usar imágenes externas en producción.

## Scroll snap

- Desktop: secciones de `100svh` con snap mandatory; el motor construye cada sección al entrar en viewport (threshold ~0.5).
- Móvil: revelado instantáneo por sección (`instantReveal`), sin choreography de cursores.

## Revisión visual

El motor revisa el copy recién construido: cursor viaja, marca una frase (flag), tacha y reescribe (retype) y cierra con check. Si no hay un par curado seguro, retipea exactamente el mismo texto de una frase existente en el DOM, sin cambiar el significado. Los pares curados (`COPY_UPGRADES`) son opcionales y seguros.

## Densidad de contenido

- Cada sección debe caber en un viewport (100svh): párrafos cortos y escaneables.
- Hero: subtítulo 1–2 líneas (~160 caracteres), 5 chips.
- About: máximo 2 párrafos (~300–400 caracteres) + 3 KPIs; sin repetir el hero.
- Method: 4 pasos, una línea por paso; sin duplicar “gates humanos”.
- Projects: 6 tarjetas; cada una problema/decisión/resultado en frases cortas (~200–240 caracteres por tarjeta).
- Stack: solo grupos y tecnologías (logo + nombre); sin párrafos.
- Experience: 3 entradas, máximo 2 bullets cortos por entrada.
- Writing: 1–2 frases. Contact: 1–2 frases + botones.
- Orden y tags: 01 Sobre/About, 02 Método/Method, 03 Proyectos/Projects, 04 Stack, 05 Experiencia/Experience, 06 Writing, 07 Contacto/Contact.
- Paridad ES/EN obligatoria en estructura y cantidad de bloques.
- Los atributos `data-build`/`data-type` deben permanecer para el motor.

## Animación y fallbacks

El motor (`src/scripts/agents/`) construye el contenido sección por sección con cursores animados (GSAP). Fallbacks:

- `prefers-reduced-motion: reduce` → revela todo el contenido estáticamente y oculta la capa de agentes.
- Mobile (`max-width: 768px`) → revelado instantáneo por sección.
- Botón "Saltar intro" y tecla `Escape` → finalizan la intro al instante.
- `sessionStorage.skipIntro === '1'` → salta la intro en visitas posteriores.
- `visibilitychange` pausa/reanuda las animaciones.

No cambiar los timings ni el comportamiento sin validar visualmente.

## Publicación en GitHub Pages

El workflow `.github/workflows/deploy.yml` se ejecuta en push a `main` y `workflow_dispatch`: `npm ci` → `npm run build` → upload artifact `dist` → deploy. Pages está configurado con `build_type: workflow`.

URL final: https://moonslayers.github.io/new-portafolio/

## Mantenimiento

Ver `AGENTS.md` para convenciones, arquitectura y checklist antes de publicar.
