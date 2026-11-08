import type { Engine, Cursor } from "./context";
import * as motion from "./motion";
import * as fx from "./fx";
import { COPY_UPGRADES } from "./agents";

function lang(): string {
  const l = (document.documentElement.lang || "es").toLowerCase();
  return l.startsWith("en") ? "en" : "es";
}

export async function processReviewQueue(
  eng: Engine,
  token: number,
): Promise<void> {
  if (eng.isReviewing) return;
  eng.isReviewing = true;

  while (eng.reviewQueue.length > 0) {
    if (token !== eng.buildToken || Date.now() > eng.sectionDeadline) {
      eng.reviewQueue = [];
      break;
    }
    const el = eng.reviewQueue.shift();
    if (!el || !el.isConnected) continue;

    await eng.wait(eng.rand(100, 250));
    if (token !== eng.buildToken || Date.now() > eng.sectionDeadline) {
      eng.reviewQueue = [];
      break;
    }

    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) continue;

    const upgrade = findUpgradeFor(eng, el);
    const willFlag = !!upgrade && Math.random() < 0.6;

    const reviewCursor = Math.random() > 0.5 ? eng.cursors[4] : eng.cursors[11];

    if (willFlag && upgrade) {
      await flagAndFix(eng, el, upgrade, reviewCursor, token);
    } else {
      const rx = rect.left + rect.width * eng.rand(0.2, 0.8);
      const ry = rect.top + rect.height * eng.rand(0.2, 0.8);
      await motion.flyTo(eng, reviewCursor, rx, ry, eng.rand(0.2, 0.35));
      if (token !== eng.buildToken || Date.now() > eng.sectionDeadline) break;
      await motion.click(eng, reviewCursor);
      fx.reviewPulse(eng, rx, ry);
      el.classList.add("reviewed");
      setTimeout(() => el.classList.remove("reviewed"), 800);
    }

    await eng.wait(eng.rand(60, 150));
  }
  eng.isReviewing = false;

  if (
    eng.reviewQueue.length > 0 &&
    token === eng.buildToken &&
    Date.now() < eng.sectionDeadline
  ) {
    processReviewQueue(eng, token).catch(() => {});
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

  // Fallback seguro: usa una frase existente en el DOM y retipea el mismo texto.
  const text = (el.innerText || "").replace(/\s+/g, " ").trim();
  if (text.length < 8) return null;
  const words = text.split(" ");
  const phrase =
    words.length >= 3 ? words.slice(0, 3).join(" ") : text.slice(0, 40);
  if (phrase.length < 4) return null;
  // Evita repetir la misma frase ya revisada.
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
      } catch (e) {
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
): Promise<void> {
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

  await motion.flyTo(eng, flaggingCursor, flagX, flagY, eng.rand(0.34, 0.5));
  if (token !== eng.buildToken) {
    span.textContent = upgrade.to;
    span.classList.remove("flag-suggestion");
    return;
  }
  await motion.click(eng, flaggingCursor);
  fx.flagPulse(eng, flagX, flagY);

  await eng.wait(eng.rand(200, 300));
  if (token !== eng.buildToken) {
    span.textContent = upgrade.to;
    span.classList.remove("flag-suggestion");
    return;
  }

  const fixCursor = Math.random() > 0.5 ? eng.cursors[10] : eng.cursors[8];
  const sr2 = span.getBoundingClientRect();
  const fixX = sr2.left + sr2.width * 0.5;
  const fixY = sr2.top + sr2.height * 0.5;

  await motion.flyTo(eng, fixCursor, fixX, fixY, eng.rand(0.36, 0.52));
  if (token !== eng.buildToken) {
    span.textContent = upgrade.to;
    span.classList.remove("flag-suggestion");
    return;
  }
  await motion.click(eng, fixCursor);

  await upgradeSpan(eng, span, upgrade.to, token);

  const sr3 = span.getBoundingClientRect();
  fx.reviewPulse(eng, sr3.left + sr3.width * 0.5, sr3.top + sr3.height * 0.5);
  el.classList.add("reviewed");
  setTimeout(() => el.classList.remove("reviewed"), 800);

  await eng.wait(150);
  if (span.isConnected) {
    span.classList.remove("flag-suggestion");
  }
}

export async function upgradeSpan(
  eng: Engine,
  span: HTMLElement,
  newText: string,
  token: number,
): Promise<void> {
  span.style.transition = "none";
  span.style.textDecoration = "line-through";
  span.style.color = "#D9A05B";
  span.style.opacity = "0.7";

  await eng.wait(120);

  span.textContent = "";
  span.style.textDecoration = "none";
  span.style.color = "#2E5A44";
  span.style.opacity = "1";

  for (let i = 0; i < newText.length; i++) {
    if (token !== eng.buildToken) {
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
