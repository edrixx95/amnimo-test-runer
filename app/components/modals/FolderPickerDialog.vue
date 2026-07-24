/* eslint-disable @typescript-eslint/no-explicit-any */
<script setup lang="ts">
/* eslint-disable */
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  initialPath?: string;
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

const isLoading = ref(false);
const errorMsg = ref("");

// Watch visibility
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      selectedFolder.value = null;
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
  // If a folder is selected in the list, use that path.
  // Otherwise, use the current viewed path (inputPath).
  emit("select", inputPath.value || currentPath.value);
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
        class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col transform transition-all border border-slate-200"
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
              <Icon name="heroicons:folder-open" class="w-4 h-4" />
            </div>
            <div>
              <h3 class="font-bold text-slate-800">
                {{ $t("folderPicker.selectFolder") }}
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
          >
          <button
            class="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-sm shrink-0"
            @click="navigateTo(inputPath)"
          >
            {{ $t("folderPicker.go") }}
          </button>
        </div>

        <!-- Folder List -->
        <div class="flex-1 h-[40vh] min-h-[300px] overflow-y-auto p-2 bg-white">
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
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-1">
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
          </div>
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
              {{ $t("folderPicker.selectFolder") }}
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
</style>
