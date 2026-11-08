import type { Engine } from "./context";
import { gsapRef as gsap } from "./context";

export function pulse(_eng: Engine, x: number, y: number, color: string): void {
  const fx = document.getElementById("fx-layer");
  if (!fx) return;
  const p = document.createElement("div");
  p.className = "click-pulse";
  p.style.setProperty("--c", color);
  p.style.left = x + "px";
  p.style.top = y + "px";
  fx.appendChild(p);
  gsap.fromTo(
    p,
    { scale: 0.15, opacity: 1 },
    {
      scale: 1.5,
      opacity: 0,
      duration: 0.65,
      ease: "power2.out",
      onComplete: () => p.remove(),
    },
  );
}

export function reviewPulse(_eng: Engine, x: number, y: number): void {
  const fx = document.getElementById("fx-layer");
  if (!fx) return;
  const p = document.createElement("div");
  p.className = "click-pulse";
  p.style.setProperty("--c", "#2E5A44");
  p.style.left = x + "px";
  p.style.top = y + "px";
  fx.appendChild(p);
  gsap.fromTo(
    p,
    { scale: 0.15, opacity: 1 },
    {
      scale: 1.5,
      opacity: 0,
      duration: 0.65,
      ease: "power2.out",
      onComplete: () => p.remove(),
    },
  );

  const check = document.createElement("div");
  check.innerHTML = "✓";
  check.style.position = "fixed";
  check.style.left = x + 12 + "px";
  check.style.top = y + 8 + "px";
  check.style.color = "#2E5A44";
  check.style.fontSize = "14px";
  check.style.fontFamily = "monospace";
  check.style.fontWeight = "bold";
  check.style.pointerEvents = "none";
  check.style.zIndex = "69";
  fx.appendChild(check);

  gsap.fromTo(
    check,
    { opacity: 0, scale: 0.5, y: 5 },
    { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out" },
  );
  gsap.to(check, {
    opacity: 0,
    y: -10,
    delay: 0.6,
    duration: 0.4,
    onComplete: () => check.remove(),
  });
}

export function flagPulse(_eng: Engine, x: number, y: number): void {
  const fx = document.getElementById("fx-layer");
  if (!fx) return;
  const p = document.createElement("div");
  p.className = "click-pulse";
  p.style.setProperty("--c", "#D9A05B");
  p.style.left = x + "px";
  p.style.top = y + "px";
  fx.appendChild(p);
  gsap.fromTo(
    p,
    { scale: 0.15, opacity: 1 },
    {
      scale: 1.5,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      onComplete: () => p.remove(),
    },
  );

  const badge = document.createElement("div");
  badge.textContent = "!";
  badge.style.position = "fixed";
  badge.style.left = x - 8 + "px";
  badge.style.top = Math.max(10, y - 24) + "px";
  badge.style.width = "16px";
  badge.style.height = "16px";
  badge.style.borderRadius = "50%";
  badge.style.background = "#D9A05B";
  badge.style.color = "#1C1B19";
  badge.style.fontSize = "11px";
  badge.style.fontWeight = "bold";
  badge.style.display = "flex";
  badge.style.alignItems = "center";
  badge.style.justifyContent = "center";
  badge.style.fontFamily = "monospace";
  badge.style.pointerEvents = "none";
  badge.style.zIndex = "69";
  fx.appendChild(badge);

  gsap.fromTo(
    badge,
    { scale: 0, y: 6 },
    { scale: 1, y: 0, duration: 0.3, ease: "back.out" },
  );
  gsap.to(badge, {
    opacity: 0,
    y: -14,
    delay: 1.4,
    duration: 0.4,
    onComplete: () => badge.remove(),
  });
}
