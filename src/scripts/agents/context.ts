import type { AgentDef } from "./agents";
import gsap from "gsap";

export interface Cursor {
  el: HTMLElement;
  color: string;
}

export interface Engine {
  agents: AgentDef[];
  cursors: Cursor[];
  buildToken: number;
  savedHTML: WeakMap<HTMLElement, string>;
  queues: Map<HTMLElement, HTMLElement[]>;
  builtSections: WeakSet<HTMLElement>;
  workerRotation: number[];
  workerSpeeds: number[];
  reviewQueue: HTMLElement[];
  isReviewing: boolean;
  usedUpgrades: Set<string>;
  titleRevealed: boolean;
  bgRevealed: boolean;
  heroDone: boolean;
  activeIdx: number;
  sections: HTMLElement[];
  isNavigating: boolean;
  paused: boolean;
  mobile: boolean;
  reducedMotion: boolean;
  sectionDeadline: number;
  sectionReviewLimit: number;
  sectionReviewsDone: number;
  fastRevealing: boolean;
  skipIntro: boolean;
  frameTrackers: Set<() => void>;

  wait(ms: number): Promise<void>;
  rand(min: number, max: number): number;
  flyTo(cursor: Cursor, x: number, y: number, dur: number): Promise<void>;
  click(cursor: Cursor): Promise<void>;
  pulse(x: number, y: number, color: string): void;
  reviewPulse(x: number, y: number): void;
  flagPulse(x: number, y: number): void;
  scatterCursors(): void;
  stopAllFrameTrackers(): void;
  clearFrames(): void;
  cleanupFlags(): void;
  pinFrameToElement(
    frame: HTMLElement,
    el: HTMLElement,
    offsetX: number,
    offsetY: number,
  ): () => void;
  instantReveal(el: HTMLElement): void;
  fastReveal(el: HTMLElement): void;
  finishHeroInstantly(): void;
  goTo(idx: number): void;
  waitForScrollEnd(cb: () => void): void;
  setupNavigation(): void;
  onKey(e: KeyboardEvent): void;
  setupQueues(): void;
  buildSection(section: HTMLElement | null): Promise<void>;
  buildText(el: HTMLElement, token: number, workerIdx: number): Promise<void>;
  buildImage(el: HTMLElement, token: number, workerIdx: number): Promise<void>;
  processReviewQueue(token: number): Promise<void>;
  findUpgradeFor(el: HTMLElement): { find: string; to: string } | null;
  highlightPhrase(el: HTMLElement, phrase: string): HTMLElement | null;
  flagAndFix(
    el: HTMLElement,
    upgrade: { find: string; to: string },
    flaggingCursor: Cursor,
    token: number,
  ): Promise<void>;
  upgradeSpan(span: HTMLElement, newText: string, token: number): Promise<void>;
  heroBgClick(workerIdx: number): Promise<void>;
  runIntro(): Promise<void>;
  getWorkerCursors(workerIdx: number, count: number): Cursor[];
  initCursors(): void;
}

export const gsapRef = gsap;
