import path from "node:path";
import fs from "node:fs/promises";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { getSettings } from "./settingsManager";
import { EventEmitter } from "node:events";
import type { PlaywrightSuiteNode } from "~~/shared/types";

export const testScannerEvents = new EventEmitter();

const execAsync = promisify(exec);

export type FileNode = {
  name: string;
  type: "file" | "folder";
  path?: string;
  children?: FileNode[];
  cases?: string[];
};

const ROOT_ORDER = [
  "simple-settings",
  "side-menu",
  "dashboard",
  "header",
  "network",
  "system",
  "service",
  "management",
];

const NETWORK_ORDER = [
  "interface",
  "mobile",
  "wifi",
  "pppoe",
  "routing",
  "filter",
  "nat",
  "ipsec",
  "dns",
];
const SYSTEM_ORDER = [
  "hostname",
  "time",
  "account",
  "package-repository",
  "storage",
  "gui",
  "poe",
  "ssh",
];
const SERVICE_ORDER = [
  "dhcp-server",
  "dhcp-relay",
  "proxy",
  "schedule",
  "dms",
  "vms",
  "cvr",
  "nxwithness",
  "remoteit",
  "di-history",
];
const MANAGEMENT_ORDER = [
  "syslog",
  "nwdiag",
  "amdiag",
  "reboot",
  "firmware",
  "amnimo-cfg",
];

function getSortIndex(name: string, orderArray: string[]): number {
  const idx = orderArray.indexOf(name);
  return idx === -1 ? 999 : idx;
}

function sortNodes(nodes: FileNode[], parentName?: string): void {
  // Sort children first
  for (const node of nodes) {
    if (node.type === "folder" && node.children) {
      sortNodes(node.children, node.name);
    }
  }

  // Sort current level
  nodes.sort((a, b) => {
    // Folders first
    if (a.type !== b.type) {
      return a.type === "folder" ? -1 : 1;
    }

    // Custom sorting based on parent
    let orderArray: string[] | undefined;
    if (!parentName) {
      orderArray = ROOT_ORDER;
    } else if (parentName === "network") {
      orderArray = NETWORK_ORDER;
    } else if (parentName === "system") {
      orderArray = SYSTEM_ORDER;
    } else if (parentName === "service") {
      orderArray = SERVICE_ORDER;
    } else if (parentName === "management") {
      orderArray = MANAGEMENT_ORDER;
    }

    if (orderArray) {
      const idxA = getSortIndex(a.name, orderArray);
      const idxB = getSortIndex(b.name, orderArray);
      if (idxA !== idxB) {
        return idxA - idxB;
      }
    }

    // Default alphabetical
    return a.name.localeCompare(b.name);
  });
}

async function buildBaseTree(
  dir: string,
  baseDir: string,
): Promise<FileNode[]> {
  const nodes: FileNode[] = [];
  try {
    const list = await fs.readdir(dir, { withFileTypes: true });

    for (const file of list) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        const children = await buildBaseTree(fullPath, baseDir);
        if (children.length > 0) {
          nodes.push({
            name: file.name,
            type: "folder",
            children,
          });
        }
      } else if (file.name.endsWith(".spec.ts")) {
        const relativePath = path
          .relative(baseDir, fullPath)
          .replace(/\\/g, "/");
        nodes.push({
          name: file.name,
          type: "file",
          path: relativePath,
          cases: [],
        });
      }
    }
  } catch (e) {
    console.error(`Error reading directory ${dir}:`, e);
  }
  return nodes;
}

function mergeCasesIntoTree(
  nodes: FileNode[],
  casesMap: Record<string, string[]>,
) {
  for (const node of nodes) {
    if (node.type === "file" && node.path) {
      node.cases = casesMap[node.path] || [];
    } else if (node.type === "folder" && node.children) {
      mergeCasesIntoTree(node.children, casesMap);
    }
  }
}

