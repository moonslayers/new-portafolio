import type { Engine } from "./context";
import { gsapRef as gsap } from "./context";
import * as navigation from "./navigation";

export const EVASION_PARAMS = {
  detectRadius: 130,
  exitRadius: 180,
  minDist: 60,
  maxOffset: 60,
  smoothness: 0.18,
  returnSmoothness: 0.14,
  settleThreshold: 1.5,
  minDelta: 0.01,
  minDistEpsilon: 0.001,
  mouseExpiryMs: 300,
};

interface EvasionState {
  eng: Engine;
  mouse: { x: number; y: number; active: boolean } | null;
  mouseExpiryTimer: ReturnType<typeof setTimeout> | null;
  baseX: number[];
  baseY: number[];
  curX: number[];
  curY: number[];
  evading: boolean[];
  rafId: number | null;
  idleCheckTimer: ReturnType<typeof setTimeout> | null;
  resizeRafId: number | null;
  mouseMoveHandler: (e: MouseEvent) => void;
  mouseOutHandler: (e: MouseEvent) => void;
  docMouseLeaveHandler: () => void;
  blurHandler: () => void;
  resizeHandler: () => void;
}

let state: EvasionState | null = null;

function isGated(eng: Engine): boolean {
  return eng.mobile || eng.reducedMotion;
}

function readPos(
  cursor: { el: HTMLElement },
  fallbackX: number,
  fallbackY: number,
): [number, number] {
  const x = Number(gsap.getProperty(cursor.el, "x"));
  const y = Number(gsap.getProperty(cursor.el, "y"));
  return [Number.isNaN(x) ? fallbackX : x, Number.isNaN(y) ? fallbackY : y];
}

function syncBasesToCurrent(s: EvasionState): void {
  const n = s.eng.cursors.length;
  for (let i = 0; i < n; i++) {
    const cursor = s.eng.cursors[i];
    const [cx, cy] = readPos(cursor, s.curX[i], s.curY[i]);
    s.baseX[i] = cx;
    s.baseY[i] = cy;
    s.curX[i] = cx;
    s.curY[i] = cy;
    s.evading[i] = false;
  }
}

function isPausedCondition(s: EvasionState): boolean {
  const eng = s.eng;
  if (document.hidden) return true;
  if (eng.paused) return true;
  if (eng.buildingSection !== null) return true;
  if (!eng.heroDone) return true;
  if (navigation.isScrollSettling()) return true;
  return false;
}

function scheduleIdleCheck(): void {
  if (!state || state.idleCheckTimer !== null) return;
  state.idleCheckTimer = setTimeout(() => {
    if (!state) return;
    state.idleCheckTimer = null;
    if (isPausedCondition(state)) {
      syncBasesToCurrent(state);
      scheduleIdleCheck();
    } else {
      syncBasesToCurrent(state);
      resumeEvasion();
    }
  }, 120);
}

