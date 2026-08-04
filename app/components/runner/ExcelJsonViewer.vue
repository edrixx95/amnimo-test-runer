<script setup lang="ts">
/* eslint-disable */
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  jsonUrl: string;
  sessionName?: string;
  htmlReportUrl?: string;
}>();

const emit = defineEmits(["update:modelValue", "openHtmlReport"]);

type HistoryEntry = {
  label: string;
  result: string;
  status: string;
  htmlReportUrl: string | null;
};

type FlatTestRow = {
  category: string;
  page: string;
  testId: string;
  result: string;
  model: string;
  serial: string;
  date: string;
  fw: string;
  history?: HistoryEntry[];
  playwrightTestId?: string;
};

const isLoading = ref(false);
const error = ref("");
const flatTests = ref<FlatTestRow[]>([]);
const searchQuery = ref("");
const activeFilter = ref<"all" | "passed" | "failed" | "skipped">("all");
const activeBoard = ref("all");

const expandedRows = ref<string[]>([]);

const toggleRow = (row: FlatTestRow) => {
  if (!row.history || row.history.length === 0) return;
  const idx = expandedRows.value.indexOf(row.testId);
  if (idx !== -1) {
    expandedRows.value.splice(idx, 1);
  } else {
    expandedRows.value.push(row.testId);
  }
};

const uniqueBoards = computed(() => {
  const boards = new Set<string>();
  flatTests.value.forEach((r) => {
    if (r.model && r.model !== "-") boards.add(r.model);
  });
  return Array.from(boards).sort();
});

const summary = computed(() => {
  const filtered =
    activeBoard.value === "all"
      ? flatTests.value
      : flatTests.value.filter((r) => r.model === activeBoard.value);

  const total = filtered.length;
  const pass = filtered.filter((r) =>
    r.result.toLowerCase().includes("pass"),
  ).length;
  const fail = filtered.filter((r) =>
    r.result.toLowerCase().includes("fail"),
  ).length;
  const skip = filtered.filter(
    (r) =>
      r.result.toLowerCase().includes("skip") ||
      r.result.toLowerCase().includes("pend"),
  ).length;
  return { total, pass, fail, skip };
});

