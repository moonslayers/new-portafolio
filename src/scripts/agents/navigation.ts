import type { Engine } from "./context";
import * as motion from "./motion";
import * as sections from "./sections";

let scrollHandler: (() => void) | null = null;
let scrollTimer: ReturnType<typeof setTimeout> | null = null;
let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;
let scrollEndCancelled = false;

function updateNavDots(idx: number): void {
  const dots = Array.from(document.querySelectorAll<HTMLElement>(".nav-dot"));
  dots.forEach((d, i) => {
    d.classList.toggle("active", i === idx);
    if (i === idx) d.setAttribute("aria-current", "true");
    else d.removeAttribute("aria-current");
  });
}

export function setupNavigation(eng: Engine): void {
  eng.sections = Array.from(document.querySelectorAll<HTMLElement>("section"));

  eng.activeIdx = 0;
  updateNavDots(0);

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", () => {
      const href = a.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = document.querySelector(href) as HTMLElement | null;
      if (!target) return;
      const section = target.closest("section") as HTMLElement | null;
      if (!section) return;
      if (section.id !== "hero" && !eng.heroDone) {
        sections.finishHeroInstantly(eng);
        eng.heroDone = true;
      }
    });
  });

  const onScroll = () => {
    if (eng.isNavigating) return;
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (eng.isNavigating) return;
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      eng.sections.forEach((s) => {
        const d = Math.abs(s.getBoundingClientRect().top);
        if (d < bestDist) {
          bestDist = d;
          best = s;
        }
      });
      if (!best) return;
      const idx = eng.sections.indexOf(best);
      if (idx === -1) return;
      eng.activeIdx = idx;
      updateNavDots(idx);
    }, 200);
  };
  scrollHandler = onScroll;
  window.addEventListener("scroll", onScroll);
}

export function goTo(eng: Engine, idx: number): void {
  if (idx < 0 || idx >= eng.sections.length) return;
  if (eng.isNavigating) return;
  if (idx === eng.activeIdx) return;
  const oldIdx = eng.activeIdx;
  eng.isNavigating = true;
  eng.activeIdx = idx;
  updateNavDots(idx);
  eng.reviewQueue = [];
  eng.isReviewing = false;
  motion.clearFrames(eng);
  motion.clearFx();
  motion.cleanupFlags();
  if (oldIdx === 0 && idx !== 0 && !eng.heroDone)
    sections.finishHeroInstantly(eng);
  eng.sections[idx].scrollIntoView({ behavior: "smooth", block: "start" });
  waitForScrollEnd(eng, () => {
    eng.isNavigating = false;
    sections.buildSection(eng, eng.sections[idx]).catch(() => {});
  });
}

export function waitForScrollEnd(_eng: Engine, cb: () => void): void {
  cancelScrollEnd();
  scrollEndCancelled = false;
  const start = Date.now();
  const maxWait = 1500;
  let lastY = window.scrollY;
  let stable = 0;
  const check = () => {
    if (scrollEndCancelled) return;
    if (Date.now() - start > maxWait) {
      scrollEndTimer = null;
      cb();
      return;
    }
    const y = window.scrollY;
    if (Math.abs(y - lastY) < 1.5) {
      stable++;
      if (stable >= 2) {
        scrollEndTimer = null;
        cb();
        return;
      }
    } else stable = 0;
    lastY = y;
    scrollEndTimer = setTimeout(check, 60);
  };
  scrollEndTimer = setTimeout(check, 60);
}

export function cancelScrollEnd(): void {
  scrollEndCancelled = true;
  if (scrollEndTimer) {
    clearTimeout(scrollEndTimer);
    scrollEndTimer = null;
  }
}

export function cleanupNavigation(eng: Engine): void {
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
    scrollHandler = null;
  }
  if (scrollTimer) {
    clearTimeout(scrollTimer);
    scrollTimer = null;
  }
  cancelScrollEnd();
  void eng;
}

export function onKey(e: KeyboardEvent): void {
  const target = e.target as HTMLElement | null;
  if (
    target &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable)
  )
    return;
  if (e.key === "Escape") {
    const skipBtn = document.getElementById("skip-intro");
    if (skipBtn && skipBtn.hidden) return;
    if (skipBtn) skipBtn.click();
  }
}
