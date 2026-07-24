<template>
  <div class="flex h-screen w-full font-sans bg-slate-50">
    <!-- Sidebar -->
    <aside
      class="bg-white border-r border-gray-100 shadow-soft flex flex-col z-10 transition-[width] duration-300 ease-out relative"
      :style="{ width: isCollapsed ? '80px' : '256px' }"
    >
      <!-- Logo Section as Toggle Button -->
      <button
        @click="toggleSidebar"
        class="h-16 w-full flex items-center border-b border-gray-100 bg-white overflow-hidden shrink-0 relative hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
        title="Toggle Sidebar"
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

        <!-- Add more nav items here in the future following the same pattern -->
      </nav>

      <!-- Bottom Settings Link (Fixed above footer) -->
      <div class="p-3 border-t border-gray-100 bg-white">
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
            @click="toggleLocale"
            class="text-xs font-bold text-slate-500 hover:text-amnimo-600 transition-colors bg-white px-2 py-1 rounded shadow-sm border border-slate-200"
            title="Toggle Language"
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
            @click="toggleLocale"
            class="text-[10px] font-bold text-slate-500 hover:text-amnimo-600 transition-colors bg-white px-2 py-1 rounded shadow-sm border border-slate-200"
            title="Toggle Language"
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
            @click="activeDownload = null"
            class="text-slate-400 hover:text-slate-600"
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
          ></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const { locale, setLocale } = useI18n();

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

  if ((window as any).electronAPI) {
    try {
      appVersion.value = await (window as any).electronAPI.getAppVersion();
    } catch (e) {
      console.error("Failed to get app version", e);
    }

    (window as any).electronAPI.onDownloadProgress((data: any) => {
      activeDownload.value = data;
    });

    (window as any).electronAPI.onDownloadComplete((data: any) => {
      if (activeDownload.value) {
        activeDownload.value.state = data.state;
        activeDownload.value.received = activeDownload.value.total;

        // Auto hide after 5 seconds if completed successfully
        if (data.state === "completed") {
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
