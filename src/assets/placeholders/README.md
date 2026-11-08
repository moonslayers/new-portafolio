# Placeholders editoriales

SVGs abstractos con la paleta del sitio. Sustituir por assets reales manteniendo proporciones.

## Slots

- `portrait.svg` (600×800, 3:4) — retrato editorial de la sección About. Sustituir por foto real; aplicar clase `.editorial-img` para el tratamiento grayscale/sepia.
- `project-1.svg` … `project-6.svg` (800×450, 16:9) — portadas de proyectos (6 slots). Sustituir por screenshots reales; mantener `aspect-video` y clase `.editorial-img`.

## Convención

- Formato preferido: SVG o WebP/PNG optimizado.
- Mantener contraste con fondo paper (#F7F5F0).
- No usar imágenes externas en producción; self-host en `src/assets/` o `public/`.