const displayedTests = computed(() => {
  return flatTests.value.filter((row) => {
    // 0. Check board filter
    if (activeBoard.value !== "all" && row.model !== activeBoard.value)
      return false;

    // 1. Check tab filter
    const r = row.result.toLowerCase();
    if (activeFilter.value === "passed" && !r.includes("pass")) return false;
    if (activeFilter.value === "failed" && !r.includes("fail")) return false;
    if (
      activeFilter.value === "skipped" &&
      !(r.includes("skip") || r.includes("pend"))
    )
      return false;

    // 2. Check search query
    if (searchQuery.value.trim() !== "") {
      const q = searchQuery.value.toLowerCase();
      const searchable =
        `${row.testId} ${row.category} ${row.page} ${row.model} ${row.fw}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    return true;
  });
});

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen && props.jsonUrl) {
      isLoading.value = true;
      error.value = "";
      flatTests.value = [];
      try {
        const data = await $fetch<any>(props.jsonUrl);

        const rows: FlatTestRow[] = [];
        if (data && Array.isArray(data.categories)) {
          for (const cat of data.categories) {
            if (Array.isArray(cat.pages)) {
              for (const page of cat.pages) {
                if (Array.isArray(page.tests)) {
                  for (const test of page.tests) {
                    rows.push({
                      category: cat.category || "-",
                      page: page.page || "-",
                      testId: test["test-id"] || "-",
                      result: test["latest_result"] || test["result"] || "-",
                      model: test["test-device-model"] || "-",
                      serial: test["test-device-serial"] || "-",
                      date: test["test-date"] || "-",
                      fw: test["test-fw"] || "-",
                      history: test["history"],
                      playwrightTestId: test["playwright-test-id"] || "",
                    });
                  }
                }
              }
            }
          }
        }
        flatTests.value = rows;
      } catch (e: any) {
        console.error("Failed to parse json", e);
        error.value = t("excelJsonViewer.errorFailedToLoad", {
          msg: e.message,
        });
      } finally {
        isLoading.value = false;
      }
    }
  },
);

const getResultClass = (res: string) => {
  const r = res.toLowerCase();
  if (r.includes("pass"))
    return "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200 hover:border-emerald-300";
  if (r.includes("fail"))
    return "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200 hover:border-rose-300";
  if (r.includes("skip") || r.includes("pend"))
    return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 hover:border-amber-300";
  return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:border-slate-300";
};

const isFlaky = (row: FlatTestRow) => {
  if (!row.history || row.history.length < 2) return false;
  const latestResult = row.result.toLowerCase();
  if (!latestResult.includes("pass")) return false;
  // If latest is pass, check if any previous history was fail
  return row.history.some((h) => h.result.toLowerCase().includes("fail"));
};

const downloadHref = computed(() => {
  if (props.jsonUrl.includes("aggregated-report")) {
    return props.jsonUrl.replace(
      "aggregated-report",
      "download-aggregated-report",
    );
  }
  return props.jsonUrl;
});

const defaultFileName = computed(() => {
  if (props.sessionName) return `${props.sessionName}-report.json`;
  const match = props.jsonUrl.match(/sessions\/([^\/]+)/);
  const sessionId = match ? match[1] : "session";
  return `${sessionId}-report.json`;
});

import { useToast } from "~/composables/useToast";
const toast = useToast();

const showSaveDialog = ref(false);

const openSaveDialog = () => {
  showSaveDialog.value = true;
};

const onSaveDialogConfirm = async (selectedPath: string) => {
  try {
    const data = await $fetch(downloadHref.value);

    await $fetch("/api/utils/save-file", {
      method: "POST",
      body: {
        path: selectedPath,
        content: data,
      },
    });

    toast.addToast({
      title: "Success",
      message: `File saved to ${selectedPath}`,
      type: "success",
    });
  } catch (err: any) {
    console.error(err);
    toast.addToast({
      title: "Error",
      message: err.data?.statusMessage || err.message || "Failed to save file",
      type: "error",
    });
  }
};
</script>

<template>
  <Transition name="modal">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <div
        class="modal-backdrop fixed inset-0 bg-slate-900/60 backdrop-blur-sm transform-gpu will-change-opacity"
        @click="$emit('update:modelValue', false)"
      />
      <div
        class="modal-content relative bg-white rounded-2xl shadow-glass w-[95vw] h-[90vh] max-w-[1600px] flex flex-col overflow-hidden"
      >
        <div
          class="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0"
        >
          <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon
              name="heroicons:table-cells"
              class="w-6 h-6 text-emerald-500"
            />
            {{ $t("excelJsonViewer.title") }}
          </h3>
          <div class="flex items-center gap-3">
            <button
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:text-amnimo-600 hover:border-amnimo-200 transition-all shadow-sm active:scale-95"
              @click="openSaveDialog"
            >
              <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
              {{ $t("excelJsonViewer.downloadJson") }}
            </button>
            <button
              class="text-slate-400 hover:text-amnimo-600 bg-slate-50 hover:bg-amnimo-50 p-2 rounded-xl transition-colors"
              @click="$emit('update:modelValue', false)"
            >
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          class="flex flex-1 flex-row relative overflow-hidden bg-slate-50 rounded-b-2xl"
        >
          <div
            class="p-0 overflow-hidden flex flex-col flex-1 relative z-10 transition-all duration-300"
          >
            <div
              v-if="!isLoading && !error && flatTests.length > 0"
              class="px-8 py-4 bg-white border-b border-slate-200 flex flex-col gap-4 shrink-0 shadow-sm z-20 relative"
            >
              <div
                class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div class="relative max-w-md w-full">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <Icon
                      name="heroicons:magnifying-glass"
                      class="w-5 h-5 text-slate-400"
                    />
                  </div>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-1 focus:ring-amnimo-500 focus:border-amnimo-500 focus:bg-white transition-colors"
                    :placeholder="$t('excelJsonViewer.search')"
                  />
                </div>

                <div class="inline-flex rounded-lg shadow-sm" role="group">
                  <button
                    :class="[
                      activeFilter === 'all'
                        ? 'bg-slate-100 text-slate-800 border-slate-300 z-10'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
                      'relative px-4 py-2 text-sm font-medium border rounded-l-lg focus:outline-none transition-colors flex items-center gap-2',
                    ]"
                    @click="activeFilter = 'all'"
                  >
                    {{ $t("excelJsonViewer.all") }}
                    <span
                      class="bg-slate-200 text-slate-700 py-0.5 px-2 rounded-full text-xs font-bold"
                      >{{ summary.total }}</span
                    >
                  </button>
                  <button
                    :class="[
                      activeFilter === 'passed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 z-10'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
                      'relative -ml-px px-4 py-2 text-sm font-medium border focus:outline-none transition-colors flex items-center gap-2',
                    ]"
                    @click="activeFilter = 'passed'"
                  >
                    <Icon
                      name="heroicons:check"
                      class="w-4 h-4 text-emerald-500"
                    />
                    {{ $t("excelJsonViewer.passed") }}
                    <span
                      class="bg-emerald-100 text-emerald-800 py-0.5 px-2 rounded-full text-xs font-bold"
                      >{{ summary.pass }}</span
                    >
                  </button>
                  <button
                    :class="[
                      activeFilter === 'failed'
                        ? 'bg-rose-50 text-rose-800 border-rose-300 z-10'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
                      'relative -ml-px px-4 py-2 text-sm font-medium border focus:outline-none transition-colors flex items-center gap-2',
                    ]"
                    @click="activeFilter = 'failed'"
                  >
                    <Icon
                      name="heroicons:x-mark"
                      class="w-4 h-4 text-rose-500"
                    />
                    {{ $t("excelJsonViewer.failed") }}
                    <span
                      class="bg-rose-100 text-rose-800 py-0.5 px-2 rounded-full text-xs font-bold"
                      >{{ summary.fail }}</span
                    >
                  </button>
                  <button
                    :class="[
                      activeFilter === 'skipped'
                        ? 'bg-slate-100 text-slate-800 border-slate-300 z-10'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
                      'relative -ml-px px-4 py-2 text-sm font-medium border rounded-r-lg focus:outline-none transition-colors flex items-center gap-2',
                    ]"
                    @click="activeFilter = 'skipped'"
                  >
                    <Icon
                      name="heroicons:no-symbol"
                      class="w-4 h-4 text-slate-500"
                    />
                    {{ $t("excelJsonViewer.skipped") }}
                    <span
                      class="bg-slate-200 text-slate-700 py-0.5 px-2 rounded-full text-xs font-bold"
                      >{{ summary.skip }}</span
                    >
                  </button>
                </div>
              </div>

              <!-- Board Tabs -->
              <div
                v-if="uniqueBoards.length > 1"
                class="flex gap-2 overflow-x-auto custom-scrollbar pb-1"
              >
                <button
                  :class="[
                    activeBoard === 'all'
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
                    'px-4 py-1.5 text-sm font-bold border rounded-lg transition-all whitespace-nowrap',
                  ]"
                  @click="activeBoard = 'all'"
                >
                  {{ $t("excelJsonViewer.allBoards") }}
                </button>
                <button
                  v-for="board in uniqueBoards"
                  :key="board"
                  :class="[
                    activeBoard === board
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
                    'px-4 py-1.5 text-sm font-bold border rounded-lg transition-all whitespace-nowrap',
                  ]"
                  @click="activeBoard = board"
                >
                  {{ board }}
                </button>
              </div>
            </div>
            <div
              v-if="isLoading"
              class="flex flex-col items-center justify-center h-64 text-amnimo-400 gap-4"
            >
              <AppLoader size="sm" text="" />
              <span class="font-bold text-slate-600">{{
                $t("excelJsonViewer.loadingData")
              }}</span>
            </div>

            <div
              v-else-if="error"
              class="p-8 flex flex-col items-center justify-center h-64 text-rose-500 gap-4"
            >
              <div
                class="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-2 border border-rose-100"
              >
                <Icon
                  name="heroicons:exclamation-triangle"
                  class="w-8 h-8 text-rose-400"
                />
              </div>
              <span class="font-bold text-rose-700">{{ error }}</span>
            </div>

            <div v-else class="flex-1 overflow-auto custom-scrollbar">
              <table class="min-w-full divide-y divide-slate-200">
                <thead
                  class="bg-slate-100/80 sticky top-0 shadow-sm z-10 backdrop-blur-md"
                >
                  <tr>
                    <th
                      scope="col"
                      class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      {{ $t("excelJsonViewer.testId") }}
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      {{ $t("excelJsonViewer.category") }}
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      {{ $t("excelJsonViewer.page") }}
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      {{ $t("excelJsonViewer.result") }}
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      {{ $t("excelJsonViewer.model") }}
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      {{ $t("excelJsonViewer.date") }}
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                      {{ $t("excelJsonViewer.firmware") }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-slate-100">
                  <tr v-if="displayedTests.length === 0" key="empty-state">
                    <td
                      colspan="7"
                      class="px-6 py-16 text-center text-sm font-medium text-slate-400 bg-slate-50/50"
                    >
                      <div
                        class="flex flex-col items-center justify-center w-full"
                      >
                        <Icon
                          name="heroicons:inbox"
                          class="w-12 h-12 mb-3 opacity-30"
                        />
                        <span>{{ $t("excelJsonViewer.noTestsMatch") }}</span>
                      </div>
                    </td>
                  </tr>
                  <template
                    v-for="(row, idx) in displayedTests"
                    :key="row.testId + '-' + idx"
                  >
                    <tr
                      class="transition-colors group cursor-pointer"
                      :class="
                        expandedRows.includes(row.testId)
                          ? 'bg-slate-50'
                          : 'hover:bg-slate-50/80'
                      "
                      @click="toggleRow(row)"
                    >
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700 font-mono flex items-center gap-2"
                      >
                        <Icon
                          v-if="row.history && row.history.length > 0"
                          :name="
                            expandedRows.includes(row.testId)
                              ? 'heroicons:chevron-down'
                              : 'heroicons:chevron-right'
                          "
                          class="w-4 h-4 text-slate-400 transition-transform"
                        />
                        <span v-else class="w-4 h-4 inline-block"></span>
                        {{ row.testId }}
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800"
                      >
                        {{ row.category }}
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600"
                      >
                        {{ row.page }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <!-- Super Tag for history -->
                        <div
                          v-if="row.history && row.history.length > 0"
                          class="relative inline-flex items-center"
                        >
                          <button
                            :class="[
                              getResultClass(row.result),
                              isFlaky(row)
                                ? 'ring-2 ring-orange-400 ring-offset-1'
                                : '',
                            ]"
                            class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-300 cursor-pointer hover:shadow-sm active:scale-95"
                            title="Click to view run history"
                            @click.stop="toggleRow(row)"
                          >
                            {{ row.result }}
                            <Icon
                              v-if="isFlaky(row)"
                              name="heroicons:exclamation-triangle"
                              class="ml-1.5 w-3.5 h-3.5 text-orange-600"
                            />
                          </button>
                          <div
                            v-if="row.history.length > 1"
                            class="absolute -top-2 -right-2 flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-[10px] font-bold text-white shadow-sm ring-2 ring-white cursor-pointer z-10 transition-transform hover:scale-110"
                            :class="
                              isFlaky(row) ? 'bg-orange-500' : 'bg-slate-500'
                            "
                            @click.stop="toggleRow(row)"
                          >
                            {{ row.history.length }}
                          </div>
                        </div>

                        <!-- No history, just direct link -->
                        <button
                          v-else-if="htmlReportUrl"
                          :class="getResultClass(row.result)"
                          class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-300 cursor-pointer hover:shadow-sm hover:ring-2 hover:ring-opacity-50 active:scale-95"
                          :title="$t('reportModal.htmlReport')"
                          @click.stop="
                            $emit(
                              'openHtmlReport',
                              htmlReportUrl +
                                (row.playwrightTestId
                                  ? '#?testId=' + row.playwrightTestId
                                  : ''),
                            )
                          "
                        >
                          {{ row.result }}
                        </button>
                        <span
                          v-else
                          :class="getResultClass(row.result)"
                          class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border transition-colors duration-300"
                        >
                          {{ row.result }}
                        </span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600"
                      >
                        {{ row.model }}
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600"
                      >
                        {{ row.date }}
                      </td>
                      <td
                        class="px-6 py-4 text-sm font-medium text-slate-600 max-w-[200px] truncate"
                        :title="row.fw"
                      >
                        {{ row.fw }}
                      </td>
                    </tr>

                    <!-- Expanded Row Content -->
                    <tr v-if="expandedRows.includes(row.testId)">
                      <td
                        colspan="7"
                        class="p-0 bg-slate-50 border-b border-slate-200"
                      >
                        <div class="expand-enter overflow-hidden origin-top">
                          <div class="pl-[4.5rem] pr-8 py-5">
                            <table class="w-full">
                              <thead>
                                <tr>
                                  <th
                                    class="py-2.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 w-1/3"
                                  >
                                    Run #
                                  </th>
                                  <th
                                    class="py-2.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 w-1/3"
                                  >
                                    Result
                                  </th>
                                  <th
                                    class="py-2.5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 w-1/3"
                                  >
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody class="divide-y divide-slate-200/60">
                                <tr
                                  v-for="(hist, hIdx) in [
                                    ...row.history!,
                                  ].reverse()"
                                  :key="hIdx"
                                  class="hover:bg-slate-100/50 transition-colors"
                                >
                                  <td
                                    class="py-3 whitespace-nowrap text-sm font-semibold text-slate-700"
                                  >
                                    Run {{ row.history!.length - hIdx }}
                                    <span
                                      v-if="hIdx === 0"
                                      class="ml-2 bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                                      >Latest</span
                                    >
                                  </td>
                                  <td class="py-3 whitespace-nowrap">
                                    <span
                                      :class="getResultClass(hist.result)"
                                      class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border"
                                    >
                                      {{ hist.result }}
                                    </span>
                                  </td>
                                  <td class="py-3 whitespace-nowrap text-right">
                                    <button
                                      v-if="hist.htmlReportUrl"
                                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-white hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200 hover:border-indigo-200 shadow-sm"
                                      @click.stop="
                                        $emit(
                                          'openHtmlReport',
                                          hist.htmlReportUrl,
                                        )
                                      "
                                    >
                                      <Icon
                                        name="heroicons:document-text"
                                        class="w-4 h-4"
                                      />
                                      View Report
                                    </button>
                                    <span
                                      v-else
                                      class="text-xs text-slate-400 italic"
                                      >No report available</span
                                    >
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <FolderPickerDialog
    v-model="showSaveDialog"
    mode="save"
    initial-path="__DOWNLOADS__"
    :default-filename="defaultFileName"
    @select="onSaveDialogConfirm"
  />
</template>

<style scoped>
.expand-enter {
  animation: expandDown 0.3s ease-out forwards;
}

@keyframes expandDown {
  0% {
    opacity: 0;
    transform: scaleY(0.95);
    max-height: 0;
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
    max-height: 800px;
  }
}

.list-enter-active,
.list-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Removed position: absolute on leave-active to prevent table layout thrashing which causes lag */
</style>
