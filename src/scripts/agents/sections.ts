import gsap from "gsap";
import type { Engine } from "./context";
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
  eng.builtSections.add(section);

  const myToken = ++eng.buildToken;
  const queue = [...(eng.queues.get(section) || [])];
  if (!queue.length) return;

  if (eng.mobile) {
    queue.forEach((el) => motion.instantReveal(eng, el));
    eng.scatterCursors();
    return;
  }

  const worker = async (workerIdx: number) => {
    await eng.wait(workerIdx * 300 + eng.rand(60, 420));
    if (myToken !== eng.buildToken) return;

    while (queue.length > 0) {
      if (myToken !== eng.buildToken) return;
      const el = queue.shift();
      if (!el) return;

      await eng.wait(eng.rand(40, 240));
      if (myToken !== eng.buildToken) return;

      try {
        if (el.dataset.type === "image") {
          await typing.buildImage(eng, el, myToken, workerIdx);
        } else {
          await typing.buildText(eng, el, myToken, workerIdx);
        }
      } catch (e) {}
      if (myToken !== eng.buildToken) return;

      await eng.wait(eng.rand(200, 700));
    }
  };

  await Promise.all([worker(0), worker(1), worker(2), worker(3)]);

  if (myToken !== eng.buildToken) {
    queue.forEach((el) => motion.instantReveal(eng, el));
    return;
  }

  eng.reviewQueue = [];
  let waited = 0;
  while (eng.isReviewing && waited < 3000) {
    await eng.wait(100);
    waited += 100;
  }

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
  eng.heroDone = true;
  motion.clearFrames(eng);
  motion.cleanupFlags();
}
