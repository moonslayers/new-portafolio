import type { Engine, Cursor } from "./context";
import { AGENTS, rand as randFn, wait as waitFn } from "./agents";
import * as motion from "./motion";
import * as fx from "./fx";
import * as typing from "./typing";
import * as review from "./review";
import * as sections from "./sections";
import * as navigation from "./navigation";
import * as intro from "./intro";

export class AgentEngine implements Engine {
  agents = AGENTS;
  cursors: Cursor[] = [];
  buildToken = 0;
  savedHTML = new WeakMap<HTMLElement, string>();
  queues = new Map<HTMLElement, HTMLElement[]>();
  builtSections = new WeakSet<HTMLElement>();
  workerRotation = [0, 0, 0, 0];
  workerSpeeds = [
    randFn(0.9, 1.15),
    randFn(0.8, 1.1),
    randFn(1.0, 1.25),
    randFn(0.85, 1.15),
  ];
  reviewQueue: HTMLElement[] = [];
  isReviewing = false;
  usedUpgrades = new Set<string>();
  titleRevealed = false;
  bgRevealed = false;
  heroDone = false;
  activeIdx = 0;
  sections: HTMLElement[] = [];
  isNavigating = false;
  paused = false;
  mobile = false;
  reducedMotion = false;
  sectionDeadline = 0;
  sectionReviewLimit = 2;
  sectionReviewsDone = 0;
  skipIntro = false;
  frameTrackers = new Set<() => void>();

  rand(min: number, max: number): number {
    return randFn(min, max);
  }
  async wait(ms: number): Promise<void> {
    if (this.paused) {
      await new Promise<void>((resolve) => {
        const check = () => {
          if (!this.paused) resolve();
          else setTimeout(check, 100);
        };
        check();
      });
    }
    await waitFn(ms);
  }

  initCursors(): void {
    motion.initCursors(this);
  }
  flyTo(cursor: Cursor, x: number, y: number, dur: number): Promise<void> {
    return motion.flyTo(this, cursor, x, y, dur);
  }
  click(cursor: Cursor): Promise<void> {
    return motion.click(this, cursor);
  }
  pulse(x: number, y: number, color: string): void {
    fx.pulse(this, x, y, color);
  }
  reviewPulse(x: number, y: number): void {
    fx.reviewPulse(this, x, y);
  }
  flagPulse(x: number, y: number): void {
    fx.flagPulse(this, x, y);
  }
  scatterCursors(): void {
    motion.scatterCursors(this);
  }
  stopAllFrameTrackers(): void {
    motion.stopAllFrameTrackers(this);
  }
  clearFrames(): void {
    motion.clearFrames(this);
  }
  cleanupFlags(): void {
    motion.cleanupFlags();
  }
  pinFrameToElement(
    frame: HTMLElement,
    el: HTMLElement,
    offsetX: number,
    offsetY: number,
  ): () => void {
    return motion.pinFrameToElement(this, frame, el, offsetX, offsetY);
  }
  instantReveal(el: HTMLElement): void {
    motion.instantReveal(this, el);
  }
  finishHeroInstantly(): void {
    sections.finishHeroInstantly(this);
  }
  goTo(idx: number): void {
    navigation.goTo(this, idx);
  }
  waitForScrollEnd(cb: () => void): void {
    navigation.waitForScrollEnd(this, cb);
  }
  setupNavigation(): void {
    navigation.setupNavigation(this);
  }
  onKey(e: KeyboardEvent): void {
    navigation.onKey(e);
  }
  setupQueues(): void {
    sections.setupQueues(this);
  }
  buildSection(section: HTMLElement | null): Promise<void> {
    return sections.buildSection(this, section);
  }
  buildText(el: HTMLElement, token: number, workerIdx: number): Promise<void> {
    return typing.buildText(this, el, token, workerIdx);
  }
  buildImage(el: HTMLElement, token: number, workerIdx: number): Promise<void> {
    return typing.buildImage(this, el, token, workerIdx);
  }
  processReviewQueue(token: number): Promise<void> {
    return review.processReviewQueue(this, token);
  }
  findUpgradeFor(el: HTMLElement): { find: string; to: string } | null {
    return review.findUpgradeFor(this, el);
  }
  highlightPhrase(el: HTMLElement, phrase: string): HTMLElement | null {
    return review.highlightPhrase(el, phrase);
  }
  flagAndFix(
    el: HTMLElement,
    upgrade: { find: string; to: string },
    flaggingCursor: Cursor,
    token: number,
  ): Promise<void> {
    return review.flagAndFix(this, el, upgrade, flaggingCursor, token);
  }
  upgradeSpan(
    span: HTMLElement,
    newText: string,
    token: number,
  ): Promise<void> {
    return review.upgradeSpan(this, span, newText, token);
  }
  heroBgClick(workerIdx: number): Promise<void> {
    return intro.heroBgClick(this, workerIdx);
  }
  runIntro(): Promise<void> {
    return intro.runIntro(this);
  }
  getWorkerCursors(workerIdx: number, count: number): Cursor[] {
    return motion.getWorkerCursors(this, workerIdx, count);
  }
}

