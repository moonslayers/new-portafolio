import type { Engine } from "./context";
import { gsapRef as gsap } from "./context";
import * as motion from "./motion";
import * as fx from "./fx";
import { TIMING } from "./agents";

const FAST_TYPES = new Set([
  "chip",
  "badge",
  "button",
  "tag",
  "kpi-num",
  "kpi-label",
]);

export async function buildImage(
  eng: Engine,
  el: HTMLElement,
  token: number,
  workerIdx: number,
): Promise<void> {
  if (token !== eng.buildToken) {
    motion.instantReveal(eng, el);
    return;
  }
  const [openC, confirmC] = motion.getWorkerCursors(eng, workerIdx, 2);

  let rect = el.getBoundingClientRect();
  let tx = rect.left + rect.width * 0.5;
  let ty = rect.top + rect.height * 0.5;

  const rush = () => Date.now() > eng.sectionDeadline;

  await motion.flyTo(eng, openC, tx, ty, rush() ? 0.12 : eng.rand(0.25, 0.4));
  if (token !== eng.buildToken) {
    motion.instantReveal(eng, el);
    return;
  }

  await motion.click(eng, openC);
  fx.pulse(eng, tx, ty, openC.color);

  await motion.flyTo(
    eng,
    confirmC,
    tx + eng.rand(-20, 20),
    ty + eng.rand(-20, 20),
    rush() ? 0.1 : eng.rand(0.2, 0.35),
  );
  if (token !== eng.buildToken) {
    motion.instantReveal(eng, el);
    return;
  }

  await motion.click(eng, confirmC);
  fx.pulse(eng, tx, ty, confirmC.color);

  el.classList.remove("pre-build", "pre-build-y");
  el.style.opacity = "1";
  el.style.filter = "none";

  const img = el.querySelector("img");
  if (img) {
    gsap.fromTo(
      img,
      { opacity: 0, scale: 1.05 },
      {
        opacity: 1,
        scale: 1,
        duration: rush() ? 0.2 : 0.5,
        ease: "power2.out",
      },
    );
  }

  await eng.wait(rush() ? 20 : eng.rand(80, 200));
}

