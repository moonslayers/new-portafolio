import type { Engine, Cursor } from "./context";
import * as motion from "./motion";
import * as fx from "./fx";
import { COPY_UPGRADES } from "./agents";

function lang(): string {
  const l = (document.documentElement.lang || "es").toLowerCase();
  return l.startsWith("en") ? "en" : "es";
}

export function cancelReview(eng: Engine): void {
  eng.reviewGen++;
  eng.reviewQueue = [];
  if (eng.cursorWaiters.length) {
    const copy = [...eng.cursorWaiters];
    copy.forEach((w) => {
      try {
        w();
      } catch {}
    });
  }
}

export async function processReviewQueue(
  eng: Engine,
  token: number,
): Promise<void> {
  if (eng.isReviewing) return;
  eng.isReviewing = true;
  const myGen = eng.reviewGen;
  const isCancelled = () => myGen !== eng.reviewGen;
  try {
    while (eng.reviewQueue.length > 0) {
      if (isCancelled()) break;
      if (token !== eng.buildToken || Date.now() > eng.sectionDeadline) {
        eng.reviewQueue = [];
        break;
      }
      const el = eng.reviewQueue.shift();
      if (!el || !el.isConnected) continue;
      await eng.wait(eng.rand(100, 250));
      if (isCancelled()) break;
      if (token !== eng.buildToken || Date.now() > eng.sectionDeadline) {
        eng.reviewQueue = [];
        break;
      }
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
      const upgrade = findUpgradeFor(eng, el);
      const willFlag = !!upgrade && Math.random() < 0.6;
      let reviewCursor: Cursor | null = null;
      try {
        reviewCursor = await eng.acquireCursor([], token, myGen);
      } catch {
        if (isCancelled()) break;
        eng.reviewQueue = [];
        break;
      }
      try {
        if (isCancelled()) break;
        if (willFlag && upgrade) {
          await flagAndFix(eng, el, upgrade, reviewCursor, token, myGen);
        } else {
          const rx = rect.left + rect.width * eng.rand(0.2, 0.8);
          const ry = rect.top + rect.height * eng.rand(0.2, 0.8);
          await motion.flyTo(eng, reviewCursor, rx, ry, eng.rand(0.2, 0.35));
          if (
            isCancelled() ||
            token !== eng.buildToken ||
            Date.now() > eng.sectionDeadline
          )
            break;
          await motion.click(eng, reviewCursor);
          fx.reviewPulse(eng, rx, ry);
          el.classList.add("reviewed");
          setTimeout(() => el.classList.remove("reviewed"), 800);
        }
      } finally {
        if (reviewCursor) eng.releaseCursor(reviewCursor);
      }
      await eng.wait(eng.rand(60, 150));
      if (isCancelled()) break;
    }
  } finally {
    eng.isReviewing = false;
    if (
      !isCancelled() &&
      eng.reviewQueue.length > 0 &&
      token === eng.buildToken &&
      Date.now() < eng.sectionDeadline
    ) {
      processReviewQueue(eng, token).catch(() => {});
    }
  }
}

export function findUpgradeFor(
  eng: Engine,
  el: HTMLElement,
): { find: string; to: string } | null {
  const upgrades = COPY_UPGRADES[lang()] || [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) textNodes.push(n as Text);
  for (const upgrade of upgrades) {
    if (eng.usedUpgrades.has(upgrade.find)) continue;
    for (const node of textNodes) {
      if (node.textContent && node.textContent.indexOf(upgrade.find) !== -1) {
        return upgrade;
      }
    }
  }
  const text = (el.innerText || "").replace(/\s+/g, " ").trim();
  if (text.length < 8) return null;
  const words = text.split(" ");
  const phrase =
    words.length >= 3 ? words.slice(0, 3).join(" ") : text.slice(0, 40);
  if (phrase.length < 4) return null;
  if (eng.usedUpgrades.has(phrase)) return null;
  return { find: phrase, to: phrase };
}

