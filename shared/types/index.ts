import type { SESSION_STATUS, DEVICE_SERIES } from "../constants";

export type SessionStatus =
  (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS];
export type DeviceSeries = (typeof DEVICE_SERIES)[keyof typeof DEVICE_SERIES];

export type SessionMetadata = {
  id: string;
  name?: string;
  device?: string; // A, B, WoM
  board?: string; // AX30, AR10
  series?: DeviceSeries;
  deviceType?: string; // WoM, A, B, V2A, V3A
  firmware?: string;
  target?: string;
  baseUrl?: string;
  testType?: "release" | "system-test" | "playground";
  envContent?: string;
  status: SessionStatus;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  closedAt?: string;
  updatedAt?: string;
};

export type SessionSummary = {
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
};

export type SessionMeta = {
  testCounts?: {
    passed: number;
    failed: number;
    skipped: number;
    total: number;
    completed: number;
  };
  specCounts?: { completed: number; total: number };
  queuedSpecs?: Spec[];
};

export type Session = SessionMetadata & {
  summary?: SessionSummary;
  meta?: SessionMeta;
};

export type InnerTest = {
  id?: string | number;
  name: string;
  status: "running" | "PASSED" | "FAILED" | "SKIPPED";
};

export type Spec = {
  id: string | number;
  path: string;
  title?: string;
  status: "waiting" | "running" | "passed" | "failed";
  innerTests: InnerTest[];
};

export type LogEntry = {
  id: string | number;
  type: string;
  message: string;
  timestamp: string;
};

export type WsMessage = {
  type?: string;
  status?: string;
  sessionName?: string;
  testType?: string;
  message?: string;
  [key: string]: unknown;
};

export type FileNode = {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
};

export type TestOrder = {
  id: string;
  name: string;
  description?: string;
  specs?: string[];
  suites?: unknown[];
};

export interface CatchError extends Error {
  response?: {
    status?: number;
    _data?: unknown;
  };
  statusCode?: number;
  statusMessage?: string;
  code?: string | number;
  content?: unknown;
  token?: string;
  type?: string;
  result?: string;
  suite?: string;
  data?: {
    statusMessage?: string;
  };
}

export type PlaywrightSuiteNode = {
  specs?: { title: string }[];
  suites?: PlaywrightSuiteNode[];
};