function processFrame(): void {
  if (!state) return;
  const { eng } = state;
  if (isGated(eng)) return;
  if (isPausedCondition(state)) {
    syncBasesToCurrent(state);
    return;
  }

  const mouse = state.mouse;
  const n = eng.cursors.length;
  for (let i = 0; i < n; i++) {
    const cursor = eng.cursors[i];
    const busy = (eng.cursorBusyCounts[i] || 0) !== 0;
    const tweening = gsap.isTweening(cursor.el);

    const [cxRaw, cyRaw] = readPos(cursor, state.curX[i], state.curY[i]);
    const cx = cxRaw;
    const cy = cyRaw;

    if (busy || tweening) {
      state.baseX[i] = cx;
      state.baseY[i] = cy;
      state.curX[i] = cx;
      state.curY[i] = cy;
      state.evading[i] = false;
      continue;
    }

    const bx = state.baseX[i];
    const by = state.baseY[i];

    let near = false;
    if (mouse && mouse.active) {
      const dBase = Math.hypot(bx - mouse.x, by - mouse.y);
      const threshold = state.evading[i]
        ? EVASION_PARAMS.exitRadius
        : EVASION_PARAMS.detectRadius;
      near = dBase < threshold;
    }

    let targetX = bx;
    let targetY = by;

    if (near && mouse && mouse.active) {
      if (!state.evading[i]) {
        state.evading[i] = true;
      }
      const dx = bx - mouse.x;
      const dy = by - mouse.y;
      const distMB = Math.hypot(dx, dy);
      const ux = distMB > EVASION_PARAMS.minDistEpsilon ? dx / distMB : 1;
      const uy = distMB > EVASION_PARAMS.minDistEpsilon ? dy / distMB : 0;
      const proximity = Math.max(
        0,
        Math.min(1, 1 - distMB / EVASION_PARAMS.detectRadius),
      );
      let t = EVASION_PARAMS.maxOffset * proximity;
      const need = EVASION_PARAMS.minDist - distMB;
      if (need > t) t = Math.min(EVASION_PARAMS.maxOffset, need);
      t = Math.max(0, Math.min(EVASION_PARAMS.maxOffset, t));
      targetX = bx + ux * t;
      targetY = by + uy * t;
    } else {
      if (state.evading[i]) {
        state.evading[i] = false;
      }
      targetX = bx;
      targetY = by;
      const dSettle = Math.hypot(cx - bx, cy - by);
      if (dSettle < EVASION_PARAMS.settleThreshold) {
        state.baseX[i] = cx;
        state.baseY[i] = cy;
      }
    }

    const sm = state.evading[i]
      ? EVASION_PARAMS.smoothness
      : EVASION_PARAMS.returnSmoothness;
    const nx = cx + (targetX - cx) * sm;
    const ny = cy + (targetY - cy) * sm;
    if (
      Math.abs(nx - cx) > EVASION_PARAMS.minDelta ||
      Math.abs(ny - cy) > EVASION_PARAMS.minDelta
    ) {
      gsap.set(cursor.el, { x: nx, y: ny });
    }
    state.curX[i] = nx;
    state.curY[i] = ny;
  }
}

function loop(): void {
  if (!state) return;
  if (isGated(state.eng)) {
    state.rafId = null;
    return;
  }
  if (isPausedCondition(state)) {
    syncBasesToCurrent(state);
    state.rafId = null;
    scheduleIdleCheck();
    return;
  }
  processFrame();
  if (state) state.rafId = requestAnimationFrame(loop);
}

