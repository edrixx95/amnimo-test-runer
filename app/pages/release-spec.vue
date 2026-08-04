<template>
  <div class="h-full flex flex-col bg-slate-50 relative">
    <!-- Header -->
    <header
      class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm"
    >
      <div class="flex items-center gap-3">
        <div class="p-2 bg-amnimo-50 text-amnimo-600 rounded-lg">
          <Icon name="heroicons:document-text" class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-900 leading-tight">
            Release Spec
          </h1>
          <p class="text-sm text-slate-500 font-medium">
            Generate and manage Excel test specifications
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="showSessionSelector = true"
          class="inline-flex items-center gap-2 px-4 py-2 bg-amnimo-600 text-white text-sm font-semibold rounded-lg hover:bg-amnimo-700 transition-colors shadow-sm focus:ring-2 focus:ring-amnimo-500 focus:ring-offset-2"
        >
          <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
          {{ $t("common.importResult", "Import Test Results") }}
        </button>
      </div>
    </header>

    <!-- Main Content Layout -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left: Template Preview -->
      <div
        class="flex-1 flex flex-col bg-white overflow-hidden m-4 rounded-xl border border-slate-200 shadow-sm"
      >
        <div
          class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50"
        >
          <h2 class="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Icon name="heroicons:eye" class="w-4 h-4 text-slate-400" />
            Preview:
            <span class="font-normal text-amnimo-600 truncate max-w-sm">{{
              currentPreviewFile || "Template (リリーステスト_試験仕様書)"
            }}</span>
          </h2>
          <div class="flex items-center gap-2">
            <div
              class="text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200"
            >
              Only showing selected sheets (first 50 rows)
            </div>
          </div>
        </div>

        <div
          v-if="loadingPreview"
          class="flex-1 flex flex-col items-center justify-center text-slate-400"
        >
          <Icon
            name="svg-spinners:ring-resize"
            class="w-8 h-8 mb-3 text-amnimo-500"
          />
          <p class="text-sm">Loading template...</p>
        </div>
        <div
          v-else-if="previewSheets.length === 0"
          class="flex-1 flex flex-col items-center justify-center text-slate-400"
        >
          <Icon name="heroicons:document-minus" class="w-8 h-8 mb-3" />
          <p class="text-sm">No sheets found in template.</p>
        </div>
        <div v-else class="flex-1 flex flex-col min-h-0">
          <!-- Tabs -->
          <div
            class="flex overflow-x-auto border-b border-slate-200 scrollbar-hide shrink-0 bg-slate-50/30"
          >
            <button
              v-for="(sheet, index) in previewSheets"
              :key="index"
              @click="activeSheet = index"
              :class="[
                'px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                activeSheet === index
                  ? 'border-amnimo-500 text-amnimo-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50',
              ]"
            >
              {{ sheet.name }}
            </button>
          </div>

          <!-- Sheet Content -->
          <div
            class="flex-1 bg-slate-50/50 p-6 flex flex-col overflow-hidden relative"
          >
            <Transition name="slide-fade" mode="out-in">
              <div
                :key="activeSheet"
                class="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden w-full h-full"
              >
                <div class="flex-1 overflow-auto custom-scrollbar">
                  <div
                    :class="[
                      'w-max min-w-full',
                      previewSheets[activeSheet].name === 'progress'
                        ? 'pr-8'
                        : '',
                    ]"
                  >
                    <table class="border-collapse w-full">
                      <tbody>
                        <tr
                          v-for="row in previewSheets[activeSheet].rows"
                          :key="row.index"
                          class="group hover:bg-slate-50 transition-colors"
                        >
                          <td
                            v-for="(cellObj, cIndex) in row.cells"
                            :key="cIndex"
                            class="px-4 py-2.5 text-xs border-b border-r align-top leading-relaxed transition-colors duration-300"
                            :class="[
                              previewSheets[activeSheet].name === 'progress'
                                ? 'min-w-[70px] max-w-[250px]'
                                : 'min-w-[120px] max-w-[300px]',
                              getCellClass(
                                previewSheets[activeSheet].name,
                                row,
                                Number(cIndex),
                                cellObj,
                                activeTableBounds,
                              ),
                            ]"
                          >
                            <div
                              :class="
                                !isInsideTable(
                                  previewSheets[activeSheet].name,
                                  row.index,
                                  Number(cIndex),
                                  activeTableBounds,
                                )
                                  ? 'w-0 whitespace-nowrap overflow-visible'
                                  : 'break-words whitespace-pre-wrap'
                              "
                            >
                              {{ cellObj.value }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Right: Generated Files list -->
      <div
        class="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)]"
      >
        <div
          class="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between"
        >
          <h2 class="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Icon
              name="heroicons:folder-arrow-down"
              class="w-4 h-4 text-slate-400"
            />
            Generated Reports
          </h2>
          <button
            @click="loadGeneratedFiles"
            class="p-1.5 text-slate-400 hover:text-amnimo-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="Refresh list"
          >
            <Icon
              name="heroicons:arrow-path"
              class="w-4 h-4"
              :class="{ 'animate-spin': loadingFiles }"
            />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-3 flex flex-col">
          <div
            v-if="loadingFiles"
            class="flex-1 flex flex-col items-center justify-center p-4"
          >
            <Icon
              name="svg-spinners:3-dots-bounce"
              class="w-6 h-6 text-slate-400"
            />
          </div>
          <div
            v-else-if="generatedFiles.length === 0"
            class="flex-1 flex flex-col items-center justify-center text-center p-6 text-sm text-slate-400"
          >
            <Icon
              name="heroicons:document"
              class="w-8 h-8 mx-auto mb-2 opacity-20"
            />
            No reports generated yet.
          </div>

          <!-- File Items -->
          <TransitionGroup name="list" tag="div" class="space-y-2">
            <div
              v-for="file in generatedFiles"
              :key="file.name"
              @click="loadPreview(file.name)"
              class="group p-3 border rounded-xl bg-white hover:border-amnimo-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              :class="
                currentPreviewFile === file.name
                  ? 'border-amnimo-500 ring-1 ring-amnimo-500 bg-slate-50/50'
                  : 'border-slate-200'
              "
            >
              <div class="flex items-start gap-3">
                <div
                  class="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0"
                >
                  <Icon name="vscode-icons:file-type-excel" class="w-5 h-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <p
                    class="text-xs font-semibold text-slate-700 truncate"
                    :title="file.name"
                  >
                    {{ file.name }}
                  </p>
                  <p class="text-[10px] text-slate-400 mt-0.5">
                    {{ new Date(file.updatedAt).toLocaleString() }} &middot;
                    {{ (file.size / 1024).toFixed(1) }} KB
                  </p>
                </div>
              </div>
              <div class="mt-3 flex gap-2">
                <button
                  @click.stop="exportFile(file.path, file.name)"
                  class="flex-1 py-1.5 text-xs font-medium bg-slate-50 text-slate-600 rounded-md border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                >
                  Export
                </button>
                <button
                  @click.stop="deleteFile(file.name)"
                  class="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-md border border-red-100 hover:bg-red-100 hover:text-red-700 transition-colors"
                  title="Delete Report"
                >
                  <Icon name="heroicons:trash" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>

    <!-- Session Selector Dialog -->
    <Teleport to="body">
      <div
        v-if="showSessionSelector"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      >
        <div
          class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          @click="showSessionSelector = false"
        ></div>
        <div
          class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
        >
          <div
            class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50"
          >
            <div>
              <h3 class="text-base font-bold text-slate-800">Select Session</h3>
              <p class="text-xs text-slate-500 mt-0.5">
                Select a completed session to extract test results.
              </p>
            </div>
            <button
              @click="showSessionSelector = false"
              class="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-lg transition-colors"
            >
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 border-b border-slate-100">
            <label class="block text-sm font-semibold text-slate-700 mb-1"
              >Tester Name (実施者)</label
            >
            <input
              v-model="testerName"
              type="text"
              placeholder="Enter your name"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-amnimo-500 focus:border-amnimo-500 text-sm"
            />
          </div>

          <div class="p-6 overflow-y-auto flex-1">
            <div
              v-if="closedSessions.length === 0"
              class="text-center py-8 text-sm text-slate-500"
            >
              No closed or completed sessions available.
            </div>
            <div v-else class="space-y-2">
              <label
                v-for="session in closedSessions"
                :key="session.id"
                class="flex items-start p-3 border rounded-xl cursor-pointer transition-colors"
                :class="
                  selectedSessionIds.includes(session.id)
                    ? 'border-amnimo-500 bg-amnimo-50/50 ring-1 ring-amnimo-500'
                    : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                "
              >
                <div class="flex items-center h-5">
                  <input
                    type="checkbox"
                    :value="session.id"
                    v-model="selectedSessionIds"
                    class="w-4 h-4 text-amnimo-600 bg-slate-100 border-slate-300 rounded focus:ring-amnimo-500 focus:ring-2"
                  />
                </div>
                <div class="ml-3 flex-1 min-w-0">
                  <span
                    class="block text-sm font-semibold text-slate-900 truncate"
                  >
                    {{ session.name || session.id }}
                  </span>
                  <span class="block text-xs text-slate-500 mt-0.5">
                    Device: {{ session.board || "Unknown" }} &middot; Status:
                    {{ session.status }}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div
            class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0"
          >
            <button
              @click="showSessionSelector = false"
              class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="generateReport"
              :disabled="selectedSessionIds.length === 0 || generating"
              class="px-5 py-2 text-sm font-semibold text-white bg-amnimo-600 rounded-lg transition-colors flex items-center gap-2"
              :class="
                selectedSessionIds.length === 0 || generating
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-amnimo-700 shadow-sm'
              "
            >
              <Icon
                v-if="generating"
                name="svg-spinners:180-ring"
                class="w-4 h-4"
              />
              {{
                generating
                  ? "Generating..."
                  : `Generate ${selectedSessionIds.length || ""} Reports`
              }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Folder Picker for Export -->
    <FolderPickerDialog
      v-model="showExportDialog"
      mode="save"
      :defaultFileName="exportFileName"
      @confirm="handleExportConfirm"
    />

    <!-- Confirm Delete Modal -->
    <ConfirmModal
      v-model="showConfirmDelete"
      title="Delete Report"
      :message="`Are you sure you want to delete ${fileToDelete}?`"
      confirmText="Delete"
      type="danger"
      :isLoading="deleting"
      @confirm="performDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useSessionStore } from "~/composables/session/useSessionStore";
import { useToast } from "~/composables/useToast";
import FolderPickerDialog from "~/components/modals/FolderPickerDialog.vue";
import ConfirmModal from "~/components/modals/ConfirmModal.vue";

// Preview State
const loadingPreview = ref(false);
const previewSheets = ref<any[]>([]);
const activeSheet = ref(0);
const currentPreviewFile = ref("");

// Files State
const loadingFiles = ref(false);
const generatedFiles = ref<any[]>([]);

// Dialog State
const showSessionSelector = ref(false);
const selectedSessionIds = ref<string[]>([]);
const testerName = ref("Amnimo Tester");
const generating = ref(false);
const toast = useToast();

const sessionStore = useSessionStore();

// Export Dialog State
const showExportDialog = ref(false);
const exportFileName = ref("");
const exportSourcePath = ref("");

const closedSessions = computed(() => {
  return sessionStore.sessions
    .filter(
      (s) =>
        s.status === "Closed" ||
        s.status === "Completed" ||
        s.status === "Failed",
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
});

const isHeaderRow = (sheetName: string, rowIndex: number) => {
  if (sheetName === "progress") return rowIndex === 3;
  return rowIndex === 2;
};

const isEmpty = (val: any) => val === "" || val === undefined || val === null;

const activeTableBounds = computed(() => {
  const sheet = previewSheets.value[activeSheet.value];
  if (!sheet) return null;

  const headerRowIndex = sheet.name === "progress" ? 3 : 2;
  const headerRow = sheet.rows.find((r: any) => r.index === headerRowIndex);

  let bottomRowIndex = 50;
  if (sheet.name === "progress") {
    const totalRow = sheet.rows.find((r: any) =>
      r.cells.some((c: any) => c.value === "Total"),
    );
    if (totalRow) bottomRowIndex = totalRow.index;
  } else {
    for (let i = sheet.rows.length - 1; i >= 0; i--) {
      if (
        sheet.rows[i].index > headerRowIndex &&
        !isEmpty(sheet.rows[i].cells[1]?.value)
      ) {
        bottomRowIndex = sheet.rows[i].index;
        break;
      }
    }
  }

  return { headerRow, bottomRowIndex };
});

const isInsideTable = (
  sheetName: string,
  rowIndex: number,
  cIndex: number,
  bounds: any,
) => {
  if (!bounds || !bounds.headerRow) return false;
  if (rowIndex < bounds.headerRow.index) return false;
  if (rowIndex > bounds.bottomRowIndex) return false;

  if (sheetName !== "progress" && cIndex === 0) return true;

  if (isEmpty(bounds.headerRow.cells[cIndex]?.value)) return false;
  return true;
};

const getCellClass = (
  sheetName: string,
  row: any,
  cIndex: number,
  cellObj: any,
  bounds: any,
) => {
  const isHeader = isHeaderRow(sheetName, row.index);
  const inside = isInsideTable(sheetName, row.index, cIndex, bounds);

  let classes = [];

  if (isHeader) {
    if (inside) {
      classes.push(
        "sticky top-0 z-20 bg-amnimo-600 text-white font-semibold tracking-wide",
      );
    } else {
      classes.push("sticky top-0 z-20 bg-white border-transparent");
    }
  } else {
    // Not header
    if (cellObj.value === "ƒ(Auto-calc)") {
      classes.push("text-indigo-500 italic font-medium");
    } else {
      classes.push("text-slate-700");
    }

    // Background and borders
    if (inside) {
      if (isEmpty(cellObj.value)) {
        classes.push("bg-slate-50/50");
      } else {
        classes.push("bg-white");
      }
      classes.push("border-slate-300"); // inner frame

      if (sheetName !== "progress" && cIndex === 0) {
        classes.push("!border-r-1"); // Remove vertical separator
      }
    } else {
      classes.push("bg-white border-transparent");
    }
  }

  // Outer Borders (only if inside table)
  if (inside) {
    // Left edge (cIndex === 0 or left cell is outside)
    if (
      sheetName === "progress" &&
      (cIndex === 0 || !isInsideTable(sheetName, row.index, cIndex - 1, bounds))
    ) {
      classes.push("border-l-2 border-l-amnimo-600");
    }
    // Right edge (right cell is outside)
    if (
      sheetName === "progress" &&
      !isInsideTable(sheetName, row.index, cIndex + 1, bounds)
    ) {
      classes.push("border-r-2 border-r-amnimo-600");
    }
    // Top edge (header)
    if (row.index === bounds.headerRow.index) {
      classes.push("border-t-2 border-t-amnimo-600");
    }
    // Bottom edge
    if (sheetName === "progress" && row.index === bounds.bottomRowIndex) {
      classes.push("border-b-2 border-b-amnimo-600");
    }
  }

  // Conditional formatting overrides
  const condClass = getConditionalFormatClass(sheetName, cIndex, cellObj.value);
  if (condClass) {
    // Remove any previous text or bg colors to allow conditional formatting to take precedence
    classes = classes.filter(
      (c) => !c.startsWith("bg-") && !c.startsWith("text-"),
    );
    classes.push(condClass);
    if (inside) classes.push("border-slate-300"); // ensure inner frame remains
  }

  return classes.join(" ");
};

onMounted(async () => {
  sessionStore.fetchSessions();
  await loadGeneratedFiles();
  if (generatedFiles.value.length > 0) {
    loadPreview(generatedFiles.value[0].name);
  } else {
    loadPreview();
  }
});

const getConditionalFormatClass = (
  sheetName: string,
  cIndex: number,
  value: any,
) => {
  if (value === undefined || value === null || value === "") return "";

  if (sheetName === "progress") {
    const num = Number(value);
    if (isNaN(num) || num <= 0) return "";

    if (cIndex === 8 || cIndex === 11) {
      // Fail (Index 8) and 1次Fail (Index 11)
      return "bg-red-100 text-red-900 font-bold";
    }
    if (cIndex === 9 || cIndex === 12) {
      // Skip (Index 9) and 2次Skip (Index 12)
      return "bg-yellow-100 text-yellow-900 font-bold";
    }
  } else if (sheetName.includes("【GUI】")) {
    if (cIndex === 9) {
      // Result column (Index 9 / Col J)
      const strVal = String(value).trim().toLowerCase();
      if (strVal === "pass" || strVal === "at-pass") {
        return "bg-emerald-100 text-emerald-900 font-bold";
      }
      if (strVal === "fail") {
        return "bg-red-100 text-red-900 font-bold";
      }
      if (strVal === "skip") {
        return "bg-yellow-100 text-yellow-900 font-bold";
      }
    }
  }
  return "";
};

const loadPreview = async (fileName?: string) => {
  loadingPreview.value = true;
  try {
    const query = fileName ? `?file=${encodeURIComponent(fileName)}` : "";
    const res = await $fetch(`/api/spec/preview${query}`);
    previewSheets.value = res as any[];
    if (fileName) currentPreviewFile.value = fileName;
  } catch (error) {
    console.error(error);
    toast.addToast({
      title: "Error",
      message: "Failed to load preview",
      type: "error",
    });
  } finally {
    loadingPreview.value = false;
  }
};

const loadGeneratedFiles = async () => {
  loadingFiles.value = true;
  try {
    const res = await $fetch("/api/spec/list");
    generatedFiles.value = res as any[];
  } catch (error) {
    console.error(error);
  } finally {
    loadingFiles.value = false;
  }
};

const generateReport = async () => {
  if (selectedSessionIds.value.length === 0) return;
  generating.value = true;
  try {
    const res = await $fetch("/api/spec/generate", {
      method: "POST",
      body: {
        sessionIds: selectedSessionIds.value,
        testerName: testerName.value,
      },
    });

    const count = (res as any).files?.length || 0;
    toast.addToast({
      title: "Success",
      message: `Generated ${count} reports successfully!`,
      type: "success",
    });

    showSessionSelector.value = false;
    selectedSessionIds.value = [];
    await loadGeneratedFiles(); // refresh list

    // Automatically preview the first generated file
    if (count > 0 && (res as any).files[0]?.fileName) {
      loadPreview((res as any).files[0].fileName);
    }
  } catch (error: any) {
    console.error(error);
    toast.addToast({
      title: "Error",
      message: error.message || "Failed to generate report",
      type: "error",
    });
  } finally {
    generating.value = false;
  }
};

const exportFile = (sourcePath: string, name: string) => {
  exportSourcePath.value = sourcePath;
  exportFileName.value = name;
  showExportDialog.value = true;
};

const handleExportConfirm = async (targetDirPath: string, fileName: string) => {
  try {
    await $fetch("/api/utils/save-file", {
      method: "POST",
      body: {
        sourcePath: exportSourcePath.value,
        targetDir: targetDirPath,
        fileName: fileName,
        isCopy: true, // Important: Add support for copying existing files in save-file.post.ts!
      },
    });
    toast.addToast({
      title: "Success",
      message: "File exported successfully!",
      type: "success",
    });
  } catch (error: any) {
    console.error("Export error", error);
    toast.addToast({
      title: "Error",
      message: error.message || "Failed to export file",
      type: "error",
    });
  }
};

const showConfirmDelete = ref(false);
const fileToDelete = ref("");
const deleting = ref(false);

const deleteFile = (fileName: string) => {
  fileToDelete.value = fileName;
  showConfirmDelete.value = true;
};

const performDelete = async () => {
  deleting.value = true;
  try {
    await $fetch("/api/spec/delete", {
      method: "DELETE",
      body: { fileName: fileToDelete.value },
    });
    toast.addToast({
      title: "Success",
      message: "File deleted successfully!",
      type: "success",
    });

    if (currentPreviewFile.value === fileToDelete.value) {
      currentPreviewFile.value = "";
      loadPreview();
    }

    await loadGeneratedFiles();
    showConfirmDelete.value = false;
  } catch (error: any) {
    console.error(error);
    toast.addToast({
      title: "Error",
      message: error.message || "Failed to delete file",
      type: "error",
    });
  } finally {
    deleting.value = false;
  }
};
</script>

<style>
/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition:
    opacity 0.25s ease-out,
    transform 0.25s ease-out;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(15px);
}
.list-leave-active {
  position: absolute;
}

/* Hide scrollbar completely but keep functionality */
.custom-scrollbar::-webkit-scrollbar {
  display: none !important;
}
.custom-scrollbar {
  -ms-overflow-style: none !important; /* IE and Edge */
  scrollbar-width: none !important; /* Firefox */
}
</style>