let engineInstance: AgentEngine | null = null;

export function initAgents(): void {
  if (engineInstance) return;
  if (typeof window === "undefined") return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 768px)").matches;

  // add js class for progressive enhancement
  document.documentElement.classList.add("js");

  const engine = new AgentEngine();
  engine.reducedMotion = reduced;
  engine.mobile = mobile;
  engineInstance = engine;

  if (reduced) {
    // reveal all content statically
    document.querySelectorAll<HTMLElement>("[data-build]").forEach((el) => {
      el.classList.remove("pre-build", "pre-build-y");
      el.style.opacity = "1";
      el.style.filter = "none";
      el.style.transform = "translateY(0)";
    });
    engine.titleRevealed = true;
    engine.bgRevealed = true;
    motion.syncHeroState(engine);
    engine.heroDone = true;
    // hide agent layer
    const layer = document.getElementById("agent-layer");
    if (layer) layer.style.display = "none";
    const fx = document.getElementById("fx-layer");
    if (fx) fx.style.display = "none";
    return;
  }

  // skip intro if sessionStorage or data-skip-intro
  try {
    if (sessionStorage.getItem("skipIntro") === "1") engine.skipIntro = true;
  } catch (e) {}
  if (
    document.querySelector("[data-skip-intro]") ||
    document.documentElement.hasAttribute("data-skip-intro")
  ) {
    engine.skipIntro = true;
  }

  engine.initCursors();
  engine.setupQueues();
  engine.setupNavigation();

  let introTimer: ReturnType<typeof setTimeout> | null = null;
  const skipBtn = document.getElementById("skip-intro");
  const skipHandler = () => {
    engine.buildToken++;
    engine.reviewQueue = [];
    engine.isReviewing = false;
    motion.clearFrames(engine);
    motion.clearFx();
    motion.cleanupFlags();
    sections.finishHeroInstantly(engine);
    try {
      sessionStorage.setItem("skipIntro", "1");
    } catch (e) {}
    if (skipBtn) skipBtn.hidden = true;
  };
  if (skipBtn) {
    skipBtn.addEventListener("click", skipHandler);
  }

  // Escape key handled in navigation.onKey already calls skip button click

  const onVisibility = () => {
    if (document.hidden) {
      engine.paused = true;
      motion.stopAllFrameTrackers(engine);
      motion.clearFrames(engine);
      motion.clearFx();
      motion.cleanupFlags();
    } else {
      engine.paused = false;
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  let sectionObserver: IntersectionObserver | null = null;
  if ("IntersectionObserver" in window) {
    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target as HTMLElement;
            if (section.id === "hero") return;
            engine.buildSection(section).catch(() => {});
          }
        });
      },
      { threshold: 0.5, rootMargin: "-8% 0px -8% 0px" },
    );
    engine.sections.forEach((s) => {
      if (s.id !== "hero") sectionObserver!.observe(s);
    });
  }

  const hideSkip = () => {
    if (skipBtn) skipBtn.hidden = true;
  };
  if (engine.skipIntro) {
    sections.finishHeroInstantly(engine);
    engine.heroDone = true;
    hideSkip();
  } else {
    if (skipBtn) skipBtn.hidden = false;
    introTimer = setTimeout(() => {
      engine
        .runIntro()
        .then(() => {
          engine.heroDone = true;
          hideSkip();
        })
        .catch(() => {
          hideSkip();
        });
    }, 0);
  }

  // dispose on unload/hide
  const dispose = () => {
    try {
      if (introTimer) clearTimeout(introTimer);
    } catch (e) {}
    introTimer = null;
    try {
      sectionObserver?.disconnect();
    } catch (e) {}
    try {
      skipBtn?.removeEventListener("click", skipHandler);
    } catch (e) {}
    try {
      document.removeEventListener("visibilitychange", onVisibility);
    } catch (e) {}
    try {
      navigation.cleanupNavigation(engine);
    } catch (e) {}
    motion.stopAllFrameTrackers(engine);
    motion.clearFrames(engine);
    motion.clearFx();
    motion.cleanupFlags();
  };
  window.addEventListener("pagehide", dispose);
  window.addEventListener("beforeunload", dispose);

  // initial active section build for hero handled by intro; for current viewport maybe
}

export { AgentEngine as default };
