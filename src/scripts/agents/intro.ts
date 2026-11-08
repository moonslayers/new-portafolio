import type { Engine, Cursor } from "./context";
import { gsapRef as gsap } from "./context";
import * as motion from "./motion";
import * as typing from "./typing";
import * as sections from "./sections";
import * as fx from "./fx";

export async function heroBgClick(
  eng: Engine,
  _workerIdx: number,
  token?: number,
): Promise<void> {
  let cursor: Cursor;
  try {
    cursor = await eng.acquireCursor([], token);
  } catch (e) {
    return;
  }
  try {
    const kicker = document.querySelector<HTMLElement>(".hero-kicker");
    let x: number;
    let y: number;
    if (kicker) {
      const r = kicker.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
    } else {
      x = window.innerWidth * eng.rand(0.12, 0.24);
      y = window.innerHeight * eng.rand(0.14, 0.26);
    }
    await motion.flyTo(eng, cursor, x, y, eng.rand(0.2, 0.35));
    await motion.click(eng, cursor);
    fx.pulse(eng, x, y, cursor.color);
    eng.bgRevealed = true;
    motion.syncHeroState(eng);
  } finally {
    eng.releaseCursor(cursor);
  }
}

export async function runIntro(eng: Engine): Promise<void> {
  motion.setAgentsIdle(eng, false);
  await eng.wait(150);

  eng.cursors.forEach((c, i) => {
    gsap.to(c.el, {
      opacity: 1,
      duration: eng.rand(0.35, 0.6),
      delay: i * 0.05 + eng.rand(0, 0.35),
    });
  });

  await eng.wait(350);

  const btnWork = document.querySelector<HTMLAnchorElement>(
    '#hero-cta a[href="#work"]',
  );
  const btnContact = document.querySelector<HTMLAnchorElement>(
    '#hero-cta a[href="#contact"]',
  );
  const badges = Array.from(
    document.querySelectorAll<HTMLElement>('#hero-badges [data-type="badge"]'),
  );

  const queue: { kind: string; el: HTMLElement | null }[] = [
    { kind: "bg", el: null },
    { kind: "text", el: document.querySelector<HTMLElement>(".hero-kicker") },
    { kind: "text", el: document.querySelector<HTMLElement>("#hero-title") },
    { kind: "text", el: document.querySelector<HTMLElement>("#hero-sub") },
    { kind: "text", el: btnWork },
    { kind: "text", el: btnContact },
    ...badges.map((el) => ({ kind: "text", el })),
    {
      kind: "text",
      el: document.querySelector<HTMLElement>("#hero-scroll [data-build]"),
    },
  ];

  const myToken = ++eng.buildToken;

  eng.sectionDeadline = Date.now() + 120000;
  eng.sectionReviewLimit = 1;
  eng.sectionReviewsDone = 0;
  eng.fastRevealing = false;

  const worker = async (workerIdx: number) => {
    await eng.wait(workerIdx * 30 + eng.rand(10, 40));
    if (myToken !== eng.buildToken) return;

    while (queue.length > 0) {
      if (myToken !== eng.buildToken) return;
      const item = queue.shift();
      if (!item) return;

      await eng.wait(eng.rand(20, 80));
      if (myToken !== eng.buildToken) return;

      try {
        if (item.kind === "bg") await heroBgClick(eng, workerIdx, myToken);
        else if (item.el)
          await typing.buildText(eng, item.el, myToken, workerIdx);
      } catch (e) {
        if (item.el) motion.instantReveal(eng, item.el);
        if (item.kind === "bg") {
          eng.bgRevealed = true;
          motion.syncHeroState(eng);
        }
      }
      if (myToken !== eng.buildToken) return;

      await eng.wait(eng.rand(60, 180));
    }
  };

  const laneCount = Math.min(eng.cursors.length, queue.length);
  await Promise.all(Array.from({ length: laneCount }, (_, i) => worker(i)));

  if (myToken !== eng.buildToken) {
    sections.finishHeroInstantly(eng);
    return;
  }

  eng.reviewQueue = [];
  eng.isReviewing = false;
  motion.clearFx();
  motion.cleanupFlags();

  document
    .querySelectorAll<HTMLElement>("#hero [data-build], #hero [data-type]")
    .forEach((el) => {
      const opacity = parseFloat(getComputedStyle(el).opacity || "0");
      if (opacity < 0.9) motion.instantReveal(eng, el);
    });
  await eng.wait(300);

  eng.titleRevealed = true;
  eng.bgRevealed = true;
  motion.syncHeroState(eng);
  motion.setAgentsIdle(eng, true);
  eng.heroDone = true;
}
