# AGENTS.md — new-portfolio

## Nombres

- Carpeta local: `new-portfolio`. Repo/URL: `new-portafolio` (`base: /new-portafolio/`). No confundir.

## Proyecto

Portafolio personal bilingüe (ES/EN) de Jorge Marquez, publicado como GitHub Pages project page en `https://moonslayers.github.io/new-portafolio/`. Astro 7.4.7, output estático, sin backend ni CMS. Nombre público: **Jorge Marquez** (sin acento, sin “Luna”).

## Convenciones

- Node 22.23.4 (`.nvmrc`, `engines.node >=22.23.4`). Usar `npm ci` en CI, `npm install` local.
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
- `src/layouts/LandingPage.astro` compone secciones en orden fijo: Hero, About, Method, Projects I (`work`), Projects II (`work-2`), Stack, Experience, Writing, Contact. NavDots 9; Header principales. NavDots y Header derivan de `content`.
- Paridad obligatoria: cualquier cambio editorial se aplica en `site.es.ts` y `site.en.ts` simultáneamente.

## Secciones

Componentes en `src/components/sections/`. Cada uno recibe `content` (o props derivadas) y usa `data-build` / `data-type` para el motor de animación. No eliminar estos atributos sin actualizar el motor.

## Motor de animación

- Skill: `portfolio-animation-engine` (`.agents/skills/portfolio-animation-engine/SKILL.md`).
- Invariantes: todo `[data-build]` visible tiene `data-type`; al completar `data-animated` es `text-3` o `image-2`; `fast`/`instant` = 0 en build normal de desktop (skip/Escape y rutas de error/fallback pueden producir `instant`; móvil `static-mobile`, reduced `static-reduced`); `window.__cursorBuilds` cuadra con los elementos.
- Fallbacks que no deben romperse:
  - `prefers-reduced-motion: reduce` → revelado estático (`static-reduced`), oculta capa de agentes y fx.
  - Mobile (`max-width: 768px`) → hero y secciones con `static-mobile` (sin intro animada).
  - Botón "Saltar intro" / tecla `Escape` → `finishHeroInstantly` solo durante la intro del hero; inerte después.
  - `sessionStorage.skipIntro === '1'` → salta intro; en reload se limpia y la intro se replayea salvo `data-skip-intro` explícito que fuerza skip.
  - `visibilitychange` → pausa/reanuda.
- Navegación sin secuestro: cambiar de sección no incrementa `buildToken` ni cancela la construcción anterior; builds de sección serializados FIFO (dedup, sin cancelar el build en curso); solo skip/reduced/móvil/token-error abortan.
- Refresh/reset y bfcache:
  - `history.scrollRestoration='manual'` en `<head>`; boot reset antes de `initAgents()` fuerza scroll instantáneo al hero y sincroniza dot a índice 0.
  - Reload limpia `sessionStorage.skipIntro` (replay de intro); `data-skip-intro` mantiene skip si está presente.
  - `pagehide` persistido (bfcache) no hace `dispose`; unload real sí.

## Scroll snap y observer

- Secciones de `100svh` con snap mandatory (desktop): `scroll-margin: 0`, header `absolute`, `overflow-x: clip`.
- Móvil/reduced: sin snap (`scroll-snap-type: none`).
- Observer con threshold ~0.5 y rootMargin negativo para no construir antes de centrar.
- Móvil: `static-mobile` por sección (hero y secciones sin intro animada).

## Revisión visual

- Gestos: flag, strike-through, retype, check. Si no hay par curado seguro, retipea el mismo texto de una frase existente del DOM.
- `COPY_UPGRADES` es opcional; pares deben ser seguros y no cambiar significado.

## Densidad de contenido

- Cada sección debe caber en un viewport (100svh): copy breve y escaneable.
- Hero: subtítulo 1–2 líneas (~160 caracteres), 5 chips.
- About: máximo 2 párrafos (~300–400 caracteres) + 3 KPIs; sin repetir el hero.
- Method: 4 pasos, una línea por paso; sin duplicar “gates humanos”.
- Projects: 6 tarjetas; cada una problema/decisión/resultado en frases cortas (~200–240 caracteres por tarjeta: la suma de los tres campos, no por campo). Mantener los 6 proyectos y enlaces/estado privado.
- Stack: solo grupos y chips, sin párrafos.
- Experience: 3 entradas, máximo 2 bullets cortos por entrada.
- Writing: 1–2 frases. Contact: 1–2 frases + botones.
- Orden y tags: 01 About, 02 Method, 03 Projects (`work`), 04 More projects (`work-2`), 05 Stack, 06 Experience, 07 Writing, 08 Contact.
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
- No cambiar el orden de secciones ni los ids de sección (`hero`, `about`, `method`, `work`, `work-2`, `stack`, `experience`, `writing`, `contact`) sin actualizar `navSections` y `setupNavigation`.
- Fidelidad: ids incluyen `work-2`; conservar `data-animated`; no `FAST_TYPES`, no cortes, no cancelación entre secciones.
- No introducir frameworks de UI adicionales.

## Comandos

```bash
npm ci
npm run check
npm run build
npx prettier --check .
npm audit --omit=dev
npm run preview
```

Nota de QA visual: Selenium + Firefox; verificar `[data-build]`/`data-animated`, `window.__cursorBuilds`, `100svh` y snap.

## Checklist antes de publicar

1. `npm ci && npm run build` pasa sin errores.
2. `npm run check` sin errores de tipos.
3. `npm run format` aplicado (o diff revisado).
4. Paridad ES/EN verificada (contenido y UI labels).
5. `base: '/new-portafolio'` intacto.
6. Assets (retrato, portadas, og-image) actualizados si aplica. Todo lo que esté en `public/` se publica: los originales pesados van a `assets-src/` (ignorado por git).
7. Workflow `.github/workflows/deploy.yml` válido.
8. Estado de GitHub Pages reportado (activado con `build_type: workflow`).
9. No se expusieron tokens ni credenciales.
10. Preview local (`npm run preview`) revisado.
11. `npx prettier --check .` pasa.
12. Cursor QA en build normal de desktop (sin skip): 0 `fast`/`instant`, todos `data-animated` (skip/Escape/error/fallback pueden dar `instant`; móvil `static-mobile`).
13. Snap QA: top 0, bottom = viewport en 1440×900 y 1366×768.
