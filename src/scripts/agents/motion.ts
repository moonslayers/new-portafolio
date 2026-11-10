import { gsapRef as gsap } from "./context";
import type { Engine, Cursor } from "./context";

export function initCursors(eng: Engine): void {
  const els = Array.from(
    document.querySelectorAll<HTMLElement>(".agent-cursor"),
  );
  eng.cursors = els.map((el, i) => {
    const h = eng.agents[i].home;
    gsap.set(el, {
      x: window.innerWidth * h[0],
      y: window.innerHeight * h[1],
      opacity: 0,
      scale: 1,
    });
    const color =
      getComputedStyle(el).getPropertyValue("--c").trim() || "#1C1B19";
    return { el, color };
  });
  eng.cursorBusyCounts = eng.cursors.map(() => 0);
}

export async function flyTo(
  _eng: Engine,
  cursor: Cursor,
  x: number,
  y: number,
  dur: number,
): Promise<void> {
  gsap.to(cursor.el, { opacity: 1, duration: 0.22 });
  await gsap.to(cursor.el, { x, y, duration: dur, ease: "power3.inOut" });
}

export async function click(_eng: Engine, cursor: Cursor): Promise<void> {
  await gsap.to(cursor.el, {
    scale: 0.72,
    duration: 0.08,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut",
  });
}

export function scatterCursors(eng: Engine): void {
  eng.cursors.forEach((c, i) => {
    const h = eng.agents[i].home;
    const x = Math.max(
      40,
      Math.min(
        window.innerWidth - 40,
        window.innerWidth * h[0] + eng.rand(-70, 70),
      ),
    );
    const y = Math.max(
      60,
      Math.min(
        window.innerHeight - 60,
        window.innerHeight * h[1] + eng.rand(-60, 60),
      ),
    );
    gsap.to(c.el, {
      x,
      y,
      duration: eng.rand(0.6, 1.1),
      ease: "power2.inOut",
      delay: eng.rand(0, 0.3),
    });
  });
}

export async function acquireCursor(
  eng: Engine,
  exclude: Cursor[] = [],
  token?: number,
  reviewGen?: number,
): Promise<Cursor> {
  if (
    !eng.cursorBusyCounts ||
    eng.cursorBusyCounts.length !== eng.cursors.length
  ) {
    eng.cursorBusyCounts = eng.cursors.map(() => 0);
  }
  if (!eng.cursorWaiters) eng.cursorWaiters = [];
  const excluded = new Set(exclude);

  while (true) {
    if (token !== undefined && token !== eng.buildToken) {
      throw new Error("aborted");
    }
    if (reviewGen !== undefined && reviewGen !== eng.reviewGen) {
      throw new Error("review-cancelled");
    }

    let idx = eng.cursors.findIndex(
      (c, i) => !excluded.has(c) && (eng.cursorBusyCounts[i] || 0) === 0,
    );
    if (idx === -1) {
      idx = eng.cursors.findIndex(
        (_c, i) => (eng.cursorBusyCounts[i] || 0) === 0,
      );
    }
    if (idx >= 0) {
      eng.cursorBusyCounts[idx] = (eng.cursorBusyCounts[idx] || 0) + 1;
      return eng.cursors[idx];
    }

    await new Promise<void>((resolve) => {
      let settled = false;
      let timer: ReturnType<typeof setTimeout> | null = null;
      const settle = () => {
        if (settled) return;
        settled = true;
        if (timer !== null) clearTimeout(timer);
        const i = eng.cursorWaiters.indexOf(settle);
        if (i >= 0) eng.cursorWaiters.splice(i, 1);
        resolve();
      };
      eng.cursorWaiters.push(settle);
      timer = setTimeout(settle, 16);
    });
  }
}

export function releaseCursor(eng: Engine, cursor: Cursor): void {
  const idx = eng.cursors.indexOf(cursor);
  if (idx >= 0 && eng.cursorBusyCounts[idx] > 0) {
    eng.cursorBusyCounts[idx]--;
  }
  if (eng.cursorWaiters && eng.cursorWaiters.length) {
    const w = eng.cursorWaiters.shift();
    if (w) {
      try {
        w();
      } catch (e) {}
    }
  }
}

