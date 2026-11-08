import type { Engine, Cursor } from "./context";
import { gsapRef as gsap } from "./context";
import * as motion from "./motion";
import * as fx from "./fx";
import { TIMING } from "./agents";

export async function buildImage(
  eng: Engine,
  el: HTMLElement,
  token: number,
  _workerIdx: number,
): Promise<void> {
  if (token !== eng.buildToken) {
    motion.instantReveal(eng, el);
    return;
  }
  let openC: Cursor | null = null;
  let confirmC: Cursor | null = null;
  let held: Cursor | null = null;
  const releaseHeld = () => {
    if (held) {
      eng.releaseCursor(held);
      held = null;
    }
  };
  try {
    try {
      openC = await eng.acquireCursor([], token);
    } catch {
      motion.instantReveal(eng, el);
      return;
    }
    if (token !== eng.buildToken) {
      if (openC) eng.releaseCursor(openC);
      motion.instantReveal(eng, el);
      return;
    }
    held = openC;
    let rect = el.getBoundingClientRect();
    let tx = rect.left + rect.width * 0.5;
    let ty = rect.top + rect.height * 0.5;
    await motion.flyTo(eng, held, tx, ty, eng.rand(0.25, 0.4));
    if (token !== eng.buildToken) {
      releaseHeld();
      motion.instantReveal(eng, el);
      return;
    }
    await motion.click(eng, held);
    fx.pulse(eng, tx, ty, held.color);
    releaseHeld();
    if (token !== eng.buildToken) {
      motion.instantReveal(eng, el);
      return;
    }
    try {
      confirmC = await eng.acquireCursor(openC ? [openC] : [], token);
    } catch {
      motion.instantReveal(eng, el);
      return;
    }
    if (token !== eng.buildToken) {
      if (confirmC) eng.releaseCursor(confirmC);
      motion.instantReveal(eng, el);
      return;
    }
    held = confirmC;
    await motion.flyTo(
      eng,
      held,
      tx + eng.rand(-20, 20),
      ty + eng.rand(-20, 20),
      eng.rand(0.2, 0.35),
    );
    if (token !== eng.buildToken) {
      releaseHeld();
      motion.instantReveal(eng, el);
      return;
    }
    await motion.click(eng, held);
    fx.pulse(eng, tx, ty, held.color);
    releaseHeld();
    if (token !== eng.buildToken) {
      motion.instantReveal(eng, el);
      return;
    }
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
          duration: 0.5,
          ease: "power2.out",
        },
      );
    }
    await eng.wait(eng.rand(80, 200));
    if (token !== eng.buildToken) {
      motion.instantReveal(eng, el);
      return;
    }
    el.dataset.animated = "image-2";
    if (window.__cursorBuilds) window.__cursorBuilds.image2++;
  } catch {
    releaseHeld();
    motion.instantReveal(eng, el);
    return;
  } finally {
    if (held) releaseHeld();
  }
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
  const speed = eng.workerSpeeds[workerIdx % eng.workerSpeeds.length];
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
  let openC: Cursor | null = null;
  let typeC: Cursor | null = null;
  let confirmC: Cursor | null = null;
  let held: Cursor | null = null;
  let frame: HTMLElement | null = null;
  let stopTrack: () => void = () => {};
  const releaseHeld = () => {
    if (held) {
      eng.releaseCursor(held);
      held = null;
    }
  };
  const cleanupFrame = () => {
    try {
      stopTrack();
    } catch {}
    try {
      if (frame) frame.remove();
    } catch {}
  };
  const abortWithReveal = () => {
    cleanupFrame();
    motion.instantReveal(eng, el);
  };
  try {
    try {
      openC = await eng.acquireCursor([], token);
    } catch {
      motion.instantReveal(eng, el);
      return;
    }
    if (token !== eng.buildToken) {
      if (openC) eng.releaseCursor(openC);
      motion.instantReveal(eng, el);
      return;
    }
    held = openC;
    let rect = el.getBoundingClientRect();
    let tx = rect.left + rect.width * 0.5;
    let ty = rect.top + rect.height * 0.5;
    if (rect.height > window.innerHeight * 0.5)
      ty = rect.top + Math.min(rect.height * 0.3, 120);
    if (rect.width > window.innerWidth * 0.85)
      tx = rect.left + Math.min(rect.width * 0.35, window.innerWidth * 0.4);
    tx = Math.max(28, Math.min(tx, window.innerWidth - 28));
    ty = Math.max(40, Math.min(ty, window.innerHeight - 40));
    await motion.flyTo(eng, held, tx, ty, flyOpen);
    if (token !== eng.buildToken) {
      releaseHeld();
      abortWithReveal();
      return;
    }
    await motion.click(eng, held);
    fx.pulse(eng, tx, ty, held.color);
    releaseHeld();
    if (token !== eng.buildToken) {
      abortWithReveal();
      return;
    }
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
    frame.style.setProperty("--c", (openC as Cursor).color);
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
      abortWithReveal();
      return;
    }
    try {
      typeC = await eng.acquireCursor(openC ? [openC] : [], token);
    } catch {
      abortWithReveal();
      return;
    }
    if (token !== eng.buildToken) {
      if (typeC) eng.releaseCursor(typeC);
      abortWithReveal();
      return;
    }
    held = typeC;
    await motion.flyTo(
      eng,
      held,
      tx + eng.rand(20, 60),
      ty + eng.rand(-8, 18),
      flyType,
    );
    if (token !== eng.buildToken) {
      releaseHeld();
      abortWithReveal();
      return;
    }
    await eng.wait(eng.rand(5, 20));
    for (let i = 0; i < fullText.length; i++) {
      if (token !== eng.buildToken) {
        releaseHeld();
        abortWithReveal();
        return;
      }
      txtSpan.textContent = fullText.slice(0, i + 1);
      const delay = i < 25 ? earlySpeed : lateSpeed;
      await eng.wait(delay + eng.rand(0, 3));
    }
    await eng.wait(Math.max(20, preConfirm * 0.7));
    if (token !== eng.buildToken) {
      releaseHeld();
      abortWithReveal();
      return;
    }
    releaseHeld();
    if (token !== eng.buildToken) {
      abortWithReveal();
      return;
    }
    const excludeForConfirm: Cursor[] = [];
    if (openC) excludeForConfirm.push(openC);
    if (typeC) excludeForConfirm.push(typeC);
    try {
      confirmC = await eng.acquireCursor(excludeForConfirm, token);
    } catch {
      abortWithReveal();
      return;
    }
    if (token !== eng.buildToken) {
      if (confirmC) eng.releaseCursor(confirmC);
      abortWithReveal();
      return;
    }
    held = confirmC;
    const rect2 = el.getBoundingClientRect();
    const cx = rect2.left + rect2.width * eng.rand(0.4, 0.6);
    const cy = rect2.top + rect2.height * eng.rand(0.4, 0.6);
    await motion.flyTo(eng, held, cx, cy, flyConfirm);
    if (token !== eng.buildToken) {
      releaseHeld();
      abortWithReveal();
      return;
    }
    await motion.click(eng, held);
    fx.pulse(eng, cx, cy, held.color);
    releaseHeld();
    if (token !== eng.buildToken) {
      abortWithReveal();
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
    if (eng.sectionReviewsDone < eng.sectionReviewLimit) {
      eng.sectionReviewsDone++;
      eng.reviewQueue.push(el);
      eng.processReviewQueue(token).catch(() => {});
    }
    await eng.wait(eng.rand(40, 80));
    try {
      stopTrack();
    } catch {}
    if (frame && frame.isConnected) {
      frame.remove();
    } else if (frame) {
      try {
        frame.remove();
      } catch {}
    }
    await eng.wait(eng.rand(30, 60));
    el.dataset.animated = "text-3";
    if (window.__cursorBuilds) window.__cursorBuilds.text3++;
  } catch {
    releaseHeld();
    abortWithReveal();
    return;
  } finally {
    if (held) releaseHeld();
  }
}
