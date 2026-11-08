import type { Engine } from "./context";
import { gsapRef as gsap } from "./context";
import * as motion from "./motion";
import * as typing from "./typing";
import * as sections from "./sections";
import * as fx from "./fx";

export async function heroBgClick(
  eng: Engine,
  workerIdx: number,
): Promise<void> {
  const cursor = motion.getWorkerCursors(eng, workerIdx, 1)[0];
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
    { kind: "text", el: document.querySelector<HTMLElement>("#hero-title") },
    { kind: "text", el: document.querySelector<HTMLElement>("#hero-sub") },
    { kind: "text", el: btnWork },
    { kind: "text", el: btnContact },
    ...badges.map((el) => ({ kind: "text", el })),
  ];

  const myToken = ++eng.buildToken;

  eng.sectionDeadline = Date.now() + 7500;
  eng.sectionReviewLimit = 1;
  eng.sectionReviewsDone = 0;

  const worker = async (workerIdx: number) => {
    await eng.wait(workerIdx * 180 + eng.rand(40, 200));
    if (myToken !== eng.buildToken) return;
    if (Date.now() > eng.sectionDeadline) return;

    while (queue.length > 0) {
      if (myToken !== eng.buildToken) return;
      if (Date.now() > eng.sectionDeadline) return;
      const item = queue.shift();
      if (!item) return;

      await eng.wait(eng.rand(20, 100));
      if (myToken !== eng.buildToken) return;
      if (Date.now() > eng.sectionDeadline) return;

      try {
        if (item.kind === "bg") await heroBgClick(eng, workerIdx);
        else if (item.el)
          await typing.buildText(eng, item.el, myToken, workerIdx);
      } catch (e) {}
      if (myToken !== eng.buildToken) return;

      if (Date.now() > eng.sectionDeadline) return;
      await eng.wait(eng.rand(80, 300));
    }
  };

  await Promise.all([worker(0), worker(1), worker(2), worker(3)]);

  if (myToken !== eng.buildToken) {
    sections.finishHeroInstantly(eng);
    return;
  }

  eng.reviewQueue = [];
  eng.isReviewing = false;
  motion.clearFx();
  motion.cleanupFlags();

  if (Date.now() > eng.sectionDeadline) {
    sections.finishHeroInstantly(eng);
    return;
  }

  motion.clearFx();
  motion.cleanupFlags();
  motion.setAgentsIdle(eng, true);
  eng.heroDone = true;
}
