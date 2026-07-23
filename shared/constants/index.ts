export const SESSION_STATUS = {
  DRAFT: "Draft",
  PREPARING: "Preparing",
  READY: "Ready",
  RUNNING: "Running",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
  FAILED: "Failed",
  CLOSED: "Closed",
} as const;

export const DEVICE_SERIES = {
  G: "G",
  X: "X",
  R: "R",
  C: "C",
} as const;

export const BOARDS = {
  G: ["AG10", "AG20"],
  X: ["AX11", "AX12", "AX21", "AX30"],
  R: ["AR10", "AR20"],
  C: ["AC10", "AC15", "AC25"],
} as const;

export const DEVICE_TYPES: Record<string, string[]> = {
  AR10: ["WoM"],
  AX30: ["A", "B"],
  AC15: ["V2A", "V3A"],
  AC25: ["V2A", "V3A"],
};

export const DEFAULT_CHECKLIST = {
  peripherals: [
    { id: "sim", label: "SIM", icon: "heroicons:credit-card" },
    { id: "usb", label: "Storage Device", icon: "heroicons:archive-box" },
    { id: "poe_camera", label: "PoE Camera", icon: "heroicons:video-camera" },
    { id: "nx_witness", label: "Nx Witness", icon: "heroicons:video-camera" },
    { id: "dhcp", label: "DHCP client (Partner GW)", icon: "heroicons:computer-desktop" },
  ],
  partners: [],
    manual: [
    {
      id: "fw_prep",
      title: "【FWファイル準備】",
      instructions: [
        "ローカル配置: プロジェクトルートのamnimo-e2e/upload/ディレクトリに､リリースFWの｢1つ前｣のバージョンのFWファイルを格納する｡",
        "サーバー配置: 各自構築したファイルサーバーのディレクトリにリリースFW およびリリースFWの1つ前のバージョンのFWファイルを格納する｡",
      ],
    },
  ],
};

