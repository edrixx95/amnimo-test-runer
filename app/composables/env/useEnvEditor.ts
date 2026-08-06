/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, watch, onMounted, nextTick } from "vue";
import { useToast } from "~/composables/useToast";
import { getFirmwarePrefix } from "~~/shared/constants";
import { useI18n } from "vue-i18n";

export const block1Row1Keys = ["SERIES", "BOARD", "DEVICE_TYPE"];
export const block1Row2Keys = ["PREV_FIRMWARE_NAME", "TEST_FIRMWARE_NAME"];
export const block2Keys = [
  "PC_SERVER_URL",
  "PC_SERVER_PORT",
  "INTERNET_ADDRESS",
  "INTERNET_GATEWAY_ADDRESS",
  "DHCP_CLIENT_IP",
  "SIM_APN",
  "SIM_USERNAME",
  "SIM_PASSWORD",
];
export const block3Keys = [
  "BASE_URL",
  "HOST",
  "TEST_USERNAME",
  "TEST_PASSWORD",
  "CLI_SERVER_URL",
  "CLI_SERVER_PORT",
];

export function useEnvEditor(
  modelValueRef: { value: string },
  emit: (event: "update:modelValue", value: string) => void,
) {
  const { t } = useI18n();
  const { addToast } = useToast();

  const parsedEnv = ref<Record<string, string>>({});
  const envComments = ref<Record<string, string>>({});
  const allLines = ref<string[]>([]);

  const firmwares = ref<string[]>([]);
  const availablePorts = ref<string[]>([]);

  const focusedField = ref<string | null>(null);

  // IIS Scanning State
  const isScanningIIS = ref(false);
  const iisSites = ref<
    {
      name: string;
      state: string;
      port: number;
      url: string;
      physicalPath?: string;
    }[]
  >([]);
  const showIISDropdown = ref(false);
  const iisTargetKey = ref<string | null>(null);

  const scanIIS = async (key: string) => {
    iisTargetKey.value = key;
    isScanningIIS.value = true;
    try {
      const data = await $fetch<any[]>("/api/iis/sites");
      iisSites.value = data;
      showIISDropdown.value = true;
    } catch (error: any) {
      addToast({
        title: t("envEditor.error"),
        message: error.data?.statusMessage || t("envEditor.failedToScanIis"),
        type: "error",
      });
    } finally {
      isScanningIIS.value = false;
    }
  };

  const selectIISSite = (site: {
    port: number;
    url: string;
    physicalPath?: string;
  }) => {
    if (site.physicalPath) {
      localStorage.setItem("amnimo_server_path", site.physicalPath);
      window.dispatchEvent(
        new CustomEvent("serverPathUpdated", { detail: site.physicalPath }),
      );
    }

    if (site.url) {
      try {
        const urlObj = new URL(site.url);
        parsedEnv.value["PC_SERVER_URL"] = urlObj.hostname;
        if (site.port) {
          parsedEnv.value["PC_SERVER_PORT"] = site.port.toString();
        } else if (urlObj.port) {
          parsedEnv.value["PC_SERVER_PORT"] = urlObj.port;
        }
      } catch (_e) {
        if (iisTargetKey.value === "PC_SERVER_PORT" && site.port) {
          parsedEnv.value["PC_SERVER_PORT"] = site.port.toString();
        } else if (iisTargetKey.value === "PC_SERVER_URL" && site.url) {
          parsedEnv.value["PC_SERVER_URL"] = site.url;
        }
      }
    } else if (site.port) {
      parsedEnv.value["PC_SERVER_PORT"] = site.port.toString();
    }

    showIISDropdown.value = false;
    emitChange();
  };

  const toggleDropdown = async (key: string) => {
    if (focusedField.value === key) {
      focusedField.value = null;
    } else {
      focusedField.value = key;
      await nextTick();
      const dropdown = document.getElementById(`dropdown-${key}`);
      const activeItem = dropdown?.querySelector(".font-bold");
      if (activeItem && dropdown) {
        activeItem.scrollIntoView({ block: "center" });
      }
    }
  };

  const handleBlur = () => {
    if (document.body.classList.contains("driver-active")) return;
    focusedField.value = null;
  };

  const selectOption = (key: string, opt: string) => {
    parsedEnv.value[key] = opt;
    focusedField.value = null;
    emitChange();
  };

  const getOptions = (key: string) => {
    if (key === "CLI_SERVER_PORT") {
      return availablePorts.value;
    }
    if (key === "PREV_FIRMWARE_NAME" || key === "TEST_FIRMWARE_NAME") {
      let list = firmwares.value;
      list = list.filter((fw) => {
        const isBootloader = fw.toLowerCase().includes("bootloader");
        const isValid = /^.*-\d+\.\d+\.\d+-b\d+\.amf$/i.test(fw);
        return !isBootloader && isValid;
      });

      const currentBoard = parsedEnv.value["BOARD"];
      if (currentBoard) {
        const requiredPrefix = getFirmwarePrefix(currentBoard);
        list = list.filter((fw) => {
          const prefix = fw.split("-")[0]?.toLowerCase() || "";
          return prefix === requiredPrefix;
        });
      }
      return list;
    }

    if (key === "SERIES") return ["G", "X", "R", "C"];
    if (key === "BOARD") {
      const series = parsedEnv.value["SERIES"];
      if (series === "G") return ["AG10", "AG20"];
      if (series === "X") return ["AX11", "AX12", "AX21", "AX30"];
      if (series === "R") return ["AR10", "AR20"];
      if (series === "C") return ["AC10", "AC15", "AC25"];
      return [
        "AG10",
        "AG20",
        "AX11",
        "AX12",
        "AX21",
        "AX30",
        "AR10",
        "AR20",
        "AC10",
        "AC15",
        "AC25",
      ];
    }
    if (key === "DEVICE_TYPE") {
      const board = parsedEnv.value["BOARD"];
      if (board === "AX30") return ["A", "B"];
      if (board === "AC15" || board === "AC25") return ["V2A", "V3A"];
      if (board === "AR10") return ["WoM"];
      return [""];
    }
    return [];
  };

  const emitChange = () => {
    const newLines = allLines.value.map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return line;

      const idx = line.indexOf("=");
      if (idx > -1) {
        const key = line.substring(0, idx).trim();
        if (parsedEnv.value[key] !== undefined) {
          return `${key}=${parsedEnv.value[key]}`;
        }
      }
      return line;
    });

    const handledKeys = new Set<string>();
    newLines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const idx = line.indexOf("=");
        if (idx > -1) {
          handledKeys.add(line.substring(0, idx).trim());
        }
      }
    });

    const allExpectedKeys = [
      ...block1Row1Keys,
      ...block1Row2Keys,
      ...block2Keys,
      ...block3Keys,
    ];
    allExpectedKeys.forEach((key) => {
      if (!handledKeys.has(key) && parsedEnv.value[key] !== undefined) {
        newLines.push(`${key}=${parsedEnv.value[key]}`);
      }
    });

    const finalString = newLines.join("\n");
    if (finalString !== modelValueRef.value) {
      emit("update:modelValue", finalString);
    }
  };

  const parseEnv = (content: string) => {
    const lines = content.split("\n");
    allLines.value = [...lines];

    const env: Record<string, string> = {};
    const comments: Record<string, string> = {};
    let currentCommentBlocks: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("#")) {
        if (!trimmed.startsWith("# ====")) {
          currentCommentBlocks.push(trimmed.replace(/^#\s*/, ""));
        } else {
          currentCommentBlocks = [];
        }
      } else if (trimmed) {
        const idx = line.indexOf("=");
        if (idx > -1) {
          const key = line.substring(0, idx).trim();
          const val = line.substring(idx + 1).trim();
          env[key] = val;

          const filteredComments = currentCommentBlocks.filter(
            (c) => !c.startsWith("["),
          );
          if (filteredComments.length > 0) {
            comments[key] = filteredComments.join("\n");
          }
        }
      } else {
        currentCommentBlocks = [];
      }
    });

    if (!env["TEST_USERNAME"]) env["TEST_USERNAME"] = "admin";
    if (!env["TEST_PASSWORD"]) env["TEST_PASSWORD"] = "yoko1234";
    if (!env["CLI_SERVER_URL"]) env["CLI_SERVER_URL"] = "http://localhost";

    parsedEnv.value = env;
    envComments.value = comments;
    emitChange();
  };

  watch(
    () => modelValueRef.value,
    (newVal) => {
      if (Object.keys(parsedEnv.value).length === 0 && newVal !== "") {
        parseEnv(newVal);
      }
    },
  );

  onMounted(async () => {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".relative")) {
        showIISDropdown.value = false;
      }
    });

    if (modelValueRef.value) {
      parseEnv(modelValueRef.value);
    }

    try {
      const fwList = await $fetch<string[]>("/api/firmwares");
      firmwares.value = fwList;
    } catch (_err) {
      console.error("Failed to load firmwares", _err);
    }

    try {
      const ports = await $fetch<number[]>("/api/utils/available-ports");
      availablePorts.value = ports.map((p) => p.toString());

      if (
        !parsedEnv.value["CLI_SERVER_PORT"] &&
        availablePorts.value.length > 0
      ) {
        parsedEnv.value["CLI_SERVER_PORT"] = availablePorts.value[0]!;
        emitChange();
      }
    } catch (_err) {
      console.error("Failed to load available ports", _err);
    }

    if (import.meta.client) {
      window.addEventListener("close-env-dropdowns", () => {
        focusedField.value = null;
        showIISDropdown.value = false;
      });
    }
  });

  return {
    parsedEnv,
    envComments,
    focusedField,
    isScanningIIS,
    iisSites,
    showIISDropdown,
    iisTargetKey,
    scanIIS,
    selectIISSite,
    toggleDropdown,
    handleBlur,
    selectOption,
    getOptions,
    parseEnv,
    emitChange,
  };
}
