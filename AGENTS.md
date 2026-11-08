# AGENTS.md — new-portfolio

## Nombres

- Carpeta local: `new-portfolio`. Repo/URL: `new-portafolio` (`base: /new-portafolio/`). No confundir.

## Proyecto

Portafolio personal bilingüe (ES/EN) de Jorge Marquez, publicado como GitHub Pages project page en `https://moonslayers.github.io/new-portafolio/`. Astro 6, output estático, sin backend ni CMS. Nombre público: **Jorge Marquez** (sin acento, sin “Luna”).

## Convenciones

- Node 22 (`.nvmrc`, `engines.node >=22`). Usar `npm ci` en CI, `npm install` local.
- Indentación: 2 espacios (`.editorconfig`). Formato con Prettier + `prettier-plugin-astro`.
- TypeScript estricto (`tsconfig.json`). Ejecutar `npm run check` antes de publicar.
- Commits en español o inglés, estilo convencional (`chore:`, `feat:`, etc.).
- No agregar comentarios en código salvo que se pida.
- No cambiar diseño ni contenido editorial fuera de la tarea asignada.

## Fuente de verdad del contenido

- Reglas editoriales, datos canónicos, inventario de proyectos y trampas conocidas: skill `cv-content-model` (`.agents/skills/cv-content-model/SKILL.md` en el workspace padre).
- Contenido publicado del sitio: `src/data/site.es.ts` y `src/data/site.en.ts`, tipados por `src/data/types.ts`.
- Etiquetas de UI: `src/i18n/ui.ts`.
- Antes de editar cifras, fechas, stacks o roles, verificar contra el skill y los repos fuente (ver comandos de verificación del skill). No copiar de `99-fuentes/background.md` ni de la plantilla LaTeX histórica.

## Arquitectura de datos

- `src/data/types.ts` define `SiteContent` y todas las interfaces de sección.
- `src/pages/index.astro` (ES) y `src/pages/en/index.astro` (EN) cargan su `site*.ts` y renderizan `LandingPage`.
- `src/layouts/LandingPage.astro` compone secciones en orden fijo: Hero, About, Method, Stack, Projects, Experience, Writing, Contact. NavDots y Header derivan de `content`.
- Paridad obligatoria: cualquier cambio editorial se aplica en `site.es.ts` y `site.en.ts` simultáneamente.

## Secciones

Componentes en `src/components/sections/`. Cada uno recibe `content` (o props derivadas) y usa `data-build` / `data-type` para el motor de animación. No eliminar estos atributos sin actualizar el motor.

## Motor de animación

- Código en `src/scripts/agents/` (`index.ts`, `motion.ts`, `typing.ts`, `sections.ts`, `intro.ts`, `review.ts`, `navigation.ts`, `fx.ts`, `context.ts`, `agents.ts`).
- Se inicializa en el cliente vía `initAgents()` (importado desde `LandingPage`/layout). Solo corre en browser (`typeof window`).
- Fallbacks que NO deben romperse:
  - `prefers-reduced-motion: reduce` → revelado estático, oculta capa de agentes y fx.
  - Mobile (`max-width: 768px`) → `instantReveal` por sección.
  - Botón "Saltar intro" / tecla `Escape` → `finishHeroInstantly`.
  - `sessionStorage.skipIntro === '1'` → salta intro.
  - `visibilitychange` → pausa/reanuda.
- Timings en `TIMING` (agents.ts) y `COPY_UPGRADES` (revisión automática de copy). No modificar sin validación visual.
- Navegación por secciones: wheel/teclado/touch con scroll snap lógico; `base` path no afecta anchors (`#about`, etc.).

## Scroll snap y observer

- Secciones de `100svh` con snap mandatory (desktop). Observer con threshold ~0.5 y rootMargin negativo para no construir antes de centrar.
- Móvil: `instantReveal` por sección.

## Revisión visual

- Gestos: flag, strike-through, retype, check. Si no hay par curado seguro, retipea el mismo texto de una frase existente del DOM.
- `COPY_UPGRADES` es opcional; pares deben ser seguros y no cambiar significado.

## Densidad de contenido

- Cada sección debe caber en un viewport (100svh): copy breve y escaneable.
- Hero: subtítulo 1–2 líneas (~160 caracteres), 5 chips.
- About: máximo 2 párrafos (~300–400 caracteres) + 3 KPIs; sin repetir el hero.
- Method: 4 pasos, una línea por paso; sin duplicar “gates humanos”.
- Projects: 6 tarjetas; cada una problema/decisión/resultado en frases cortas (~200–240 caracteres por tarjeta). Mantener los 6 proyectos y enlaces/estado privado.
- Stack: solo grupos y chips, sin párrafos.
- Experience: 3 entradas, máximo 2 bullets cortos por entrada.
- Writing: 1–2 frases. Contact: 1–2 frases + botones.
- Orden y tags: 01 Sobre/About, 02 Método/Method, 03 Proyectos/Projects, 04 Stack, 05 Experiencia/Experience, 06 Writing, 07 Contacto/Contact.
- Paridad ES/EN en estructura y cantidad.

## Reglas para no romper

### i18n

- Mantener `src/data/site.es.ts` y `src/data/site.en.ts` sincronizados (misma estructura, mismos ids de proyecto).
- `src/i18n/ui.ts` debe tener claves idénticas en ambos locales.
- Rutas: ES en `/`, EN en `/en/`. No cambiar `prefixDefaultLocale`.

### base path

- `astro.config.mjs`: `site: 'https://moonslayers.github.io'`, `base: '/new-portafolio/'`. No modificar.
- En componentes usar `import.meta.env.BASE_URL` para assets (como en `BaseLayout`). No hardcodear `/new-portafolio/` ni rutas absolutas a raíz.
- Sitemap y robots usan la URL completa con base.

### Accesibilidad

- Mantener skip link (`skipLinkText`), `lang` en `<html>`, landmarks (`main`, `header`, `footer`), `aria-label` en nav dots y botones.
- No remover `prefers-reduced-motion` fallback.
- Contraste y foco visible no deben degradarse.

### Fidelidad de animación

- Conservar atributos `data-build`, `data-type`, clases `pre-build`/`pre-build-y`, `is-typing`, `editorial-img`.
- No cambiar el orden de secciones ni los ids de sección (`hero`, `about`, `method`, `stack`, `work`, `experience`, `writing`, `contact`) sin actualizar `navSections` y `setupNavigation`.
- No introducir frameworks de UI adicionales.

## Checklist antes de publicar

1. `npm ci && npm run build` pasa sin errores.
2. `npm run check` sin errores de tipos.
3. `npm run format` aplicado (o diff revisado).
4. Paridad ES/EN verificada (contenido y UI labels).
5. `base: '/new-portafolio'` intacto.
6. Assets (retrato, portadas, og-image) actualizados si aplica.
7. Workflow `.github/workflows/deploy.yml` válido.
8. Estado de GitHub Pages reportado (activado con `build_type: workflow`).
9. No se expusieron tokens ni credenciales.
10. Preview local (`npm run preview`) revisado.
