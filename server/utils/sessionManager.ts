import fs from "node:fs/promises";
import path from "node:path";
import type { Session } from "../../shared/types";
import { SESSION_STATUS } from "../../shared/constants";
import { randomUUID } from "node:crypto";
import { getSettings } from "./settingsManager";

// セキュリティのために絶対パスを確保し、データ保持のために可能であれば APP_DATA_PATH を使用します
const SESSIONS_DIR = process.env.APP_DATA_PATH
  ? path.join(process.env.APP_DATA_PATH, "sessions")
  : path.resolve(process.cwd(), "sessions");

export const getSessionsDir = () => SESSIONS_DIR;

export const sessionManager = {
  async init() {
    try {
      await fs.mkdir(SESSIONS_DIR, { recursive: true });
    } catch (e) {
      console.error("Failed to create sessions directory", e);
    }
  },

  async createSession(name?: string): Promise<Session> {
    await this.init();
    const id = `session-${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14)}-${randomUUID().split("-")[0]}`;

    const sessionDir = path.join(SESSIONS_DIR, id);
    await fs.mkdir(sessionDir, { recursive: true });

    // 仕様に従ってフォルダ構造を作成します
    await fs.mkdir(path.join(sessionDir, "report"), { recursive: true });
    await fs.mkdir(path.join(sessionDir, "screenshots"), { recursive: true });
    await fs.mkdir(path.join(sessionDir, "traces"), { recursive: true });
    await fs.mkdir(path.join(sessionDir, "videos"), { recursive: true });

    // 存在する場合、amnimo-e2e から .env を読み込みます
    let initialEnv = "";
    try {
      const e2eEnvPath = path.join(getSettings().e2ePath, ".env");
      initialEnv = await fs.readFile(e2eEnvPath, "utf-8");
    } catch (_e) {
      // Ignored
    }

    const session: Session = {
      id,
      name: name || `Session ${new Date().toLocaleString()}`,
      status: SESSION_STATUS.DRAFT,
      envContent: initialEnv,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(
      path.join(sessionDir, "session.json"),
      JSON.stringify(session, null, 2),
      "utf-8",
    );

    return session;
  },

  async getSessions(): Promise<Session[]> {
    await this.init();
    const entries = await fs.readdir(SESSIONS_DIR, { withFileTypes: true });
    const sessions: Session[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        try {
          const sessionPath = path.join(
            SESSIONS_DIR,
            entry.name,
            "session.json",
          );
          const data = await fs.readFile(sessionPath, "utf-8");
          sessions.push(JSON.parse(data));
        } catch (e) {
          // パースできない場合はスキップします
          console.error(`Error reading session ${entry.name}`, e);
        }
      }
    }

    return sessions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },
};