export const CHECKLISTS = {
  "AX30 A": {
    peripherals: [
      { id: "sim", label: "SIM", icon: "heroicons:credit-card" },
      { id: "usb", label: "Storage Device", icon: "heroicons:archive-box" },
      { id: "antenna", label: "Antenna", icon: "heroicons:signal" },
      { id: "poe_camera", label: "PoE Camera", icon: "heroicons:video-camera" },
      { id: "nx_witness", label: "Nx Witness", icon: "heroicons:video-camera" },
      { id: "dhcp", label: "DHCP client (Partner GW)", icon: "heroicons:computer-desktop" },
    ],
    partners: [],
    manual: [
      {
        id: "fw_prep",
        title: "【FWファイル準備】",
        instructions: [
          "ローカル配置: プロジェクトルートのamnimo-e2e/upload/ディレクトリに､リリースFWの｢1つ前｣のバージョンのFWファイルを格納する｡",
          "サーバー配置: 各自構築したファイルサーバーのディレクトリにリリースFW およびリリースFWの1つ前のバージョンのFWファイルを格納する｡",
        ],
      },
    ],
  },
  "AX30 B": {
    peripherals: [
      { id: "sim", label: "SIM", icon: "heroicons:credit-card" },
      { id: "usb", label: "Storage Device", icon: "heroicons:archive-box" },
      { id: "antenna", label: "Antenna", icon: "heroicons:signal" },
      { id: "nx_witness", label: "Nx Witness", icon: "heroicons:video-camera" },
      { id: "dhcp", label: "DHCP client (Partner GW)", icon: "heroicons:computer-desktop" },
    ],
    partners: [],
    manual: [
      {
        id: "fw_prep",
        title: "【FWファイル準備】",
        instructions: [
          "ローカル配置: プロジェクトルートのamnimo-e2e/upload/ディレクトリに､リリースFWの｢1つ前｣のバージョンのFWファイルを格納する｡",
          "サーバー配置: 各自構築したファイルサーバーのディレクトリにリリースFW およびリリースFWの1つ前のバージョンのFWファイルを格納する｡",
        ],
      },
    ],
  },
  AR10: {
    peripherals: [
      { id: "sim", label: "SIM", icon: "heroicons:credit-card" },
      { id: "dhcp", label: "DHCP client (Partner GW)", icon: "heroicons:computer-desktop" },
    ],
    partners: [],
    manual: [
      {
        id: "fw_prep",
        title: "【FWファイル準備】",
        instructions: [
          "ローカル配置: プロジェクトルートのamnimo-e2e/upload/ディレクトリに､リリースFWの｢1つ前｣のバージョンのFWファイルを格納する｡",
          "サーバー配置: 各自構築したファイルサーバーのディレクトリにリリースFW およびリリースFWの1つ前のバージョンのFWファイルを格納する｡",
        ],
      },
    ],
  },
  "AR10 WoM": {
    partners: [],
    manual: [
      {
        id: "fw_prep",
        title: "【FWファイル準備】",
        instructions: [
          "ローカル配置: プロジェクトルートのamnimo-e2e/upload/ディレクトリに､リリースFWの｢1つ前｣のバージョンのFWファイルを格納する｡",
          "サーバー配置: 各自構築したファイルサーバーのディレクトリにリリースFW およびリリースFWの1つ前のバージョンのFWファイルを格納する｡",
        ],
      },
    ],
  },
  AR20: {
    peripherals: [
      { id: "sim", label: "SIM", icon: "heroicons:credit-card" },
      { id: "poe_camera", label: "PoE Camera", icon: "heroicons:video-camera" },
    ],
    partners: [],
    manual: [
      {
        id: "fw_prep",
        title: "【FWファイル準備】",
        instructions: [
          "ローカル配置: プロジェクトルートのamnimo-e2e/upload/ディレクトリに､リリースFWの｢1つ前｣のバージョンのFWファイルを格納する｡",
          "サーバー配置: 各自構築したファイルサーバーのディレクトリにリリースFW およびリリースFWの1つ前のバージョンのFWファイルを格納する｡",
        ],
      },
    ],
  },
  AC10: {
    peripherals: [
      { id: "sim", label: "SIM", icon: "heroicons:credit-card" },
      { id: "dhcp", label: "DHCP client (Partner GW)", icon: "heroicons:computer-desktop" },
    ],
    partners: [],
    manual: [
      {
        id: "fw_prep",
        title: "【FWファイル準備】",
        instructions: [
          "ローカル配置: プロジェクトルートのamnimo-e2e/upload/ディレクトリに､リリースFWの｢1つ前｣のバージョンのFWファイルを格納する｡",
          "サーバー配置: 各自構築したファイルサーバーのディレクトリにリリースFW およびリリースFWの1つ前のバージョンのFWファイルを格納する｡",
        ],
      },
    ],
  },
  AC15: {
    peripherals: [
      { id: "sim", label: "SIM", icon: "heroicons:credit-card" },
      { id: "dhcp", label: "DHCP client (Partner GW)", icon: "heroicons:computer-desktop" },
    ],
    partners: [],
    manual: [
      {
        id: "fw_prep",
        title: "【FWファイル準備】",
        instructions: [
          "ローカル配置: プロジェクトルートのamnimo-e2e/upload/ディレクトリに､リリースFWの｢1つ前｣のバージョンのFWファイルを格納する｡",
          "サーバー配置: 各自構築したファイルサーバーのディレクトリにリリースFW およびリリースFWの1つ前のバージョンのFWファイルを格納する｡",
        ],
      },
    ],
  },
  AC25: {
    peripherals: [
      { id: "sim", label: "SIM", icon: "heroicons:credit-card" },
      { id: "poe_camera", label: "PoE Camera", icon: "heroicons:video-camera" },
    ],
    partners: [],
    manual: [
      {
        id: "fw_prep",
        title: "【FWファイル準備】",
        instructions: [
          "ローカル配置: プロジェクトルートのamnimo-e2e/upload/ディレクトリに､リリースFWの｢1つ前｣のバージョンのFWファイルを格納する｡",
          "サーバー配置: 各自構築したファイルサーバーのディレクトリにリリースFW およびリリースFWの1つ前のバージョンのFWファイルを格納する｡",
        ],
      },
    ],
  },
} as const;

export const getFirmwarePrefix = (board: string): string => {
  const b = board.toLowerCase();
  if (b === "ag10" || b === "ag20") return "ag10_ag20";
  if (b === "ar10" || b === "ar20") return "ar10_ar20";
  if (b === "ax11" || b === "ax21") return "ax11_ax21";
  if (b === "ac15" || b === "ac25") return "ac15_ac25";
  return b;
};
