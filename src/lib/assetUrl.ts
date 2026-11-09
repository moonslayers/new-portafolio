export type AssetInput = string | { src: string } | null | undefined;

function toSrc(value: AssetInput): string | null {
  if (value == null) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && "src" in value) {
    const s = (value as { src: unknown }).src;
    return typeof s === "string" ? s : null;
  }
  return null;
}

export function resolveAssetUrl(raw: AssetInput, fallbackSrc: string): string {
  const rawSrc = toSrc(raw);
  if (!rawSrc) return fallbackSrc;

  if (
    rawSrc.startsWith("http://") ||
    rawSrc.startsWith("https://") ||
    rawSrc.startsWith("//") ||
    rawSrc.startsWith("data:") ||
    rawSrc.startsWith("blob:")
  ) {
    return rawSrc;
  }

  const base = import.meta.env.BASE_URL;
  if (rawSrc.startsWith(base)) return rawSrc;

  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const normalizedSrc = rawSrc.replace(/^\/+/, "");
  return `${normalizedBase}${normalizedSrc}`;
}
