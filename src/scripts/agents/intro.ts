import type { Engine } from "./context";
import gsap from "gsap";
import * as motion from "./motion";
import * as typing from "./typing";
import * as sections from "./sections";
import * as fx from "./fx";

export async function heroBgClick(
  eng: Engine,
  workerIdx: number,
): Promise<void> {
  const cursor = motion.getWorkerCursors(eng, workerIdx, 1)[0];
  const x = window.innerWidth * eng.rand(0.12, 0.24);
  const y = window.innerHeight * eng.rand(0.14, 0.26);
  await motion.flyTo(eng, cursor, x, y, eng.rand(0.3, 0.5));
  await motion.click(eng, cursor);
  fx.pulse(eng, x, y, cursor.color);
  eng.bgRevealed = true;
}

export async function runIntro(eng: Engine): Promise<void> {
  await eng.wait(250);

  eng.cursors.forEach((c, i) => {
    gsap.to(c.el, {
      opacity: 1,
      duration: eng.rand(0.35, 0.6),
      delay: i * 0.05 + eng.rand(0, 0.35),
    });
  });

  await eng.wait(650);

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

  const worker = async (workerIdx: number) => {
    await eng.wait(workerIdx * 340 + eng.rand(50, 420));
    if (myToken !== eng.buildToken) return;

    while (queue.length > 0) {
      if (myToken !== eng.buildToken) return;
      const item = queue.shift();
      if (!item) return;

      await eng.wait(eng.rand(40, 240));
      if (myToken !== eng.buildToken) return;

      try {
        if (item.kind === "bg") await heroBgClick(eng, workerIdx);
        else if (item.el)
          await typing.buildText(eng, item.el, myToken, workerIdx);
      } catch (e) {}
      if (myToken !== eng.buildToken) return;

      await eng.wait(eng.rand(180, 700));
    }
  };

  await Promise.all([worker(0), worker(1), worker(2), worker(3)]);

  if (myToken !== eng.buildToken) {
    sections.finishHeroInstantly(eng);
    return;
  }

  eng.reviewQueue = [];
  let waited = 0;
  while (eng.isReviewing && waited < 3000) {
    await eng.wait(100);
    waited += 100;
  }

  eng.heroDone = true;
}