export async function buildText(
  eng: Engine,
  el: HTMLElement,
  token: number,
  workerIdx: number,
): Promise<void> {
  if (token !== eng.buildToken) {
    motion.instantReveal(eng, el);
    return;
  }

  const type = el.dataset.type || "body";

  if (Date.now() > eng.sectionDeadline) {
    motion.fastReveal(eng, el);
    return;
  }

  if (FAST_TYPES.has(type)) {
    await eng.wait(eng.rand(10, 40));
    if (token !== eng.buildToken) {
      motion.instantReveal(eng, el);
      return;
    }
    if (Date.now() > eng.sectionDeadline) {
      motion.fastReveal(eng, el);
      return;
    }
    motion.fastReveal(eng, el);
    await eng.wait(eng.rand(20, 40));
    if (
      eng.sectionReviewsDone < eng.sectionReviewLimit &&
      Date.now() < eng.sectionDeadline
    ) {
      eng.sectionReviewsDone++;
      eng.reviewQueue.push(el);
      eng.processReviewQueue(token).catch(() => {});
    }
    return;
  }

  const speed = eng.workerSpeeds[workerIdx % 4];
  const profile = TIMING[type] || TIMING.body;

  const frameHold = eng.rand(profile.hold[0], profile.hold[1]) * speed;
  const preConfirm = eng.rand(profile.pre[0], profile.pre[1]) * speed;
  const earlySpeed = eng.rand(profile.early[0], profile.early[1]) * speed;
  const lateSpeed = eng.rand(profile.late[0], profile.late[1]);
  const flyOpen = eng.rand(0.2, 0.35) * speed;
  const flyType = eng.rand(0.18, 0.32) * speed;
  const flyConfirm = eng.rand(0.16, 0.3) * speed;

  const originalHTML = el.innerHTML;
  eng.savedHTML.set(el, originalHTML);

  let fullText = el.dataset.fulltext
    ? el.dataset.fulltext
    : el.innerText.replace(/\s+/g, " ").trim();

  const [openC, typeC, confirmC] = motion.getWorkerCursors(eng, workerIdx, 3);

  let rect = el.getBoundingClientRect();
  let tx = rect.left + rect.width * 0.5;
  let ty = rect.top + rect.height * 0.5;
  if (rect.height > window.innerHeight * 0.5)
    ty = rect.top + Math.min(rect.height * 0.3, 120);
  if (rect.width > window.innerWidth * 0.85)
    tx = rect.left + Math.min(rect.width * 0.35, window.innerWidth * 0.4);
  tx = Math.max(28, Math.min(tx, window.innerWidth - 28));
  ty = Math.max(40, Math.min(ty, window.innerHeight - 40));

  let frame: HTMLElement | null = null;
  let stopTrack: () => void = () => {};
  const rushComplete = () => {
    stopTrack();
    try {
      if (frame) frame.remove();
    } catch (e) {}
    el.classList.remove("is-typing");
    el.style.minHeight = "";
    el.innerHTML = originalHTML;
    eng.savedHTML.delete(el);
    motion.fastReveal(eng, el);
  };
  const abortToken = () => {
    stopTrack();
    try {
      if (frame) frame.remove();
    } catch (e) {}
    motion.instantReveal(eng, el);
  };

  await motion.flyTo(eng, openC, tx, ty, flyOpen);
  if (token !== eng.buildToken) {
    abortToken();
    return;
  }
  if (Date.now() > eng.sectionDeadline) {
    rushComplete();
    return;
  }
  await motion.click(eng, openC);
  fx.pulse(eng, tx, ty, openC.color);

  el.classList.remove("pre-build", "pre-build-y");
  gsap.set(el, { opacity: 1, filter: "none", y: 0 });

  const origH = el.offsetHeight;
  el.style.minHeight = origH + "px";
  el.classList.add("is-typing");
  el.innerHTML = "";

  const txtSpan = document.createElement("span");
  const caret = document.createElement("span");
  caret.className = "type-caret";
  el.appendChild(txtSpan);
  el.appendChild(caret);

  el.classList.add("no-transition");
  el.classList.remove("is-typing");
  txtSpan.textContent = fullText;
  void txtSpan.offsetHeight;
  const probeRect = txtSpan.getBoundingClientRect();
  const probeElRect = el.getBoundingClientRect();
  txtSpan.textContent = "";
  el.classList.add("is-typing");
  el.classList.remove("no-transition");

  const padLeft = probeRect.left - probeElRect.left;
  const padTop = probeRect.top - probeElRect.top;
  const offsetX = padLeft - 12;
  const offsetY = padTop - 11;
  const frameW = probeRect.width + 24;
  const frameH = probeRect.height + 22;

  const curElRect = el.getBoundingClientRect();
  frame = document.createElement("div");
  frame.className = "editor-frame";
  frame.style.setProperty("--c", openC.color);
  frame.style.left = curElRect.left + offsetX + "px";
  frame.style.top = curElRect.top + offsetY + "px";
  frame.style.width = frameW + "px";
  frame.style.height = frameH + "px";
  frame.innerHTML = '<span class="editor-badge">editing</span>';
  const fxLayer = document.getElementById("fx-layer");
  if (fxLayer && frame) fxLayer.appendChild(frame);

  if (frame) {
    gsap.fromTo(
      frame,
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" },
    );
  }

  stopTrack = motion.pinFrameToElement(eng, frame!, el, offsetX, offsetY);

  await eng.wait(Math.max(20, frameHold * 0.7));
  if (token !== eng.buildToken) {
    abortToken();
    return;
  }
  if (Date.now() > eng.sectionDeadline) {
    rushComplete();
    return;
  }

  await motion.flyTo(
    eng,
    typeC,
    tx + eng.rand(20, 60),
    ty + eng.rand(-8, 18),
    flyType,
  );
  if (token !== eng.buildToken) {
    abortToken();
    return;
  }
  if (Date.now() > eng.sectionDeadline) {
    rushComplete();
    return;
  }
  await eng.wait(eng.rand(5, 20));

  for (let i = 0; i < fullText.length; i++) {
    if (token !== eng.buildToken) {
      abortToken();
      return;
    }
    if (Date.now() > eng.sectionDeadline) {
      // accelerate remaining: finish typing at minimal delay
      const remainingChars = fullText.length - i;
      const remainingTime = Math.max(0, eng.sectionDeadline - Date.now());
      const minDelay =
        remainingChars > 0
          ? Math.max(1, Math.floor(remainingTime / remainingChars))
          : 1;
      for (let j = i; j < fullText.length; j++) {
        if (token !== eng.buildToken) {
          abortToken();
          return;
        }
        txtSpan.textContent = fullText.slice(0, j + 1);
        await eng.wait(Math.min(minDelay, 3));
      }
      // finish
      await eng.wait(eng.rand(20, 40));
      if (token !== eng.buildToken) {
        abortToken();
        return;
      }
      el.classList.remove("is-typing");
      el.style.minHeight = "";
      el.innerHTML = originalHTML;
      eng.savedHTML.delete(el);

      if (el.id === "hero-title") {
        eng.titleRevealed = true;
        motion.syncHeroState(eng);
      }

      if (
        eng.sectionReviewsDone < eng.sectionReviewLimit &&
        Date.now() < eng.sectionDeadline
      ) {
        eng.sectionReviewsDone++;
        eng.reviewQueue.push(el);
        eng.processReviewQueue(token).catch(() => {});
      }

      await eng.wait(eng.rand(40, 80));
      stopTrack();
      if (frame && frame.isConnected) {
        if (frame && frame.isConnected) frame.remove();
      } else if (frame) {
        frame.remove();
      }
      await eng.wait(eng.rand(30, 60));
      return;
    }
    txtSpan.textContent = fullText.slice(0, i + 1);
    const remaining = eng.sectionDeadline - Date.now();
    const charsLeft = fullText.length - i;
    let delay = i < 25 ? earlySpeed : lateSpeed;
    if (remaining < charsLeft * delay + 150) {
      delay = Math.max(1, Math.floor(remaining / Math.max(1, charsLeft)));
    }
    await eng.wait(delay + (remaining > 300 ? eng.rand(0, 3) : 0));
  }

  await eng.wait(Math.max(20, preConfirm * 0.7));
  if (token !== eng.buildToken) {
    abortToken();
    return;
  }
  if (Date.now() > eng.sectionDeadline) {
    rushComplete();
    return;
  }

  const rect2 = el.getBoundingClientRect();
  const cx = rect2.left + rect2.width * eng.rand(0.4, 0.6);
  const cy = rect2.top + rect2.height * eng.rand(0.4, 0.6);
  await motion.flyTo(eng, confirmC, cx, cy, flyConfirm);
  if (token !== eng.buildToken) {
    abortToken();
    return;
  }
  if (Date.now() > eng.sectionDeadline) {
    rushComplete();
    return;
  }
  await motion.click(eng, confirmC);
  fx.pulse(eng, cx, cy, confirmC.color);

  el.classList.remove("is-typing");
  el.style.minHeight = "";
  el.innerHTML = originalHTML;
  eng.savedHTML.delete(el);

  if (el.id === "hero-title") {
    eng.titleRevealed = true;
    motion.syncHeroState(eng);
  }

  if (
    eng.sectionReviewsDone < eng.sectionReviewLimit &&
    Date.now() < eng.sectionDeadline
  ) {
    eng.sectionReviewsDone++;
    eng.reviewQueue.push(el);
    eng.processReviewQueue(token).catch(() => {});
  }

  await eng.wait(eng.rand(40, 80));
  stopTrack();
  if (frame && frame.isConnected) {
    frame.remove();
  } else if (frame) {
    frame.remove();
  }
  await eng.wait(eng.rand(30, 60));
}
