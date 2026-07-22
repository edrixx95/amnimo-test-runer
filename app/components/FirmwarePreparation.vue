<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div
        class="flex items-center gap-3 transition-colors duration-300"
        :class="allReady ? 'text-emerald-700' : 'text-slate-900'"
      >
        <Icon
          name="heroicons:cpu-chip"
          class="w-6 h-6"
          :class="allReady ? 'text-emerald-500' : 'text-amnimo-600'"
        />
        <h4 class="font-bold text-lg">FWファイル準備</h4>
      </div>
      <div class="flex items-center gap-2">
        <span
          v-if="isCheckingStatus"
          class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium"
        >
          <AppSpinner size="sm" /> Checking...
        </span>
        <span
          v-else-if="allReady"
          class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-sm font-bold shadow-sm shadow-emerald-200/50 scale-105 origin-right transition-transform"
        >
          <Icon name="heroicons:check-badge" class="w-5 h-5 text-emerald-600" />
          <span class="tracking-wide uppercase text-xs"
            >All Setup Complete</span
          >
        </span>
      </div>
    </div>

    <div
      class="space-y-4 transition-all duration-500"
      :class="{ 'opacity-60 grayscale-[30%]': allReady }"
    >
      <!-- Local Files Section -->
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
        <h5
          class="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2"
        >
          <Icon name="heroicons:folder-arrow-down" class="w-4 h-4" /> 1.
          ローカル配置 (Local Upload Dir)
        </h5>

        <div class="grid gap-3">
          <!-- File Item Template -->
          <div
            v-for="fw in [prevFw, testFw]"
            :key="fw"
            class="bg-white border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            :class="
              filesStatus[fw]
                ? 'border-emerald-200 bg-emerald-50/30'
                : 'border-amber-200'
            "
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 shrink-0 rounded-full flex items-center justify-center"
                :class="
                  filesStatus[fw]
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-amber-100 text-amber-600'
                "
              >
                <Icon
                  :name="
                    filesStatus[fw]
                      ? 'heroicons:document-check'
                      : 'heroicons:document-text'
                  "
                  class="w-5 h-5"
                />
              </div>
              <div class="min-w-0">
                <div class="text-xs font-semibold text-slate-500 mb-0.5">
                  {{ fw === prevFw ? "Previous Version" : "Test Version" }}
                </div>
                <div
                  class="text-sm font-bold text-slate-800 truncate"
                  :title="fw"
                >
                  {{ fw }}
                </div>
              </div>
            </div>

            <div class="flex items-center shrink-0 gap-2">
              <template v-if="downloadProgress[fw] !== undefined">
                <div class="w-32">
                  <div class="flex justify-between text-xs font-medium text-slate-500 mb-1">
                    <span>Downloading...</span>
                    <span>{{ downloadProgress[fw] }}%</span>
                  </div>
                  <div class="w-full bg-slate-200 rounded-full h-2">
                    <div class="bg-amnimo-500 h-2 rounded-full transition-all duration-300" :style="{ width: `${downloadProgress[fw]}%` }"></div>
                  </div>
                </div>
              </template>

              <template v-else-if="uploading[fw] || isGettingFromServer[fw]">
                <AppSpinner size="sm" />
                <span class="text-sm text-slate-600 font-medium">{{ isGettingFromServer[fw] ? "Copying..." : "Uploading..." }}</span>
              </template>

              <template v-else-if="filesStatus[fw]?.local">
                <span class="inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
                  <Icon name="heroicons:check" class="w-4 h-4" /> Ready
                </span>
              </template>



              <template v-else-if="filesStatus[fw]?.server">
                <button
                  type="button"
                  @click="copyFromServer(fw)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amnimo-700 bg-amnimo-50 border border-amnimo-200 rounded-lg hover:bg-amnimo-100 transition-colors"
                >
                  <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" /> Sync
                  from Server
                </button>
              </template>

              <template v-else>
                <input
                  type="file"
                  :ref="(el) => (fileInputs[fw] = el as HTMLInputElement)"
                  class="hidden"
                  accept=".amf"
                  @change="(e) => handleUpload(e, fw)"
                />
                <button
                  type="button"
                  @click="fileInputs[fw]?.click()"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Icon name="heroicons:arrow-up-tray" class="w-4 h-4" /> Upload
                </button>
                <button
                  type="button"
                  @click="startDownload(fw)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amnimo-700 bg-amnimo-50 border border-amnimo-200 rounded-lg hover:bg-amnimo-100 transition-colors"
                >
                  <Icon name="heroicons:cloud-arrow-down" class="w-4 h-4" />
                  Download
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Server Push Section -->
      <div
        class="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4"
        :class="{ 'opacity-50 pointer-events-none': !localReady }"
      >
        <h5
          class="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2"
        >
          <Icon name="heroicons:server" class="w-4 h-4" /> 2. サーバー配置
          (Server Placement)
        </h5>
        <p class="text-xs text-slate-500">
          Copy the prepared firmware files to your local HTTP/TFTP server
          directory so the device can fetch them.
        </p>

        <div class="flex gap-3">
          <div class="relative flex-1 flex">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"
            >
              <Icon
                name="heroicons:folder-open"
                class="w-5 h-5 text-slate-400"
              />
            </div>
            <input
              type="text"
              v-model="serverPath"
              placeholder="e.g. C:\Users\Public\Downloads"
              class="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-l-xl text-sm focus:ring-amnimo-500 focus:border-amnimo-500 z-0"
            />
            <button
              type="button"
              @click="browseFolder"
              class="px-4 py-2.5 bg-slate-100 border border-l-0 border-slate-300 text-slate-700 hover:bg-slate-200 rounded-r-xl transition-colors font-bold text-sm flex items-center shrink-0 disabled:opacity-50"
              :disabled="isBrowsing"
            >
              <Icon
                v-if="isBrowsing"
                name="heroicons:arrow-path"
                class="w-5 h-5 animate-spin"
              />
              <span v-else>Browse</span>
            </button>
          </div>

          <button
            type="button"
            @click="copyToServer"
            :disabled="!serverPath || isCopying || serverReady"
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all shrink-0"
            :class="
              serverReady
                ? 'bg-green-600 hover:bg-green-600'
                : 'bg-slate-800 hover:bg-slate-900'
            "
          >
            <AppSpinner v-if="isCopying" size="sm" />
            <template v-else-if="serverReady">
              <Icon name="heroicons:check" class="w-5 h-5" />
              <p class="text-white">Ready</p>
            </template>
            <template v-else>
              <Icon name="heroicons:document-duplicate" class="w-5 h-5" /> Sync
              from Local
            </template>
          </button>
        </div>

        <!-- Error message -->
        <div
          v-if="copyError"
          class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700 flex items-start gap-2"
        >
          <Icon
            name="heroicons:exclamation-triangle"
            class="w-5 h-5 shrink-0 mt-0.5"
          />
          <span>{{ copyError }}</span>
        </div>
      </div>
    </div>

    <FolderPickerDialog
      v-model="isDialogVisible"
      :initial-path="serverPath"
      @select="handleFolderSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";

