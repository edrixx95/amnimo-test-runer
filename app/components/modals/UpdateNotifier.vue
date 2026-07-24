<template>
  <Transition name="slide-up">
    <div
      v-if="isVisible"
      class="fixed bottom-6 right-6 z-[10000] bg-white rounded-2xl shadow-xl border border-slate-200 p-5 max-w-sm w-full flex flex-col gap-3"
    >
      <div class="flex items-start gap-3">
        <div class="shrink-0 pt-0.5">
          <Icon
            name="heroicons:arrow-path-rounded-square"
            class="w-6 h-6 text-amnimo-500"
            :class="{
              'animate-spin': status === 'checking' || status === 'downloading',
            }"
          />
        </div>

        <div class="flex-1 flex flex-col gap-1 min-w-0">
          <h4 class="text-base font-bold text-slate-800">{{ title }}</h4>
          <p class="text-sm text-slate-500 leading-snug">{{ message }}</p>

          <div
            v-if="status === 'downloading'"
            class="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-amnimo-500 transition-all duration-300"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <button
          v-if="status === 'not-available' || status === 'error'"
          @click="close"
          class="shrink-0 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors -mr-2 -mt-2"
        >
          <Icon name="heroicons:x-mark" class="w-5 h-5" />
        </button>
      </div>

      <div v-if="status === 'downloaded'" class="flex justify-end gap-2 mt-2">
        <button
          @click="close"
          class="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          {{ $t("updateNotifier.later") }}
        </button>
        <button
          @click="installUpdate"
          class="px-4 py-2 text-sm font-bold text-white bg-amnimo-600 hover:bg-amnimo-700 rounded-lg transition-colors"
        >
          {{ $t("updateNotifier.restartAndInstall") }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const isVisible = ref(false);
const status = ref<
  | "checking"
  | "available"
  | "not-available"
  | "downloading"
  | "downloaded"
  | "error"
  | ""
>("");
const progress = ref(0);
const versionInfo = ref("");
const errorMessage = ref("");

const title = computed(() => {
  switch (status.value) {
    case "checking":
      return t("updateNotifier.checkingForUpdates");
    case "available":
      return t("updateNotifier.updateAvailable");
    case "downloading":
      return t("updateNotifier.downloadingUpdate");
    case "downloaded":
      return t("updateNotifier.readyToInstall");
    case "not-available":
      return t("updateNotifier.upToDate");
    case "error":
      return t("updateNotifier.updateFailed");
    default:
      return t("updateNotifier.update");
  }
});

const message = computed(() => {
  switch (status.value) {
    case "checking":
      return t("updateNotifier.msgChecking");
    case "available":
      return t("updateNotifier.msgAvailable", { version: versionInfo.value });
    case "downloading":
      return t("updateNotifier.msgDownloading", {
        progress: Math.round(progress.value),
      });
    case "downloaded":
      return t("updateNotifier.msgDownloaded", { version: versionInfo.value });
    case "not-available":
      return t("updateNotifier.msgNotAvailable");
    case "error":
      return errorMessage.value || t("updateNotifier.msgError");
    default:
      return "";
  }
});

onMounted(() => {
  if (typeof window !== "undefined" && (window as any).electronAPI) {
    (window as any).electronAPI.onUpdateStatus((updateStatus: any) => {
      isVisible.value = true;
      status.value = updateStatus.status;

      if (updateStatus.version) {
        versionInfo.value = updateStatus.version;
      }
      if (updateStatus.percent) {
        progress.value = updateStatus.percent;
      }
      if (updateStatus.error) {
        errorMessage.value = updateStatus.error;
      }

      // Auto-hide if no update
      if (status.value === "not-available") {
        setTimeout(() => close(), 4000);
      }
    });

    // Automatically check for updates on startup
    setTimeout(() => {
      (window as any).electronAPI.checkForUpdates();
    }, 5000);
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined" && (window as any).electronAPI) {
    (window as any).electronAPI.removeUpdateStatusListener();
  }
});

const close = () => {
  isVisible.value = false;
};

const installUpdate = () => {
  if (typeof window !== "undefined" && (window as any).electronAPI) {
    (window as any).electronAPI.installUpdate();
  }
};
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%) scale(0.95);
}
</style>
