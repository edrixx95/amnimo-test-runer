import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '~/composables/useToast';
import { useI18n } from 'vue-i18n';
import type { Session } from '~~/shared/types';
import { DEVICE_TYPES, getFirmwarePrefix } from '~~/shared/constants';

import { useNetworkCheck } from '~/composables/peripherals/useNetworkCheck';
import { usePeripheralChecklist } from '~/composables/peripherals/usePeripheralChecklist';
import { useSessionEnvTemplate } from '~/composables/sessions/useSessionEnvTemplate';

export function useSessionSetup() {
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const { addToast } = useToast();
  
  const sessionId = route.params.id as string;
  const session = ref<Session | null>(null);
  const isLoadingSession = ref(true);
  const isSaving = ref(false);

  const currentStep = ref(1);

  const formData = ref({
    series: "",
    board: "",
    deviceType: "",
    baseUrl: "https://192.168.0.254",
    envContent: "",
    testType: "release" as "release" | "system" | "playground",
  });

  const baseUrlRef = computed(() => formData.value.baseUrl);
  const boardRef = computed(() => formData.value.board);
  const seriesRef = computed(() => formData.value.series);

  // Initialize composables
  const { 
    pingCheckStatus,
    pingCheckError,
    deviceInfoCheckStatus,
    deviceInfoCheckError,
    pingStatus, 
    pingErrorMessage, 
    isPinging, 
    pingDevice, 
    startPingPolling, 
    stopPingPolling, 
    resetPingStatus 
  } = useNetworkCheck(baseUrlRef, boardRef, seriesRef);
  const { checklistState, currentChecklistKey, currentChecklist, resetChecklistState } = usePeripheralChecklist(formData);
  const { updateEnvVariables, resetEnv } = useSessionEnvTemplate(formData);

  const steps = computed(() => {
    if (formData.value.testType === "playground") {
      return [
        { name: t("setup.stepScope"), description: t("setup.stepScopeDescPg") },
        { name: t("setup.stepTarget"), description: t("setup.stepTargetDesc") },
        { name: t("setup.stepEnv"), description: t("setup.stepEnvDesc") },
      ];
    }
    return [
      { name: t("setup.stepScope"), description: t("setup.stepScopeDesc") },
      { name: t("setup.stepTarget"), description: t("setup.stepTargetDesc") },
      { name: t("setup.stepEnv"), description: t("setup.stepEnvDesc") },
      { name: t("setup.stepCheck"), description: t("setup.stepCheckDesc") },
    ];
  });

  const availableDeviceTypes = computed(() => {
    if (!formData.value.board) return [];
    return DEVICE_TYPES[formData.value.board] || [];
  });

  const selectBoard = (series: string, board: string) => {
    formData.value.series = series;
    formData.value.board = board;
    formData.value.deviceType = ""; // Reset type
  };

  // Reset checklist state when device changes
  watch(currentChecklistKey, () => {
    resetPingStatus();
    resetChecklistState();
  });

  // Auto update env when device settings change
  watch(
    [
      () => formData.value.board,
      () => formData.value.series,
      () => formData.value.deviceType,
      () => formData.value.baseUrl,
    ],
    () => {
      if (formData.value.board) {
        updateEnvVariables();
      }
    },
  );

  // Poll ping based on step
  watch(currentStep, (newStep) => {
    if (newStep === 4) {
      startPingPolling();
    } else {
      stopPingPolling();
      if (newStep === 3) {
        pingDevice();
      }
    }
  });

  onUnmounted(() => {
    stopPingPolling();
  });

  // Extracted values for UI
  const extractedPrevFw = computed(() => {
    const match = formData.value.envContent.match(/^PREV_FIRMWARE_NAME=(.*)$/m);
    return match ? match[1]!.trim() : "";
  });

  const extractedTestFw = computed(() => {
    const match = formData.value.envContent.match(/^TEST_FIRMWARE_NAME=(.*)$/m);
    return match ? match[1]!.trim() : "";
  });

  const extractedDhcpIp = computed(() => {
    const match = formData.value.envContent.match(/^DHCP_CLIENT_IP=(.*)$/m);
    return match ? match[1]!.trim() : "";
  });

  const extractedUsername = computed(() => {
    const match = formData.value.envContent.match(/^TEST_USERNAME=(.*)$/m);
    return match ? match[1]!.trim() : "admin";
  });

  const extractedPassword = computed(() => {
    const match = formData.value.envContent.match(/^TEST_PASSWORD=(.*)$/m);
    return match ? match[1]!.trim() : "yoko1234";
  });

  const loadSession = async () => {
    try {
      const data = await $fetch<Session>(`/api/sessions/${sessionId}`);
      session.value = data;
      if (data.series) formData.value.series = data.series;
      if (data.board) formData.value.board = data.board;
      if (data.deviceType) formData.value.deviceType = data.deviceType;
      if (data.baseUrl) formData.value.baseUrl = data.baseUrl;
      if (data.envContent) formData.value.envContent = data.envContent;
      if (data.testType) formData.value.testType = data.testType;

      if (route.query.step) {
        const s = parseInt(route.query.step as string);
        if (!isNaN(s) && s >= 1 && s <= 4) {
          currentStep.value = s;
        }
      }
    } catch (err: unknown) {
      console.error("Failed to load session:", err);
      addToast({
        title: t("setup.errorTitle"),
        message: t("setup.sessionNotFound"),
        type: "error",
      });
      router.push("/");
    } finally {
      isLoadingSession.value = false;
    }
  };

  const isStepValid = computed(() => {
    if (currentStep.value === 1) {
      return !!formData.value.testType;
    }
    if (currentStep.value === 2) {
      if (!formData.value.board || !formData.value.baseUrl) return false;
      if (
        availableDeviceTypes.value.length > 0 &&
        formData.value.board !== "AR10" &&
        !formData.value.deviceType
      )
        return false;
      return true;
    }
    if (currentStep.value === 3) {
      return formData.value.envContent.length > 0;
    }
    if (currentStep.value === 4) {
      if (pingStatus.value !== "success") return false;

      const cl = currentChecklist.value;
      if (cl) {
        for (const p of cl.peripherals || []) {
          if (!checklistState.value.peripherals[p.id]) return false;
        }
        for (const p of cl.partners || []) {
          if (!checklistState.value.partners[p.id]) return false;
        }
        for (const p of cl.manual || []) {
          if (!checklistState.value.manual[p.id]) return false;
        }
      }
      return true;
    }
    return true;
  });

  const saveProgress = async () => {
    isSaving.value = true;
    try {
      await $fetch(`/api/sessions/${sessionId}`, {
        method: "PUT",
        body: formData.value,
      });
    } catch (err: unknown) {
      console.error("Failed to save progress", err);
    } finally {
      isSaving.value = false;
    }
  };

  const lastAutoFilledBoard = ref<string>("");

  const nextStep = async () => {
    if (!isStepValid.value) return;
  
    if (
      currentStep.value === 2 &&
      lastAutoFilledBoard.value !== formData.value.board
    ) {
      try {
        const allFirmwares = await $fetch<string[]>("/api/firmwares");
        if (allFirmwares && allFirmwares.length > 0) {
          const boardName = formData.value.board.toLowerCase();
          const requiredPrefix = getFirmwarePrefix(boardName);
  
          const boardFws = allFirmwares.filter((fw) => {
            const isBootloader = fw.toLowerCase().includes("bootloader");
            const isValid = /^.*-v?\d+\.\d+\.\d+.*-b\d+.*\.amf$/i.test(fw);
            if (isBootloader || !isValid) return false;
  
            const prefix = fw.split("-")[0]?.toLowerCase() || "";
            return prefix === requiredPrefix;
          });
  
          if (boardFws.length > 0) {
            const testFw = boardFws[0]; 
            const getBaseVersion = (fw: string) => {
              const match = fw.match(/-(v?\d+\.\d+\.\d+)/);
              return match ? match[1] : fw;
            };
  
            const testBaseVer = getBaseVersion(testFw!);
            let prevFw = "";
  
            for (let i = 1; i < boardFws.length; i++) {
              if (getBaseVersion(boardFws[i]!) !== testBaseVer) {
                prevFw = boardFws[i]!;
                break;
              }
            }
  
            let env = formData.value.envContent;
            const upsert = (key: string, value: string) => {
              if (!value) return;
              const regex = new RegExp(`^${key}=.*$`, "m");
              if (env.match(regex)) {
                env = env.replace(regex, `${key}=${value}`);
              } else {
                env += (env && !env.endsWith("\n") ? "\n" : "") + `${key}=${value}`;
              }
            };
  
            upsert("TEST_FIRMWARE_NAME", testFw!);
            if (prevFw) {
              upsert("PREV_FIRMWARE_NAME", prevFw);
            }
  
            formData.value.envContent = env;
          }
        }
        lastAutoFilledBoard.value = formData.value.board;
      } catch (err: unknown) {
        console.error("Failed to auto-select firmware:", err);
      }
    }
  
    await saveProgress();
    if (currentStep.value < steps.value.length) {
      currentStep.value++;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  
  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const finishSetup = async () => {
    if (!isStepValid.value) return;
    await saveProgress();
    const nextStatus = formData.value.testType === "playground" ? "Ready" : "Preparing";
    await $fetch(`/api/sessions/${sessionId}`, {
      method: "PUT",
      body: { status: nextStatus },
    });
    router.push(`/sessions/${sessionId}/runner`);
  };

  onMounted(() => {
    loadSession();
  });

  return {
    sessionId,
    session,
    isLoadingSession,
    isSaving,
    currentStep,
    steps,
    formData,
    extractedPrevFw,
    extractedTestFw,
    extractedDhcpIp,
    extractedUsername,
    extractedPassword,
    availableDeviceTypes,
    selectBoard,
    pingCheckStatus,
    pingCheckError,
    deviceInfoCheckStatus,
    deviceInfoCheckError,
    pingStatus,
    pingErrorMessage,
    isPinging,
    pingDevice,
    checklistState,
    currentChecklist,
    resetEnv,
    isStepValid,
    nextStep,
    prevStep,
    finishSetup
  };
}