const props = defineProps<{
  prevFw: string;
  testFw: string;
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
}>();

const isCheckingStatus = ref(true);
const filesStatus = ref<Record<string, { local: boolean; server: boolean }>>(
  {},
);
const fileInputs = ref<Record<string, HTMLInputElement | null>>({});

const downloadProgress = ref<Record<string, number>>({});
const uploading = ref<Record<string, boolean>>({});
const isGettingFromServer = ref<Record<string, boolean>>({});

const serverPath = ref("");
const isCopying = ref(false);
const serverReady = ref(false);
const copyError = ref("");
const isBrowsing = ref(false);
const isDialogVisible = ref(false);

let pollInterval: ReturnType<typeof setInterval>;

const handleFocus = () => {
  checkStatus(true);
};

onMounted(() => {
  const savedPath = localStorage.getItem("amnimo_server_path");
  if (savedPath) serverPath.value = savedPath;
  checkStatus();

  // Background polling every 5 seconds
  pollInterval = setInterval(() => {
    checkStatus(true);
  }, 5000);

  // Check immediately when user switches back to browser from File Explorer
  window.addEventListener("focus", handleFocus);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
  window.removeEventListener("focus", handleFocus);
});

watch(serverPath, async (newVal) => {
  localStorage.setItem("amnimo_server_path", newVal);
  await checkStatus();
});

