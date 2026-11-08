import type { Engine } from "./context";
import { gsapRef as gsap } from "./context";
import * as motion from "./motion";
import * as typing from "./typing";

export function setupQueues(eng: Engine): void {
  const items = Array.from(
    document.querySelectorAll<HTMLElement>("[data-build]"),
  );
  const bySection = new Map<HTMLElement, HTMLElement[]>();

  items.forEach((el) => {
    gsap.set(el, { opacity: 0.06, filter: "grayscale(1) blur(2px)", y: 15 });
    const section = el.closest("section") as HTMLElement | null;
    if (!section) return;
    if (!bySection.has(section)) bySection.set(section, []);
    bySection.get(section)!.push(el);
  });

  bySection.forEach((els, section) => {
    const headerItems: HTMLElement[] = [];
    const cardGroups = new Map<HTMLElement, HTMLElement[]>();
    els.forEach((el) => {
      const card = (el.closest(".card") ||
        el.closest(".border")) as HTMLElement | null;
      if (!card) {
        headerItems.push(el);
        return;
      }
      if (!cardGroups.has(card)) cardGroups.set(card, []);
      cardGroups.get(card)!.push(el);
    });

    const groupList = Array.from(cardGroups.values());
    const maxLen = Math.max(0, ...groupList.map((g) => g.length));
    const interleaved: HTMLElement[] = [...headerItems];
    for (let i = 0; i < maxLen; i++) {
      groupList.forEach((g) => {
        if (g[i]) interleaved.push(g[i]);
      });
    }
    eng.queues.set(section, interleaved);
  });
}

export async function buildSection(
  eng: Engine,
  section: HTMLElement | null,
): Promise<void> {
  if (!section) return;
  if (eng.builtSections.has(section)) return;
  eng.builtSections.add(section);

  const myToken = eng.buildToken;
  const queue = [...(eng.queues.get(section) || [])];
  if (!queue.length) {
    motion.setAgentsIdle(eng, true);
    return;
  }

  eng.sectionDeadline = Date.now() + 120000;
  eng.sectionReviewLimit = 2;
  eng.sectionReviewsDone = 0;
  eng.fastRevealing = false;

  if (eng.mobile) {
    queue.forEach((el) => {
      motion.instantReveal(eng, el);
      el.dataset.animated = "static-mobile";
    });
    if (window.__cursorBuilds) {
      window.__cursorBuilds.static += queue.length;
      // adjust: instantReveal incremented instant; revert
      window.__cursorBuilds.instant = Math.max(
        0,
        window.__cursorBuilds.instant - queue.length,
      );
    }
    eng.scatterCursors();
    motion.clearFrames(eng);
    motion.stopAllFrameTrackers(eng);
    motion.clearFx();
    motion.cleanupFlags();
    motion.setAgentsIdle(eng, true);
    return;
  }

  const worker = async (workerIdx: number) => {
    await eng.wait(workerIdx * 15 + eng.rand(2, 8));
    if (myToken !== eng.buildToken) return;

    while (queue.length > 0) {
      if (myToken !== eng.buildToken) return;
      const el = queue.shift();
      if (!el) return;

      await eng.wait(eng.rand(5, 15));
      if (myToken !== eng.buildToken) return;

      try {
        if (el.dataset.type === "image") {
          await typing.buildImage(eng, el, myToken, workerIdx);
        } else {
          await typing.buildText(eng, el, myToken, workerIdx);
        }
      } catch (e) {
        motion.instantReveal(eng, el);
      }
      if (myToken !== eng.buildToken) return;

      await eng.wait(eng.rand(10, 30));
    }
  };

  await Promise.all([worker(0), worker(1), worker(2), worker(3)]);

  if (myToken !== eng.buildToken) {
    queue.forEach((el) => motion.instantReveal(eng, el));
    motion.clearFrames(eng);
    motion.stopAllFrameTrackers(eng);
    motion.clearFx();
    motion.cleanupFlags();
    motion.setAgentsIdle(eng, true);
    return;
  }

  eng.reviewQueue = [];
  eng.isReviewing = false;
  motion.clearFrames(eng);
  motion.stopAllFrameTrackers(eng);
  motion.clearFx();
  motion.cleanupFlags();
  motion.setAgentsIdle(eng, true);

  section.querySelectorAll<HTMLElement>("[data-build]").forEach((el) => {
    const opacity = parseFloat(getComputedStyle(el).opacity || "0");
    if (
      el.classList.contains("pre-build") ||
      el.classList.contains("pre-build-y") ||
      el.classList.contains("is-typing") ||
      opacity < 0.9
    ) {
      motion.instantReveal(eng, el);
    }
  });
  await eng.wait(300);

  eng.scatterCursors();
}

export function finishHeroInstantly(eng: Engine): void {
  motion.stopAllFrameTrackers(eng);
  eng.reviewQueue = [];
  eng.isReviewing = false;
  const heroEls = document.querySelectorAll<HTMLElement>("#hero [data-type]");
  heroEls.forEach((el) => {
    const saved = eng.savedHTML.get(el);
    if (saved) {
      el.innerHTML = saved;
      eng.savedHTML.delete(el);
    }
    el.classList.remove("is-typing", "pre-build", "pre-build-y");
    el.style.minHeight = "";
    gsap.set(el, { opacity: 1, filter: "none", y: 0 });
    if (el.hasAttribute("data-build")) {
      el.dataset.animated = "instant";
      if (window.__cursorBuilds) window.__cursorBuilds.instant++;
    }
  });
  eng.titleRevealed = true;
  eng.bgRevealed = true;
  motion.syncHeroState(eng);
  eng.heroDone = true;
  motion.clearFrames(eng);
  motion.stopAllFrameTrackers(eng);
  motion.clearFx();
  motion.cleanupFlags();
  motion.setAgentsIdle(eng, true);
}
