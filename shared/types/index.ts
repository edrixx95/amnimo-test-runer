import { SESSION_STATUS, DEVICE_SERIES } from "../constants";

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
  testType?: "release" | "system";
  envContent?: string;
  status: SessionStatus;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  closedAt?: string;
};

export type SessionSummary = {
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
};

export type Session = SessionMetadata & {
  summary?: SessionSummary;
};