export function stopAllFrameTrackers(eng: Engine): void {
  eng.frameTrackers.forEach((stop) => {
    try {
      stop();
    } catch (e) {}
  });
  eng.frameTrackers.clear();
}

export function clearFrames(eng: Engine): void {
  stopAllFrameTrackers(eng);
  document
    .querySelectorAll(".editor-frame, .target-box")
    .forEach((f) => f.remove());
}

export function cleanupFlags(): void {
  document.querySelectorAll(".flag-suggestion").forEach((span) => {
    const s = span as HTMLElement;
    s.classList.remove("flag-suggestion");
    s.style.textDecoration = "";
    s.style.color = "";
    s.style.opacity = "";
    s.style.transition = "";
  });
}

export function pinFrameToElement(
  eng: Engine,
  frame: HTMLElement,
  el: HTMLElement,
  offsetX: number,
  offsetY: number,
): () => void {
  let stopped = false;
  let lastLeft = -1;
  let lastTop = -1;
  const tick = () => {
    if (stopped) return;
    if (!frame.isConnected || !el.isConnected) {
      stopped = true;
      eng.frameTrackers.delete(stopFn);
      return;
    }
    const r = el.getBoundingClientRect();
    const left = Math.round(r.left + offsetX);
    const top = Math.round(r.top + offsetY);
    if (left !== lastLeft || top !== lastTop) {
      frame.style.left = left + "px";
      frame.style.top = top + "px";
      lastLeft = left;
      lastTop = top;
    }
    requestAnimationFrame(tick);
  };
  const stopFn = () => {
    stopped = true;
  };
  eng.frameTrackers.add(stopFn);
  requestAnimationFrame(tick);
  return stopFn;
}

export function setAgentsIdle(eng: Engine, idle: boolean): void {
  const layer = document.getElementById("agent-layer");
  if (!layer) return;
  layer.classList.toggle("agents-idle", idle);
  void eng;
}

export function clearFx(): void {
  const fx = document.getElementById("fx-layer");
  if (fx) fx.innerHTML = "";
}

export function syncHeroState(eng: Engine): void {
  const hero = document.getElementById("hero");
  if (!hero) return;
  hero.classList.toggle("s1", !!eng.titleRevealed);
  hero.classList.toggle("s2", !!eng.bgRevealed);
}

function baseReveal(eng: Engine, el: HTMLElement): void {
  const saved = eng.savedHTML.get(el);
  if (saved != null) {
    el.innerHTML = saved;
    eng.savedHTML.delete(el);
  }
  el.classList.remove("is-typing", "pre-build", "pre-build-y", "no-transition");
  el.style.minHeight = "";
  el.style.opacity = "1";
  el.style.filter = "none";
  el.style.transform = "translateY(0)";
}

export function instantReveal(eng: Engine, el: HTMLElement): void {
  baseReveal(eng, el);
  el.dataset.animated = "instant";
  if (window.__cursorBuilds) window.__cursorBuilds.instant++;
}

export function preemptedReveal(eng: Engine, el: HTMLElement): void {
  baseReveal(eng, el);
  el.dataset.animated = "preempted";
  if (window.__cursorBuilds) window.__cursorBuilds.preempted++;
}

export function fastReveal(eng: Engine, el: HTMLElement): void {
  const saved = eng.savedHTML.get(el);
  if (saved != null) {
    el.innerHTML = saved;
    eng.savedHTML.delete(el);
  }
  el.classList.remove("is-typing", "pre-build", "pre-build-y", "no-transition");
  el.style.minHeight = "";
  el.dataset.animated = "fast";
  if (window.__cursorBuilds) window.__cursorBuilds.fast++;
  gsap.to(el, {
    opacity: 1,
    y: 0,
    filter: "none",
    duration: eng.rand(0.15, 0.25),
    ease: "power2.out",
  });
}
