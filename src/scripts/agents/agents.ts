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
  title: { hold: [140, 260], pre: [120, 230], early: [12, 20], late: [1, 2] },
  body: { hold: [100, 190], pre: [100, 190], early: [10, 18], late: [1, 2] },
  tag: { hold: [80, 150], pre: [70, 130], early: [9, 14], late: [1, 2] },
  chip: { hold: [50, 110], pre: [45, 100], early: [7, 12], late: [1, 2] },
  badge: { hold: [50, 110], pre: [45, 100], early: [7, 12], late: [1, 2] },
  "kpi-num": {
    hold: [80, 160],
    pre: [70, 140],
    early: [9, 15],
    late: [1, 2],
  },
  "kpi-label": {
    hold: [80, 160],
    pre: [70, 140],
    early: [9, 15],
    late: [1, 2],
  },
  button: { hold: [90, 170], pre: [80, 150], early: [10, 16], late: [1, 2] },
  image: { hold: [150, 250], pre: [50, 100], early: [5, 10], late: [1, 2] },
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
