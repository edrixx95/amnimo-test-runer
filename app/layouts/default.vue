<script setup lang="ts">
/* eslint-disable */
import { ref, onMounted, onUnmounted } from "vue";

const { locale, setLocale } = useI18n();
import { useLocks } from "~/composables/useLocks";
const { connect, eventLogs, activeLocks, showEventLog } = useLocks();

const toggleLocale = () => {
  setLocale(locale.value === "en" ? "ja" : "en");
};

const isCollapsed = ref(false);
const appVersion = ref("1.0.0");

// Download State
const activeDownload = ref<any>(null);

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

onMounted(async () => {
  const saved = localStorage.getItem("sidebar_collapsed");
  if (saved) {
    isCollapsed.value = saved === "true";
  }

  connect();

  if ((window as any).electronAPI) {
    try {
      appVersion.value = await (window as any).electronAPI.getAppVersion();
    } catch (_e) {
      console.error("Failed to get app version", _e);
    }

    (window as any).electronAPI.onDownloadProgress((data: any) => {
      activeDownload.value = data;
    });

    (window as any).electronAPI.onDownloadComplete((data: any) => {
      if (activeDownload.value) {
        activeDownload.value.state = (data as any).state;
        activeDownload.value.received = activeDownload.value.total;

        // Auto hide after 5 seconds if completed successfully
        if ((data as any).state === "completed") {
          setTimeout(() => {
            if (activeDownload.value?.state === "completed") {
              activeDownload.value = null;
            }
          }, 5000);
        }
      }
    });
  }
});

onUnmounted(() => {
  if ((window as any).electronAPI) {
    (window as any).electronAPI.removeDownloadListeners();
  }
});

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem("sidebar_collapsed", String(isCollapsed.value));
};
</script>