export async function scanTestCases(type: string): Promise<FileNode[]> {
  const e2eDir = getSettings().e2ePath;
  const targetDir = path.join(e2eDir, `playwright/tests/${type}`);

  // 1. Build folder tree
  const tree = await buildBaseTree(targetDir, targetDir);

  // 2. Fetch test cases using Playwright
  const fullTargetPath = `playwright/tests/${type}`;
  const casesMap: Record<string, string[]> = {};

  try {
    const isWindows = process.platform === "win32";
    const cmd = isWindows
      ? `npx.cmd playwright test ${fullTargetPath} --list --reporter=json`
      : `npx playwright test ${fullTargetPath} --list --reporter=json`;

    const { stdout } = await execAsync(cmd, { cwd: e2eDir });

    const configIndex = stdout.indexOf('"config":');
    if (configIndex !== -1) {
      const jsonStart = stdout.lastIndexOf("{", configIndex);
      if (jsonStart !== -1) {
        const report = JSON.parse(stdout.substring(jsonStart));
        const suites = report.suites || [];

        const typePrefix = `playwright/tests/${type}/`;
        const typePrefix2 = `${type}/`;

        const extractSpecs = (s: PlaywrightSuiteNode, arr: string[]) => {
          if (s.specs) {
            for (const spec of s.specs) {
              arr.push(spec.title);
            }
          }
          if (s.suites) {
            for (const child of s.suites) {
              extractSpecs(child, arr);
            }
          }
        };

        for (const suite of suites) {
          let relPath = suite.file;
          if (relPath.includes(typePrefix)) {
            relPath = relPath.substring(
              relPath.indexOf(typePrefix) + typePrefix.length,
            );
          } else if (relPath.includes(typePrefix2)) {
            relPath = relPath.substring(
              relPath.indexOf(typePrefix2) + typePrefix2.length,
            );
          }
          relPath = relPath.replace(/\\/g, "/");

          const arr: string[] = [];
          extractSpecs(suite, arr);
          casesMap[relPath] = arr;
        }
      }
    }
  } catch (err) {
    console.error("Failed to run playwright test --list during scan:", err);
    // Ignore error, we will just return empty cases in tree
  }

  // 3. Merge cases into tree and sort
  mergeCasesIntoTree(tree, casesMap);
  sortNodes(tree);

  return tree;
}

export async function getCachedTestTree(type: string): Promise<FileNode[]> {
  const cacheFile = path.resolve(`server/data/base-test-cases-${type}.json`);

  try {
    const data = await fs.readFile(cacheFile, "utf-8");
    return JSON.parse(data) as FileNode[];
  } catch (err) {
    console.log(err);
    // If not exists or error, scan immediately and save
    const tree = await scanTestCases(type);

    // Attempt to save cache in background
    fs.mkdir(path.dirname(cacheFile), { recursive: true })
      .then(() => {
        return fs.writeFile(cacheFile, JSON.stringify(tree, null, 2));
      })
      .catch((e) => console.error("Failed to write cache:", e));

    return tree;
  }
}

export function backgroundUpdateTestTree(
  type: string,
  notifyChange?: () => void,
): void {
  const cacheFile = path.resolve(`server/data/base-test-cases-${type}.json`);

  // Run scan in background
  setTimeout(async () => {
    try {
      const tree = await scanTestCases(type);
      const newJson = JSON.stringify(tree, null, 2);

      let existingJson = "";
      try {
        existingJson = await fs.readFile(cacheFile, "utf-8");
      } catch (e) {
        /* ignore */
        console.log(e);
      }

      // Update only if different
      if (newJson !== existingJson) {
        await fs.mkdir(path.dirname(cacheFile), { recursive: true });
        await fs.writeFile(cacheFile, newJson);
        console.log(`[TestScanner] Cache updated for type: ${type}`);
        testScannerEvents.emit("tests-updated");
        if (notifyChange) notifyChange();
      }
    } catch (err) {
      console.error("[TestScanner] Background update failed:", err);
    }
  }, 1000); // Small delay to let API return first
}
