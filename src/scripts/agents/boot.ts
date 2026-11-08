export function bootReset(): void {
  try {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  } catch {}

  const forceTop = (): void => {
    try {
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      html.style.scrollBehavior = prev;
    } catch {}
  };

  forceTop();

  let reload = false;
  try {
    const entries = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    if (entries && entries.length > 0) {
      reload = entries[0].type === "reload";
    } else {
      const nav = (
        performance as Performance & { navigation?: { type: number } }
      ).navigation;
      if (nav) {
        reload = nav.type === 1;
      }
    }
  } catch {
    reload = false;
  }

  if (reload) {
    try {
      sessionStorage.removeItem("skipIntro");
    } catch {}
  }

  window.addEventListener("pageshow", (event: PageTransitionEvent) => {
    if (event.persisted) {
      forceTop();
    }
  });
}
