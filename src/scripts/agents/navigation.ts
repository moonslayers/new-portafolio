import type { Engine } from "./context";
import * as motion from "./motion";
import * as review from "./review";
import * as sections from "./sections";

let scrollHandler: (() => void) | null = null;
let scrollTimer: ReturnType<typeof setTimeout> | null = null;
let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;
let scrollEndCancelled = false;
let anchorListeners: Array<{
  el: HTMLAnchorElement;
  fn: (e: Event) => void;
}> = [];
let dotListeners: Array<{ el: Element; fn: (e: Event) => void }> = [];

function updateNavDots(idx: number): void {
  const dots = Array.from(document.querySelectorAll<HTMLElement>(".nav-dot"));
  dots.forEach((d, i) => {
    d.classList.toggle("active", i === idx);
    if (i === idx) d.setAttribute("aria-current", "true");
    else d.removeAttribute("aria-current");
  });
}

export function getClosestSectionIndex(eng: Engine): number | null {
  if (!eng.sections.length) return null;
  let best: HTMLElement | null = null;
  let bestDist = Infinity;
  const viewportCenter = window.innerHeight * 0.5;
  eng.sections.forEach((s) => {
    const r = s.getBoundingClientRect();
    const center = r.top + r.height * 0.5;
    const d = Math.abs(center - viewportCenter);
    if (d < bestDist) {
      bestDist = d;
      best = s;
    }
  });
  if (!best) return null;
  const idx = eng.sections.indexOf(best);
  return idx === -1 ? null : idx;
}

export function isScrollSettling(): boolean {
  return scrollTimer !== null;
}

function coreActivate(eng: Engine, idx: number): boolean {
  if (idx < 0 || idx >= eng.sections.length) return false;
  if (idx === eng.activeIdx) return false;
  const dest = eng.sections[idx];
  if (!dest) return false;
  const desktop = !eng.mobile && !eng.reducedMotion;
  if (desktop) {
    if (
      eng.buildingSection &&
      eng.buildingSection !== dest &&
      eng.buildingSection.id !== "hero"
    ) {
      sections.markSectionAbandoned(eng, eng.buildingSection);
    }
    const queued = [...eng.sectionBuildQueue];
    queued.forEach((sec) => {
      if (sec !== dest && sec.id !== "hero")
        sections.markSectionAbandoned(eng, sec);
    });
    sections.unmarkSectionAbandoned(eng, dest);
    if (!eng.builtSections.has(dest)) sections.prioritizeSection(eng, dest);
  } else {
    if (!eng.builtSections.has(dest)) sections.prioritizeSection(eng, dest);
  }
  const oldIdx = eng.activeIdx;
  eng.activeIdx = idx;
  updateNavDots(idx);
  review.cancelReview(eng);
  motion.clearFrames(eng);
  motion.clearFx();
  motion.cleanupFlags();
  if (oldIdx === 0 && idx !== 0 && !eng.heroDone)
    sections.finishHeroInstantly(eng);
  try {
    dest.setAttribute("tabindex", "-1");
    (dest as HTMLElement).focus({ preventScroll: true });
  } catch {}
  return true;
}

export function setupNavigation(eng: Engine): void {
  eng.sections = Array.from(document.querySelectorAll<HTMLElement>("section"));
  eng.activeIdx = 0;
  updateNavDots(0);

  const dotsRoot = document.querySelector("[data-nav-dots]");
  if (dotsRoot) {
    const dots = Array.from(dotsRoot.querySelectorAll<HTMLElement>(".nav-dot"));
    dots.forEach((dot) => {
      const fn = () => {
        const raw = dot.getAttribute("data-index");
        let idx = raw ? parseInt(raw, 10) : -1;
        if (Number.isNaN(idx) || idx < 0) {
          const id = dot.getAttribute("data-section");
          if (!id) return;
          const target = document.getElementById(id);
          if (!target) return;
          const sec = target.closest("section") as HTMLElement | null;
          if (!sec) return;
          idx = eng.sections.indexOf(sec);
        }
        if (idx < 0 || idx >= eng.sections.length) return;
        goTo(eng, idx);
      };
      dot.addEventListener("click", fn);
      dotListeners.push({ el: dot, fn });
    });
  }

  const anchors = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
  );
  anchors.forEach((a) => {
    const fn = (e: Event) => {
      const href = a.getAttribute("href");
      if (!href || href.length < 2 || !href.startsWith("#")) return;
      let target: HTMLElement | null = null;
      try {
        target = document.querySelector(href) as HTMLElement | null;
      } catch {
        return;
      }
      if (!target) return;
      const section = target.closest("section") as HTMLElement | null;
      if (!section) return;
      const idx = eng.sections.indexOf(section);
      if (idx === -1) return;
      e.preventDefault();
      goTo(eng, idx);
      try {
        history.pushState(null, "", href);
      } catch {}
    };
    a.addEventListener("click", fn);
    anchorListeners.push({ el: a, fn });
  });

  const onScroll = () => {
    if (eng.isNavigating) return;
    if (scrollTimer) clearTimeout(scrollTimer);
    const myGen = ++eng.navigationSeq;
    scrollTimer = setTimeout(() => {
      scrollTimer = null;
      if (myGen !== eng.navigationSeq) return;
      if (eng.isNavigating) return;
      const idx = getClosestSectionIndex(eng);
      if (idx === null) return;
      if (idx === eng.activeIdx) return;
      if (myGen !== eng.navigationSeq) return;
      coreActivate(eng, idx);
    }, 180);
  };
  scrollHandler = onScroll;
  window.addEventListener("scroll", onScroll, { passive: true });
}

export function goTo(eng: Engine, idx: number): void {
  if (idx < 0 || idx >= eng.sections.length) return;
  if (idx === eng.activeIdx) return;
  const dest = eng.sections[idx];
  if (!dest) return;
  const myGen = ++eng.navigationSeq;
  if (scrollTimer) {
    clearTimeout(scrollTimer);
    scrollTimer = null;
  }
  cancelScrollEnd();
  const activated = coreActivate(eng, idx);
  if (!activated) return;
  eng.isNavigating = true;
  dest.scrollIntoView({ behavior: "smooth", block: "start" });
  waitForScrollEnd(eng, () => {
    if (myGen !== eng.navigationSeq) return;
    eng.isNavigating = false;
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
  anchorListeners.forEach(({ el, fn }) => {
    try {
      el.removeEventListener("click", fn);
    } catch {}
  });
  anchorListeners = [];
  dotListeners.forEach(({ el, fn }) => {
    try {
      el.removeEventListener("click", fn);
    } catch {}
  });
  dotListeners = [];
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
