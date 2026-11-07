export interface AgentDef {
  id: string;
  label: string;
  cls: string;
  home: [number, number];
}

export const AGENTS: AgentDef[] = [
  {
    id: "orchestrator",
    label: "Orchestrator",
    cls: "c-orch",
    home: [0.5, 0.46],
  },
  { id: "planner", label: "Planner", cls: "c-plan", home: [0.2, 0.3] },
  { id: "coder", label: "Coder", cls: "c-code", home: [0.78, 0.62] },
  { id: "designer", label: "Designer", cls: "c-des", home: [0.7, 0.2] },
  { id: "reviewer", label: "Reviewer", cls: "c-rev", home: [0.3, 0.76] },
  { id: "tester", label: "Tester", cls: "c-test", home: [0.86, 0.36] },
  { id: "architect", label: "Architect", cls: "c-arch", home: [0.4, 0.18] },
  { id: "devops", label: "DevOps", cls: "c-dev", home: [0.12, 0.55] },
  { id: "scripter", label: "Scripter", cls: "c-script", home: [0.62, 0.8] },
  { id: "debugger", label: "Debugger", cls: "c-debug", home: [0.9, 0.68] },
  { id: "optimizer", label: "Optimizer", cls: "c-opt", home: [0.42, 0.6] },
  { id: "auditor", label: "Auditor", cls: "c-audit", home: [0.08, 0.86] },
];

export interface TimingProfile {
  hold: [number, number];
  pre: [number, number];
  early: [number, number];
  late: [number, number];
}

export const TIMING: Record<string, TimingProfile> = {
  title: { hold: [280, 520], pre: [240, 460], early: [30, 46], late: [7, 12] },
  body: { hold: [200, 380], pre: [200, 380], early: [26, 40], late: [7, 12] },
  tag: { hold: [160, 300], pre: [140, 260], early: [22, 34], late: [6, 11] },
  chip: { hold: [100, 220], pre: [90, 200], early: [16, 28], late: [5, 9] },
  badge: { hold: [100, 220], pre: [90, 200], early: [16, 28], late: [5, 9] },
  "kpi-num": {
    hold: [160, 320],
    pre: [140, 280],
    early: [22, 36],
    late: [6, 11],
  },
  "kpi-label": {
    hold: [160, 320],
    pre: [140, 280],
    early: [22, 36],
    late: [6, 11],
  },
  button: { hold: [180, 340], pre: [160, 300], early: [24, 38], late: [7, 12] },
  image: { hold: [300, 500], pre: [100, 200], early: [10, 20], late: [5, 10] },
};

export interface CopyUpgrade {
  find: string;
  to: string;
}

export const COPY_UPGRADES: Record<string, CopyUpgrade[]> = {
  es: [],
  en: [],
};

export function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
