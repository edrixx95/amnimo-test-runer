<script setup lang="ts">
/* eslint-disable */
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  initialPath?: string;
  mode?: "select" | "save";
  defaultFilename?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "select", path: string): void;
}>();

const currentPath = ref("");
const inputPath = ref("");
const parentPath = ref<string | null>(null);
const folders = ref<string[]>([]);
const selectedFolder = ref<string | null>(null);
const fileName = ref("");

const isLoading = ref(false);
const errorMsg = ref("");

// Watch visibility
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      selectedFolder.value = null;
      fileName.value = props.defaultFilename || "";
      loadDirectory(props.initialPath || currentPath.value || "");
    }
  },
);

async function loadDirectory(pathStr: string) {
  isLoading.value = true;
  errorMsg.value = "";
  try {
    const res = await $fetch<{
      currentPath: string;
      parentPath: string | null;
      folders: string[];
    }>("/api/utils/list-dir", {
      query: { path: pathStr },
    });
    currentPath.value = res.currentPath;
    inputPath.value = res.currentPath;
    parentPath.value = res.parentPath;
    folders.value = res.folders;
    selectedFolder.value = null;
  } catch (err: any) {
    errorMsg.value =
      err.data?.statusMessage ||
      err.message ||
      t("folderPicker.cannotAccessFolder");
  } finally {
    isLoading.value = false;
  }
}

function selectFolder(folder: string) {
  selectedFolder.value = folder;
  // Auto-fill the input path to show the full combined path
  inputPath.value = currentPath.value.replace(/[\\/]$/, "") + "\\" + folder;
}

function navigateToFolder(folder: string) {
  const newPath = currentPath.value.replace(/[\\/]$/, "") + "\\" + folder;
  loadDirectory(newPath);
}

function navigateTo(pathStr: string) {
  loadDirectory(pathStr);
}

function goUp() {
  if (parentPath.value) {
    loadDirectory(parentPath.value);
  }
}

function close() {
  emit("update:modelValue", false);
}

function confirm() {
  const basePath = inputPath.value || currentPath.value;
  if (props.mode === "save") {
    const separator = basePath.match(/[\\/]/)?.[0] || "\\";
    const fullPath =
      basePath.replace(/[\\/]$/, "") +
      separator +
      (fileName.value || "report.json");
    emit("select", fullPath);
  } else {
    emit("select", basePath);
  }
  close();
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] h-[650px] flex flex-col transform transition-all border border-slate-200"
        @click.stop
      >
        <!-- Header -->
        <div
          class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-amnimo-100 text-amnimo-600 flex items-center justify-center"
            >
              <Icon
                :name="
                  mode === 'save'
                    ? 'heroicons:document-arrow-down'
                    : 'heroicons:folder-open'
                "
                class="w-4 h-4"
              />
            </div>
            <div>
              <h3 class="font-bold text-slate-800">
                {{
                  mode === "save"
                    ? "Save File As..."
                    : $t("folderPicker.selectFolder")
                }}
              </h3>
              <p
                class="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-sm"
                :title="currentPath"
              >
                {{ currentPath }}
              </p>
            </div>
          </div>
          <button
            class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            @click="close"
          >
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>

        <!-- Path Breadcrumb / Input -->
        <div class="px-5 py-3 border-b border-slate-100 flex gap-2">
          <button
            :disabled="!parentPath"
            class="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-50 flex items-center gap-1 shrink-0"
            :title="$t('folderPicker.goUpOneLevel')"
            @click="goUp"
          >
            <Icon name="heroicons:arrow-up" class="w-4 h-4" />
          </button>
          <input
            v-model="inputPath"
            type="text"
            class="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-mono focus:ring-amnimo-500 focus:border-amnimo-500"
            :placeholder="$t('folderPicker.enterPathManually')"
            @keyup.enter="navigateTo(inputPath)"
          />
          <button
            class="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-sm shrink-0"
            @click="navigateTo(inputPath)"
          >
            {{ $t("folderPicker.go") }}
          </button>
        </div>

        <!-- Folder List -->
        <div class="flex-1 min-h-0 overflow-y-auto p-2 bg-white">
          <div
            v-if="isLoading"
            class="h-full flex items-center justify-center text-slate-400 gap-2"
          >
            <AppSpinner size="sm" /> {{ $t("folderPicker.loading") }}
          </div>
          <div
            v-else-if="errorMsg"
            class="h-full flex items-center justify-center text-rose-500 gap-2 px-6 text-center"
          >
            <Icon
              name="heroicons:exclamation-circle"
              class="w-5 h-5 shrink-0"
            />
            <span class="text-sm font-medium">{{ errorMsg }}</span>
          </div>
          <div
            v-else-if="folders.length === 0"
            class="h-full flex items-center justify-center text-slate-400 text-sm"
          >
            {{ $t("folderPicker.folderEmpty") }}
          </div>
          <TransitionGroup
            v-else
            tag="div"
            name="list"
            class="grid grid-cols-1 sm:grid-cols-2 gap-1"
          >
            <button
              v-for="folder in folders"
              :key="folder"
              class="flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors group"
              :class="
                selectedFolder === folder
                  ? 'bg-amnimo-50 text-amnimo-900 ring-1 ring-amnimo-200'
                  : 'hover:bg-slate-50 text-slate-700'
              "
              @click="selectFolder(folder)"
              @dblclick="navigateToFolder(folder)"
            >
              <Icon
                :name="
                  selectedFolder === folder
                    ? 'heroicons:folder-open'
                    : 'heroicons:folder'
                "
                class="w-5 h-5 shrink-0 transition-colors"
                :class="
                  selectedFolder === folder
                    ? 'text-amnimo-500'
                    : 'text-slate-400 group-hover:text-amber-400'
                "
              />
              <span class="text-sm truncate select-none">{{ folder }}</span>
            </button>
          </TransitionGroup>
        </div>

        <!-- Filename Input for Save Mode -->
        <div
          v-if="mode === 'save'"
          class="px-5 py-3 border-t border-slate-100 flex items-center gap-3 bg-white"
        >
          <label class="text-sm font-bold text-slate-700 shrink-0"
            >File name:</label
          >
          <input
            v-model="fileName"
            type="text"
            class="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-mono focus:ring-amnimo-500 focus:border-amnimo-500"
            placeholder="Enter file name"
          />
        </div>

        <!-- Footer -->
        <div
          class="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between"
        >
          <div class="text-xs text-slate-500 flex items-center gap-1.5">
            <Icon name="heroicons:information-circle" class="w-4 h-4" />
            {{ $t("folderPicker.clickHint") }}
          </div>
          <div class="flex gap-3">
            <button
              class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold text-sm transition-colors"
              @click="close"
            >
              {{ $t("folderPicker.cancel") }}
            </button>
            <button
              class="px-5 py-2 rounded-xl bg-amnimo-600 text-white hover:bg-amnimo-700 font-bold text-sm shadow-sm transition-all shadow-amnimo-200"
              @click="confirm"
            >
              {{ mode === "save" ? "Save" : $t("folderPicker.selectFolder") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active > div {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from > div {
  transform: scale(0.95) translateY(10px);
}

/* Folder List Transition */
.list-enter-active,
.list-leave-active {
  transition: all 0.25s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
.list-leave-active {
  position: absolute;
}
</style>