<template>
  <div class="flex h-screen w-full font-sans bg-slate-50">
    <!-- Sidebar -->
    <aside
      class="bg-white border-r border-gray-100 shadow-soft flex flex-col z-10 transition-[width] duration-300 ease-out relative"
      :style="{ width: isCollapsed ? '80px' : '256px' }"
    >
      <!-- Logo Section as Toggle Button -->
      <button
        class="h-16 w-full flex items-center border-b border-gray-100 bg-white overflow-hidden shrink-0 relative hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
        title="Toggle Sidebar"
        @click="toggleSidebar"
      >
        <div
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
          :class="
            isCollapsed
              ? 'opacity-100 delay-100'
              : 'opacity-0 pointer-events-none'
          "
        >
          <img
            src="/amnimo-icon.ico"
            class="w-8 h-8 object-contain"
            alt="Amnimo"
          />
        </div>
        <div
          class="absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-300 whitespace-nowrap"
          :class="
            isCollapsed
              ? 'opacity-0 -translate-x-4 pointer-events-none'
              : 'opacity-100 translate-x-0'
          "
        >
          <AmnimoLogo class="h-6 w-auto text-amnimo-900" />
        </div>
      </button>

      <!-- Navigation -->
      <nav
        class="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden"
      >
        <!-- Sessions Link (Home) -->
        <NuxtLink
          to="/"
          class="group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-gray-500 hover:bg-slate-50 hover:text-gray-900 overflow-hidden"
          active-class="!bg-amnimo-50 !text-amnimo-900 shadow-sm ring-1 ring-amnimo-100"
          :title="isCollapsed ? $t('nav.sessions') : ''"
        >
          <Icon
            name="heroicons:queue-list"
            class="w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110"
          />
          <span
            class="ml-3 whitespace-nowrap transition-opacity duration-300"
            :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
          >
            {{ $t("nav.sessions") }}
          </span>
        </NuxtLink>

        <!-- Firmware Link -->
        <NuxtLink
          to="/firmware"
          class="group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-gray-500 hover:bg-slate-50 hover:text-gray-900 overflow-hidden"
          active-class="!bg-amnimo-50 !text-amnimo-900 shadow-sm ring-1 ring-amnimo-100"
          :title="isCollapsed ? $t('nav.firmware') : ''"
        >
          <Icon
            name="heroicons:cpu-chip"
            class="w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110"
          />
          <span
            class="ml-3 whitespace-nowrap transition-opacity duration-300"
            :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
          >
            {{ $t("nav.firmware") }}
          </span>
        </NuxtLink>

        <!-- Release Spec Link -->
        <NuxtLink
          to="/release-spec"
          class="group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-gray-500 hover:bg-slate-50 hover:text-gray-900 overflow-hidden"
          active-class="!bg-amnimo-50 !text-amnimo-900 shadow-sm ring-1 ring-amnimo-100"
          title="Release Spec"
        >
          <Icon
            name="heroicons:document-text"
            class="w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110"
          />
          <span
            class="ml-3 whitespace-nowrap transition-opacity duration-300"
            :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
          >
            Release Spec
          </span>
        </NuxtLink>

        <!-- Add more nav items here in the future following the same pattern -->
      </nav>

      <!-- Bottom Settings Link (Fixed above footer) -->
      <div class="p-3 border-t border-gray-100 bg-white">
        <!-- New Notifications Link -->
        <button
          class="w-full group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-gray-500 hover:bg-slate-50 hover:text-gray-900 overflow-hidden relative mb-2"
          :title="isCollapsed ? $t('nav.notifications') : ''"
          @click="showEventLog = true"
        >
          <div class="relative shrink-0">
            <Icon
              name="heroicons:bell"
              class="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
            />
            <span
              v-if="eventLogs.length > 0"
              class="absolute -top-1 -right-1 flex items-center justify-center min-w-[14px] h-[14px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full shadow-sm animate-pulse border border-white"
            >
              {{ eventLogs.length > 99 ? "99+" : eventLogs.length }}
            </span>
          </div>
          <span
            class="ml-3 whitespace-nowrap transition-opacity duration-300"
            :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
          >
            {{ $t("nav.notifications") }}
          </span>
        </button>

        <NuxtLink
          to="/settings"
          class="group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-gray-500 hover:bg-slate-50 hover:text-gray-900 overflow-hidden"
          active-class="!bg-amnimo-50 !text-amnimo-900 shadow-sm ring-1 ring-amnimo-100"
          :title="isCollapsed ? $t('nav.settings') : ''"
        >
          <Icon
            name="heroicons:cog-6-tooth"
            class="w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110"
          />
          <span
            class="ml-3 whitespace-nowrap transition-opacity duration-300"
            :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
          >
            {{ $t("nav.settings") }}
          </span>
        </NuxtLink>
      </div>

      <!-- Footer -->
      <div
        class="h-12 border-t border-gray-100 bg-slate-50/50 overflow-hidden shrink-0 relative flex items-center justify-center"
      >
        <div
          class="absolute flex items-center transition-all duration-300 w-full px-4 justify-between"
          :class="
            isCollapsed
              ? 'opacity-0 -translate-x-2 pointer-events-none'
              : 'opacity-100 translate-x-0'
          "
        >
          <p
            class="text-xs text-gray-400 font-medium tracking-wide uppercase whitespace-nowrap"
          >
            {{ $t("nav.version") }} {{ appVersion }}
          </p>
          <button
            class="text-xs font-bold text-slate-500 hover:text-amnimo-600 transition-colors bg-white px-2 py-1 rounded shadow-sm border border-slate-200"
            title="Toggle Language"
            @click="toggleLocale"
          >
            {{ locale === "en" ? "JA" : "EN" }}
          </button>
        </div>
        <div
          class="absolute flex items-center justify-center w-full transition-opacity duration-300"
          :class="
            isCollapsed
              ? 'opacity-100 delay-100'
              : 'opacity-0 pointer-events-none'
          "
        >
          <button
            class="text-[10px] font-bold text-slate-500 hover:text-amnimo-600 transition-colors bg-white px-2 py-1 rounded shadow-sm border border-slate-200"
            title="Toggle Language"
            @click="toggleLocale"
          >
            {{ locale === "en" ? "JA" : "EN" }}
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <slot />
    </main>

    <!-- Download Manager Toast -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-8 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-8 opacity-0"
    >
      <div
        v-if="activeDownload"
        class="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-glass border border-slate-200 p-4 z-50 flex flex-col gap-3"
      >
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="w-10 h-10 shrink-0 bg-amnimo-50 text-amnimo-600 rounded-xl flex items-center justify-center"
            >
              <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
            </div>
            <div class="min-w-0 flex-1">
              <p
                class="font-bold text-sm text-slate-800 truncate"
                :title="activeDownload.filename"
              >
                {{ activeDownload.filename }}
              </p>
              <p class="text-xs text-slate-500 font-medium">
                {{
                  activeDownload.state === "completed"
                    ? $t("download.complete")
                    : $t("download.speed", {
                        received: formatBytes(activeDownload.received),
                        total: formatBytes(activeDownload.total),
                      })
                }}
              </p>
            </div>
          </div>
          <button
            v-if="
              activeDownload.state === 'completed' ||
              activeDownload.state === 'cancelled'
            "
            class="text-slate-400 hover:text-slate-600"
            @click="activeDownload = null"
          >
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            class="h-1.5 rounded-full transition-all duration-300"
            :class="
              activeDownload.state === 'completed'
                ? 'bg-emerald-500'
                : 'bg-amnimo-500'
            "
            :style="{
              width: `${(activeDownload.received / activeDownload.total) * 100}%`,
            }"
          />
        </div>
      </div>
    </Transition>

    <!-- Notifications Modal -->
    <Transition name="modal">
      <div
        v-if="showEventLog"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0"
      >
        <div
          class="modal-backdrop fixed inset-0 bg-slate-900/60 backdrop-blur-sm transform-gpu will-change-opacity"
          @click="showEventLog = false"
        />

        <div
          class="modal-content relative bg-white rounded-2xl shadow-glass w-full max-w-lg overflow-hidden border border-slate-200 max-h-[80vh] flex flex-col"
        >
          <div
            class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50 shrink-0"
          >
            <h3
              class="text-xl font-bold text-slate-900 flex items-center gap-2"
            >
              <Icon name="heroicons:bell" class="w-6 h-6 text-amnimo-600" />
              {{ $t("notifications.title") }}
            </h3>
            <div class="flex items-center gap-3">
              <button
                v-if="eventLogs.length > 0"
                @click="eventLogs = []"
                class="text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                {{ $t("notifications.clearAll") }}
              </button>
              <button
                class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                @click="showEventLog = false"
              >
                <Icon name="heroicons:x-mark" class="w-6 h-6" />
              </button>
            </div>
          </div>

          <div
            class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/50"
          >
            <div
              v-if="eventLogs.length === 0"
              class="text-center text-slate-500 py-12 bg-white rounded-xl border border-slate-200 shadow-sm"
            >
              <Icon
                name="heroicons:inbox"
                class="w-12 h-12 mx-auto mb-2 opacity-30 text-slate-400"
              />
              <p class="font-medium text-slate-600">
                {{ $t("notifications.empty") }}
              </p>
            </div>

            <div
              v-for="log in eventLogs"
              :key="log.id"
              class="p-4 rounded-xl border bg-white shadow-sm flex gap-3 transition-colors duration-300"
              :class="
                log.type === 'acquired'
                  ? 'border-amber-200 hover:border-amber-300'
                  : 'border-emerald-200 hover:border-emerald-300'
              "
            >
              <div class="shrink-0 mt-0.5">
                <Icon
                  :name="
                    log.type === 'acquired'
                      ? 'heroicons:lock-closed'
                      : 'heroicons:lock-open'
                  "
                  class="w-5 h-5"
                  :class="
                    log.type === 'acquired'
                      ? 'text-amber-500'
                      : 'text-emerald-500'
                  "
                />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-bold text-sm text-slate-800">
                  {{
                    log.type === "acquired"
                      ? $t("notifications.deviceLocked")
                      : $t("notifications.deviceUnlocked")
                  }}
                </p>
                <p
                  class="text-sm text-slate-600 mt-1 break-words leading-relaxed"
                >
                  <span
                    class="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200"
                    >{{ log.lock.resource }}</span
                  >
                  <span class="mx-1">{{ $t("notifications.bySession") }}</span>
                  <span
                    class="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200"
                    >{{ log.lock.sessionName || log.lock.sessionId }}</span
                  >
                </p>
                <p class="text-xs text-slate-400 mt-2 font-medium">
                  {{ new Date(log.timestamp).toLocaleString() }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