export function highlightPhrase(
  el: HTMLElement,
  phrase: string,
): HTMLElement | null {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const tn = node as Text;
    const idx = tn.textContent ? tn.textContent.indexOf(phrase) : -1;
    if (idx !== -1) {
      const range = document.createRange();
      range.setStart(tn, idx);
      range.setEnd(tn, idx + phrase.length);
      const span = document.createElement("span");
      span.className = "flag-suggestion";
      try {
        range.surroundContents(span);
        return span;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export async function flagAndFix(
  eng: Engine,
  el: HTMLElement,
  upgrade: { find: string; to: string },
  flaggingCursor: Cursor,
  token: number,
  reviewGen?: number,
): Promise<void> {
  const myGen = reviewGen !== undefined ? reviewGen : eng.reviewGen;
  const isCancelled = () => myGen !== eng.reviewGen;
  const span = highlightPhrase(el, upgrade.find);
  if (!span) {
    const r = el.getBoundingClientRect();
    fx.reviewPulse(eng, r.left + r.width * 0.5, r.top + r.height * 0.5);
    return;
  }
  if (upgrade.find !== upgrade.to) eng.usedUpgrades.add(upgrade.find);
  const sr = span.getBoundingClientRect();
  const flagX = sr.left + sr.width * 0.5;
  const flagY = sr.top + sr.height * 0.5;
  try {
    await motion.flyTo(eng, flaggingCursor, flagX, flagY, eng.rand(0.34, 0.5));
    if (isCancelled() || token !== eng.buildToken) {
      span.textContent = upgrade.to;
      span.classList.remove("flag-suggestion");
      span.style.textDecoration = "";
      span.style.color = "";
      span.style.opacity = "";
      return;
    }
    await motion.click(eng, flaggingCursor);
    fx.flagPulse(eng, flagX, flagY);
    await eng.wait(eng.rand(200, 300));
    if (isCancelled() || token !== eng.buildToken) {
      span.textContent = upgrade.to;
      span.classList.remove("flag-suggestion");
      span.style.textDecoration = "";
      span.style.color = "";
      span.style.opacity = "";
      return;
    }
    let fixCursor: Cursor | null = null;
    try {
      fixCursor = await eng.acquireCursor([flaggingCursor], token, myGen);
    } catch {
      if (!isCancelled()) {
        span.textContent = upgrade.to;
        span.classList.remove("flag-suggestion");
      } else {
        span.textContent = upgrade.to;
        span.classList.remove("flag-suggestion");
        span.style.textDecoration = "";
        span.style.color = "";
        span.style.opacity = "";
      }
      return;
    }
    try {
      const sr2 = span.getBoundingClientRect();
      const fixX = sr2.left + sr2.width * 0.5;
      const fixY = sr2.top + sr2.height * 0.5;
      await motion.flyTo(eng, fixCursor, fixX, fixY, eng.rand(0.36, 0.52));
      if (isCancelled() || token !== eng.buildToken) {
        span.textContent = upgrade.to;
        span.classList.remove("flag-suggestion");
        span.style.textDecoration = "";
        span.style.color = "";
        span.style.opacity = "";
        return;
      }
      await motion.click(eng, fixCursor);
      await upgradeSpan(eng, span, upgrade.to, token, myGen);
      if (isCancelled()) {
        span.textContent = upgrade.to;
        span.classList.remove("flag-suggestion");
        span.style.textDecoration = "";
        span.style.color = "";
        span.style.opacity = "";
        return;
      }
      const sr3 = span.getBoundingClientRect();
      fx.reviewPulse(
        eng,
        sr3.left + sr3.width * 0.5,
        sr3.top + sr3.height * 0.5,
      );
      el.classList.add("reviewed");
      setTimeout(() => el.classList.remove("reviewed"), 800);
      await eng.wait(150);
      if (span.isConnected) {
        span.classList.remove("flag-suggestion");
        span.style.textDecoration = "";
        span.style.color = "";
        span.style.opacity = "";
      }
    } finally {
      if (fixCursor) eng.releaseCursor(fixCursor);
    }
  } finally {
    if (isCancelled() && span.isConnected) {
      try {
        span.textContent = upgrade.to;
        span.classList.remove("flag-suggestion");
        span.style.textDecoration = "";
        span.style.color = "";
        span.style.opacity = "";
        span.style.transition = "";
      } catch {}
    }
  }
}

export async function upgradeSpan(
  eng: Engine,
  span: HTMLElement,
  newText: string,
  token: number,
  reviewGen?: number,
): Promise<void> {
  const myGen = reviewGen !== undefined ? reviewGen : eng.reviewGen;
  const isCancelled = () => myGen !== eng.reviewGen;
  span.style.transition = "none";
  span.style.textDecoration = "line-through";
  span.style.color = "#D9A05B";
  span.style.opacity = "0.7";
  await eng.wait(120);
  if (isCancelled()) {
    span.textContent = newText;
    span.classList.remove("flag-suggestion");
    span.style.textDecoration = "";
    span.style.color = "";
    span.style.opacity = "";
    span.style.transition = "";
    return;
  }
  span.textContent = "";
  span.style.textDecoration = "none";
  span.style.color = "#2E5A44";
  span.style.opacity = "1";
  for (let i = 0; i < newText.length; i++) {
    if (isCancelled() || token !== eng.buildToken) {
      span.textContent = newText;
      span.style.transition = "color 0.6s ease";
      span.style.color = "";
      return;
    }
    span.textContent = newText.slice(0, i + 1);
    await eng.wait(eng.rand(2, 4));
  }
  span.style.transition = "color 0.6s ease";
  span.style.color = "";
  await eng.wait(150);
  span.style.transition = "";
}
