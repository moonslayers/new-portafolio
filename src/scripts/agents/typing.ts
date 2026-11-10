import type { Engine, Cursor } from "./context";
import { gsapRef as gsap } from "./context";
import * as motion from "./motion";
import * as fx from "./fx";
import { TIMING } from "./agents";

function isAbandoned(eng: Engine, el: HTMLElement): boolean {
  if (eng.mobile || eng.reducedMotion) return false;
  const sec = el.closest("section") as HTMLElement | null;
  return !!sec && eng.abandonedSections.has(sec);
}

function clampIdleTarget(
  rect: DOMRect,
  offsetX = 0,
  offsetY = 0,
): { tx: number; ty: number } {
  return {
    tx: Math.max(
      28,
      Math.min(rect.right + 4 + offsetX, window.innerWidth - 28),
    ),
    ty: Math.max(40, Math.min(rect.top + 6 + offsetY, window.innerHeight - 40)),
  };
}

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
  if (isAbandoned(eng, el)) {
    el.classList.remove("pre-build", "pre-build-y");
    el.style.opacity = "1";
    el.style.filter = "none";
    const img0 = el.querySelector("img");
    if (img0) {
      gsap.fromTo(
        img0,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
      );
    }
    await eng.wait(1);
    if (token !== eng.buildToken) {
      motion.instantReveal(eng, el);
      return;
    }
    el.dataset.animated = "image-2";
    if (window.__cursorBuilds) window.__cursorBuilds.image2++;
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
    if (isAbandoned(eng, el)) {
      if (openC) eng.releaseCursor(openC);
      held = null;
      el.classList.remove("pre-build", "pre-build-y");
      el.style.opacity = "1";
      el.style.filter = "none";
      const img1 = el.querySelector("img");
      if (img1) {
        gsap.fromTo(
          img1,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
        );
      }
      await eng.wait(1);
      if (token !== eng.buildToken) {
        motion.instantReveal(eng, el);
        return;
      }
      el.dataset.animated = "image-2";
      if (window.__cursorBuilds) window.__cursorBuilds.image2++;
      return;
    }
    held = openC;
    const rect = el.getBoundingClientRect();
    const { tx, ty } = clampIdleTarget(rect);
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
    if (isAbandoned(eng, el)) {
      el.classList.remove("pre-build", "pre-build-y");
      el.style.opacity = "1";
      el.style.filter = "none";
      const img2 = el.querySelector("img");
      if (img2) {
        gsap.fromTo(
          img2,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
        );
      }
      await eng.wait(1);
      if (token !== eng.buildToken) {
        motion.instantReveal(eng, el);
        return;
      }
      el.dataset.animated = "image-2";
      if (window.__cursorBuilds) window.__cursorBuilds.image2++;
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
    if (isAbandoned(eng, el)) {
      if (confirmC) eng.releaseCursor(confirmC);
      el.classList.remove("pre-build", "pre-build-y");
      el.style.opacity = "1";
      el.style.filter = "none";
      const img3 = el.querySelector("img");
      if (img3) {
        gsap.fromTo(
          img3,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
        );
      }
      await eng.wait(1);
      if (token !== eng.buildToken) {
        motion.instantReveal(eng, el);
        return;
      }
      el.dataset.animated = "image-2";
      if (window.__cursorBuilds) window.__cursorBuilds.image2++;
      return;
    }
    held = confirmC;
    const imgTx = Math.max(
      28,
      Math.min(tx + eng.rand(0, 16), window.innerWidth - 28),
    );
    const imgTy = Math.max(
      40,
      Math.min(ty + eng.rand(-8, 8), window.innerHeight - 40),
    );
    await motion.flyTo(eng, held, imgTx, imgTy, eng.rand(0.2, 0.35));
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
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
      );
    }
    await eng.wait(isAbandoned(eng, el) ? 1 : eng.rand(80, 200));
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
  const finalizeText = async () => {
    el.classList.remove("is-typing");
    el.style.minHeight = "";
    el.innerHTML = originalHTML;
    eng.savedHTML.delete(el);
    if (el.id === "hero-title") {
      eng.titleRevealed = true;
      motion.syncHeroState(eng);
    }
    if (
      !isAbandoned(eng, el) &&
      eng.sectionReviewsDone < eng.sectionReviewLimit
    ) {
      eng.sectionReviewsDone++;
      eng.reviewQueue.push(el);
      eng.processReviewQueue(token).catch(() => {});
    }
    await eng.wait(isAbandoned(eng, el) ? 1 : eng.rand(40, 80));
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
    await eng.wait(isAbandoned(eng, el) ? 1 : eng.rand(30, 60));
    el.dataset.animated = "text-3";
    if (window.__cursorBuilds) window.__cursorBuilds.text3++;
  };
  try {
    if (isAbandoned(eng, el)) {
      cleanupFrame();
      el.classList.remove(
        "pre-build",
        "pre-build-y",
        "is-typing",
        "no-transition",
      );
      el.style.minHeight = "";
      gsap.set(el, { opacity: 1, filter: "none", y: 0 });
      el.innerHTML = originalHTML;
      eng.savedHTML.delete(el);
      if (el.id === "hero-title") {
        eng.titleRevealed = true;
        motion.syncHeroState(eng);
      }
      await eng.wait(1);
      el.dataset.animated = "text-3";
      if (window.__cursorBuilds) window.__cursorBuilds.text3++;
      return;
    }
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
    if (isAbandoned(eng, el)) {
      if (openC) eng.releaseCursor(openC);
      held = null;
      cleanupFrame();
      el.classList.remove(
        "pre-build",
        "pre-build-y",
        "is-typing",
        "no-transition",
      );
      el.style.minHeight = "";
      gsap.set(el, { opacity: 1, filter: "none", y: 0 });
      el.innerHTML = originalHTML;
      eng.savedHTML.delete(el);
      if (el.id === "hero-title") {
        eng.titleRevealed = true;
        motion.syncHeroState(eng);
      }
      await eng.wait(1);
      el.dataset.animated = "text-3";
      if (window.__cursorBuilds) window.__cursorBuilds.text3++;
      return;
    }
    held = openC;
    const rect = el.getBoundingClientRect();
    const { tx, ty } = clampIdleTarget(rect);
    await motion.flyTo(eng, held, tx, ty, flyOpen);
    if (token !== eng.buildToken) {
      releaseHeld();
      abortWithReveal();
      return;
    }
    if (isAbandoned(eng, el)) {
      releaseHeld();
      el.classList.remove("pre-build", "pre-build-y");
      gsap.set(el, { opacity: 1, filter: "none", y: 0 });
      const origH0 = el.offsetHeight;
      el.style.minHeight = origH0 + "px";
      el.classList.add("is-typing");
      el.innerHTML = "";
      const txtSpan0 = document.createElement("span");
      const caret0 = document.createElement("span");
      caret0.className = "type-caret";
      el.appendChild(txtSpan0);
      el.appendChild(caret0);
      txtSpan0.textContent = fullText;
      await eng.wait(1);
      await finalizeText();
      return;
    }
    await motion.click(eng, held);
    fx.pulse(eng, tx, ty, held.color);
    releaseHeld();
    if (token !== eng.buildToken) {
      abortWithReveal();
      return;
    }
    if (isAbandoned(eng, el)) {
      cleanupFrame();
      el.classList.remove(
        "pre-build",
        "pre-build-y",
        "is-typing",
        "no-transition",
      );
      el.style.minHeight = "";
      gsap.set(el, { opacity: 1, filter: "none", y: 0 });
      el.innerHTML = originalHTML;
      eng.savedHTML.delete(el);
      if (el.id === "hero-title") {
        eng.titleRevealed = true;
        motion.syncHeroState(eng);
      }
      await eng.wait(1);
      el.dataset.animated = "text-3";
      if (window.__cursorBuilds) window.__cursorBuilds.text3++;
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
    await eng.wait(isAbandoned(eng, el) ? 1 : Math.max(20, frameHold * 0.7));
    if (token !== eng.buildToken) {
      abortWithReveal();
      return;
    }
    if (isAbandoned(eng, el)) {
      txtSpan.textContent = fullText;
      await finalizeText();
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
    if (isAbandoned(eng, el)) {
      if (typeC) eng.releaseCursor(typeC);
      txtSpan.textContent = fullText;
      await finalizeText();
      return;
    }
    held = typeC;
    const typeTx = Math.max(
      28,
      Math.min(tx + eng.rand(20, 60), window.innerWidth - 28),
    );
    const typeTy = Math.max(
      40,
      Math.min(ty + eng.rand(-8, 18), window.innerHeight - 40),
    );
    await motion.flyTo(eng, held, typeTx, typeTy, flyType);
    if (token !== eng.buildToken) {
      releaseHeld();
      abortWithReveal();
      return;
    }
    if (isAbandoned(eng, el)) {
      txtSpan.textContent = fullText;
      releaseHeld();
      await finalizeText();
      return;
    }
    await eng.wait(isAbandoned(eng, el) ? 1 : eng.rand(5, 20));
    for (let i = 0; i < fullText.length; i++) {
      if (token !== eng.buildToken) {
        releaseHeld();
        abortWithReveal();
        return;
      }
      if (isAbandoned(eng, el)) {
        const nextSpace = fullText.indexOf(" ", i);
        const wordEnd = nextSpace === -1 ? fullText.length : nextSpace;
        for (let k = i; k < wordEnd; k++) {
          txtSpan.textContent = fullText.slice(0, k + 1);
          await eng.wait(1);
        }
        txtSpan.textContent = fullText;
        break;
      }
      txtSpan.textContent = fullText.slice(0, i + 1);
      const delay = i < 25 ? earlySpeed : lateSpeed;
      await eng.wait(delay + eng.rand(0, 3));
    }
    await eng.wait(isAbandoned(eng, el) ? 1 : Math.max(20, preConfirm * 0.7));
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
    if (isAbandoned(eng, el)) {
      await finalizeText();
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
    if (isAbandoned(eng, el)) {
      if (confirmC) eng.releaseCursor(confirmC);
      await finalizeText();
      return;
    }
    held = confirmC;
    const rect2 = el.getBoundingClientRect();
    const { tx: cx, ty: cy } = clampIdleTarget(
      rect2,
      eng.rand(0, 12),
      eng.rand(0, 12),
    );
    await motion.flyTo(eng, held, cx, cy, flyConfirm);
    if (token !== eng.buildToken) {
      releaseHeld();
      abortWithReveal();
      return;
    }
    if (isAbandoned(eng, el)) {
      releaseHeld();
      await finalizeText();
      return;
    }
    await motion.click(eng, held);
    fx.pulse(eng, cx, cy, held.color);
    releaseHeld();
    if (token !== eng.buildToken) {
      abortWithReveal();
      return;
    }
    await finalizeText();
  } catch {
    releaseHeld();
    abortWithReveal();
    return;
  } finally {
    if (held) releaseHeld();
  }
}
