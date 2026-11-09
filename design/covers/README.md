# Covers — fuente de portadas de proyecto

Cada HTML produce un lienzo fijo de **1600×900** (`html, body` y `.wrap` a 1600×900, `viewport` y `overflow: hidden`).
Paleta/tokens inlinados de `src/styles/global.css`: `--bg-paper #f7f5f0`, `--ink-primary #1c1b19`, `--ink-secondary #6b6862`, `--ink-light #e5e3db`, `--accent-terracotta #c75b39`; fuentes `Fraunces / Inter / JetBrains Mono` con fallbacks, grid 80 px.
Render a PNG con Firefox headless — referencia: `firefox --headless --screenshot <salida>.png --window-size=1600,900 <html>` (método; comando como referencia).
Conversión PNG→WebP con `sharp` calidad 85 a `public/projects/<id>.webp` (ej. `doc2issue.html` → `doc2issue.webp`).
Sin fuentes ni recursos de red: cada HTML es autocontenido (solo `<style>` inline, sin `@import`).
Destino final: los 3 WebP de proyectos sin UI — `doc2issue.webp`, `issue-scout-agent.webp`, `whatsapp-cdp-mcp.webp`.