export function setupEvasion(eng: Engine): void {
  if (isGated(eng)) return;
  if (state) return;

  const n = eng.cursors.length;
  const baseX: number[] = [];
  const baseY: number[] = [];
  const curX: number[] = [];
  const curY: number[] = [];
  const evading: boolean[] = [];
  for (let i = 0; i < n; i++) {
    const c = eng.cursors[i];
    const x = Number(gsap.getProperty(c.el, "x"));
    const y = Number(gsap.getProperty(c.el, "y"));
    const ix = Number.isNaN(x) ? window.innerWidth * eng.agents[i].home[0] : x;
    const iy = Number.isNaN(y) ? window.innerHeight * eng.agents[i].home[1] : y;
    baseX.push(ix);
    baseY.push(iy);
    curX.push(ix);
    curY.push(iy);
    evading.push(false);
  }

  const mouseMoveHandler = (e: MouseEvent) => {
    if (!state) return;
    state.mouse = { x: e.clientX, y: e.clientY, active: true };
    if (state.mouseExpiryTimer !== null) {
      clearTimeout(state.mouseExpiryTimer);
    }
    state.mouseExpiryTimer = setTimeout(() => {
      if (state && state.mouse) state.mouse.active = false;
    }, EVASION_PARAMS.mouseExpiryMs);
  };
  const mouseOutHandler = (e: MouseEvent) => {
    if (!state) return;
    if (e.relatedTarget === null) {
      if (state.mouse) state.mouse.active = false;
      if (state.mouseExpiryTimer !== null) {
        clearTimeout(state.mouseExpiryTimer);
        state.mouseExpiryTimer = null;
      }
    }
  };
  const docMouseLeaveHandler = () => {
    if (!state) return;
    if (state.mouse) state.mouse.active = false;
    if (state.mouseExpiryTimer !== null) {
      clearTimeout(state.mouseExpiryTimer);
      state.mouseExpiryTimer = null;
    }
  };
  const blurHandler = () => {
    if (!state) return;
    if (state.mouse) state.mouse.active = false;
    if (state.mouseExpiryTimer !== null) {
      clearTimeout(state.mouseExpiryTimer);
      state.mouseExpiryTimer = null;
    }
  };
  const resizeHandler = () => {
    if (!state) return;
    if (state.resizeRafId !== null) {
      cancelAnimationFrame(state.resizeRafId);
    }
    state.resizeRafId = requestAnimationFrame(() => {
      if (!state) return;
      state.resizeRafId = null;
      const s = state;
      const eng = s.eng;
      const n = eng.cursors.length;
      for (let i = 0; i < n; i++) {
        const cursor = eng.cursors[i];
        const busy = (eng.cursorBusyCounts[i] || 0) !== 0;
        const tweening = gsap.isTweening(cursor.el);
        const [cx, cy] = readPos(cursor, s.curX[i], s.curY[i]);
        let nx = cx;
        let ny = cy;
        if (!busy && !tweening) {
          nx = Math.max(0, Math.min(window.innerWidth, cx));
          ny = Math.max(0, Math.min(window.innerHeight, cy));
        } else {
          nx = Math.max(0, Math.min(window.innerWidth, cx));
          ny = Math.max(0, Math.min(window.innerHeight, cy));
        }
        s.baseX[i] = nx;
        s.baseY[i] = ny;
        s.curX[i] = nx;
        s.curY[i] = ny;
        s.evading[i] = false;
        if (!busy && !tweening) {
          gsap.set(cursor.el, { x: nx, y: ny });
        }
      }
    });
  };

  window.addEventListener("mousemove", mouseMoveHandler);
  window.addEventListener("mouseout", mouseOutHandler);
  document.documentElement.addEventListener("mouseleave", docMouseLeaveHandler);
  window.addEventListener("blur", blurHandler);
  window.addEventListener("resize", resizeHandler);
  window.addEventListener("orientationchange", resizeHandler);

  state = {
    eng,
    mouse: null,
    mouseExpiryTimer: null,
    baseX,
    baseY,
    curX,
    curY,
    evading,
    rafId: null,
    idleCheckTimer: null,
    resizeRafId: null,
    mouseMoveHandler,
    mouseOutHandler,
    docMouseLeaveHandler,
    blurHandler,
    resizeHandler,
  };

  if (isPausedCondition(state)) {
    state.rafId = null;
    scheduleIdleCheck();
  } else {
    state.rafId = requestAnimationFrame(loop);
  }
}

export function pauseEvasion(): void {
  if (!state) return;
  if (state.rafId !== null) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
  if (state.idleCheckTimer !== null) {
    clearTimeout(state.idleCheckTimer);
    state.idleCheckTimer = null;
  }
  if (state.resizeRafId !== null) {
    cancelAnimationFrame(state.resizeRafId);
    state.resizeRafId = null;
  }
  if (state.mouseExpiryTimer !== null) {
    clearTimeout(state.mouseExpiryTimer);
    state.mouseExpiryTimer = null;
  }
  syncBasesToCurrent(state);
}

export function resumeEvasion(): void {
  if (!state) return;
  if (isPausedCondition(state)) {
    syncBasesToCurrent(state);
    if (state.rafId === null && state.idleCheckTimer === null) {
      scheduleIdleCheck();
    }
    return;
  }
  if (state.idleCheckTimer !== null) {
    clearTimeout(state.idleCheckTimer);
    state.idleCheckTimer = null;
  }
  syncBasesToCurrent(state);
  if (state.rafId === null) {
    state.rafId = requestAnimationFrame(loop);
  }
}

export function cleanupEvasion(): void {
  if (!state) return;
  pauseEvasion();
  const s = state;
  window.removeEventListener("mousemove", s.mouseMoveHandler);
  window.removeEventListener("mouseout", s.mouseOutHandler);
  document.documentElement.removeEventListener(
    "mouseleave",
    s.docMouseLeaveHandler,
  );
  window.removeEventListener("blur", s.blurHandler);
  window.removeEventListener("resize", s.resizeHandler);
  window.removeEventListener("orientationchange", s.resizeHandler);
  state = null;
}
