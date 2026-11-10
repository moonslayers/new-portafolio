import type { StackGroup } from "../data/types";

export const stackIconMap: Record<string, string> = {
  "Angular 16–22": "simple-icons:angular",
  TypeScript: "simple-icons:typescript",
  "Laravel 10–13": "simple-icons:laravel",
  PHP: "simple-icons:php",
  "Node.js": "simple-icons:nodedotjs",
  MySQL: "simple-icons:mysql",
  PostgreSQL: "simple-icons:postgresql",
  SQLite: "simple-icons:sqlite",
  Docker: "simple-icons:docker",
  Nx: "simple-icons:nx",
  "GitHub Actions": "simple-icons:githubactions",
  Vitest: "simple-icons:vitest",
  MCP: "simple-icons:modelcontextprotocol",
  opencode: "simple-icons:opencode",
};

export const stackIconExceptions = new Set<string>(["Pest/PHPUnit"]);

export function getStackIcon(name: string): string | null {
  return stackIconMap[name] ?? null;
}

export function validateStackGroups(groups: StackGroup[]): void {
  for (const group of groups) {
    for (const name of group.items) {
      if (!(name in stackIconMap) && !stackIconExceptions.has(name)) {
        throw new Error(
          `[stackIcons] Tecnología sin icono registrado: "${name}" en grupo "${group.title}". Añade una entrada en stackIconMap o en stackIconExceptions en src/lib/stackIcons.ts.`,
        );
      }
    }
  }
}