const localReady = computed(() => {
  const isBusy = (fw: string) => downloadProgress.value[fw] !== undefined || uploading.value[fw] || isGettingFromServer.value[fw];
  
  return (
    props.prevFw &&
    props.testFw &&
    filesStatus.value[props.prevFw]?.local &&
    !isBusy(props.prevFw) &&
    filesStatus.value[props.testFw]?.local &&
    !isBusy(props.testFw)
  );
});

const allReady = computed(() => {
  return localReady.value && serverReady.value;
});

watch(allReady, (ready) => {
  emit("update:modelValue", ready);
});

async function checkStatus(silent = false) {
  if (!silent) isCheckingStatus.value = true;
  try {
    const res = await $fetch<
      Record<string, { local: boolean; server: boolean }>
    >(`/api/firmware/status`, {
      query: {
        fw1: props.prevFw,
        fw2: props.testFw,
        serverPath: serverPath.value,
      },
    });
    filesStatus.value = res;
    await checkServerStatus(true);
  } catch (err) {
    console.error(err);
  } finally {
    if (!silent) isCheckingStatus.value = false;
  }
}

async function checkServerStatus(silent = false) {
  if (!serverPath.value || !props.prevFw || !props.testFw) {
    serverReady.value = false;
    return;
  }
  try {
    const res = await $fetch<{ allExist: boolean }>(
      "/api/firmware/server-status",
      {
        method: "POST",
        body: {
          destinationPath: serverPath.value,
          files: [props.prevFw, props.testFw],
        },
      },
    );
    serverReady.value = res.allExist;
  } catch {
    serverReady.value = false;
  }
}

async function handleUpload(event: Event, filename: string) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  if (file.name !== filename) {
    alert(`Tên file không khớp! Yêu cầu tải lên file: ${filename}`);
    return;
  }

  uploading.value[filename] = true;
  try {
    await $fetch(
      `/api/firmware/upload?filename=${encodeURIComponent(filename)}`,
      {
        method: "POST",
        body: file,
        headers: {
          "Content-Type": "application/octet-stream",
        },
      },
    );
    await checkStatus();
  } catch (err: any) {
    alert(`Lỗi upload: ${err.message}`);
  } finally {
    uploading.value[filename] = false;
    input.value = ""; // Reset
  }
}

function startDownload(filename: string) {
  downloadProgress.value[filename] = 0;

  const eventSource = new EventSource(
    `/api/firmware/download?filename=${encodeURIComponent(filename)}`,
  );

  eventSource.addEventListener("progress", (e) => {
    try {
      const data = JSON.parse(e.data);
      downloadProgress.value[filename] = data.progress;
    } catch {}
  });

  eventSource.addEventListener("complete", async () => {
    eventSource.close();
    delete downloadProgress.value[filename];
    await checkStatus();
  });

  eventSource.addEventListener("error", (e: any) => {
    eventSource.close();
    delete downloadProgress.value[filename];
    try {
      const data = JSON.parse(e.data);
      alert(`Lỗi tải xuống: ${data.message}`);
    } catch {
      alert(`Lỗi kết nối tải xuống`);
    }
  });
}

async function copyToServer() {
  if (!serverPath.value) return;

  isCopying.value = true;
  copyError.value = "";

  try {
    await $fetch("/api/firmware/copy", {
      method: "POST",
      body: {
        destinationPath: serverPath.value,
        files: [props.prevFw, props.testFw],
      },
    });
    serverReady.value = true;
  } catch (err: any) {
    console.error(err);
    copyError.value =
      err.data?.statusMessage ||
      err.message ||
      "Lỗi không xác định khi copy file.";
  } finally {
    isCopying.value = false;
  }
}

function browseFolder() {
  isDialogVisible.value = true;
}

function handleFolderSelected(path: string) {
  serverPath.value = path;
}

async function copyFromServer(filename: string) {
  isGettingFromServer.value[filename] = true;
  try {
    await $fetch("/api/firmware/copy-from-server", {
      method: "POST",
      body: {
        sourcePath: serverPath.value,
        files: [filename],
      },
    });
    await checkStatus();
  } catch (err: any) {
    alert(`Lỗi copy từ server: ${err.message}`);
  } finally {
    isGettingFromServer.value[filename] = false;
  }
}
</script>
