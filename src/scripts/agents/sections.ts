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
  motion.clearFrames(eng);
  motion.stopAllFrameTrackers(eng);
  motion.clearFx();
  motion.setAgentsIdle(eng, false);
  eng.builtSections.add(section);

  const myToken = ++eng.buildToken;
  const queue = [...(eng.queues.get(section) || [])];
  if (!queue.length) {
    motion.setAgentsIdle(eng, true);
    return;
  }

  const budget = eng.mobile ? 3000 : 4500;
  eng.sectionDeadline = Date.now() + budget;
  eng.sectionReviewLimit = 2;
  eng.sectionReviewsDone = 0;
  eng.fastRevealing = false;

  if (eng.mobile) {
    queue.forEach((el) => motion.instantReveal(eng, el));
    eng.scatterCursors();
    motion.clearFrames(eng);
    motion.stopAllFrameTrackers(eng);
    motion.clearFx();
    motion.cleanupFlags();
    motion.setAgentsIdle(eng, true);
    return;
  }

  const revealRemainingFast = () => {
    if (eng.fastRevealing) return;
    eng.fastRevealing = true;
    const els = queue.splice(0);
    els.forEach((el, i) => {
      setTimeout(
        () => {
          if (myToken !== eng.buildToken) return;
          motion.fastReveal(eng, el);
        },
        i * Math.round(eng.rand(40, 80)),
      );
    });
  };

  const worker = async (workerIdx: number) => {
    await eng.wait(workerIdx * 15 + eng.rand(2, 8));
    if (myToken !== eng.buildToken) return;

    while (queue.length > 0) {
      if (myToken !== eng.buildToken) return;
      if (Date.now() > eng.sectionDeadline - 200) {
        revealRemainingFast();
        return;
      }
      const el = queue.shift();
      if (!el) return;

      await eng.wait(eng.rand(5, 15));
      if (myToken !== eng.buildToken) return;
      if (Date.now() > eng.sectionDeadline - 200) {
        motion.fastReveal(eng, el);
        revealRemainingFast();
        return;
      }

      try {
        if (el.dataset.type === "image") {
          await typing.buildImage(eng, el, myToken, workerIdx);
        } else {
          await typing.buildText(eng, el, myToken, workerIdx);
        }
      } catch (e) {}
      if (myToken !== eng.buildToken) return;

      if (Date.now() > eng.sectionDeadline - 200) {
        revealRemainingFast();
        return;
      }
      await eng.wait(eng.rand(10, 30));
    }
  };

  await Promise.all([
    worker(0),
    worker(1),
    worker(2),
    worker(3),
    worker(4),
    worker(5),
    worker(6),
    worker(7),
  ]);

  if (myToken !== eng.buildToken) {
    queue.forEach((el) => motion.instantReveal(eng, el));
    motion.clearFrames(eng);
    motion.stopAllFrameTrackers(eng);
    motion.clearFx();
    motion.cleanupFlags();
    motion.setAgentsIdle(eng, true);
    return;
  }

  if (queue.length > 0) {
    revealRemainingFast();
    await eng.wait(300);
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
      motion.fastReveal(eng, el);
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
