<template>
  <Transition name="modal">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div
        class="modal-backdrop fixed inset-0 bg-slate-900/60 backdrop-blur-sm transform-gpu will-change-opacity"
        @click="$emit('update:modelValue', false)"
      ></div>
      <div
        class="modal-content relative bg-white rounded-2xl shadow-glass w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
      >
        <div
          class="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0"
        >
          <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon
              name="heroicons:document-chart-bar"
              class="w-6 h-6 text-amnimo-500"
            />
            {{ $t("reportModal.testReports") }}
          </h3>
          <div class="flex items-center gap-3">
            <button
              @click="$emit('update:modelValue', false)"
              class="text-slate-400 hover:text-amnimo-600 bg-slate-50 hover:bg-amnimo-50 p-2 rounded-xl transition-colors"
            >
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          class="p-8 overflow-y-auto flex-1 bg-slate-50/50 min-h-[300px] custom-scrollbar"
        >
          <div
            v-if="isLoading"
            class="flex flex-col items-center justify-center h-full text-amnimo-400 gap-4"
          >
            <AppLoader size="md" :text="$t('reportModal.loadingReport')" />
            <span class="font-bold text-slate-600">{{
              $t("reportModal.searchingForReports")
            }}</span>
          </div>

          <div
            v-else-if="reports.length === 0"
            class="flex flex-col items-center justify-center h-full text-slate-400 gap-4"
          >
            <div
              class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100"
            >
              <Icon name="heroicons:inbox" class="w-10 h-10 text-slate-300" />
            </div>
            <p class="font-bold text-slate-800 text-lg">
              {{ $t("reportModal.noReportsFound") }}
            </p>
            <p
              class="text-sm font-medium text-slate-500 text-center max-w-sm leading-relaxed"
            >
              {{ $t("reportModal.reportsGeneratedAuto") }}
            </p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="report in reports"
              :key="report.id"
              class="bg-white border border-slate-200 hover:border-amnimo-300 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 shadow-sm hover:shadow-soft group"
            >
              <div>
                <h4
                  class="font-bold text-slate-900 flex items-center gap-2 text-lg group-hover:text-amnimo-700 transition-colors"
                >
                  <Icon
                    name="heroicons:folder-open"
                    class="w-5 h-5 text-amnimo-400"
                  />
                  {{ report.name }}
                </h4>
                <div class="flex items-center gap-3 mt-1.5 pl-7">
                  <p
                    class="text-sm font-medium text-slate-600 flex items-center gap-1.5"
                  >
                    <Icon
                      name="heroicons:clock"
                      class="w-4 h-4 text-slate-400"
                    />
                    {{ new Date(report.createdAt).toLocaleString() }}
                  </p>

                  <!-- Status Badges -->
                  <div
                    v-if="report.totalCount !== undefined"
                    class="flex gap-2"
                  >
                    <span
                      v-if="report.failedCount && report.failedCount > 0"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200"
                    >
                      <Icon name="heroicons:x-circle" class="w-3.5 h-3.5" />
                      {{ report.failedCount }} {{ $t("reportModal.failed") }}
                    </span>
                    <span
                      v-else-if="
                        report.totalCount > 0 && report.failedCount === 0
                      "
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200"
                    >
                      <Icon name="heroicons:check-circle" class="w-3.5 h-3.5" />
                      {{ $t("reportModal.allPassed") }} ({{
                        report.totalCount
                      }})
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap gap-3 sm:shrink-0">
                <button
                  v-if="report.failedCount && report.failedCount > 0"
                  @click="rerunFailedTests(report.name)"
                  :disabled="isRerunning"
                  class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 hover:text-amber-800 transition-colors shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <Icon
                    v-if="isRerunning"
                    name="heroicons:arrow-path"
                    class="w-5 h-5 animate-spin"
                  />
                  <Icon
                    v-else
                    name="heroicons:arrow-path-rounded-square"
                    class="w-5 h-5"
                  />
                  {{ $t("reportModal.rerunFailed") }}
                </button>
                <button
                  v-if="report.htmlReportUrl"
                  @click="openHtmlViewer(report.htmlReportUrl)"
                  class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-amnimo-600 transition-colors shadow-sm active:scale-95"
                >
                  <Icon name="heroicons:chart-bar-square" class="w-5 h-5" />
                  {{ $t("reportModal.htmlReport") }}
                </button>
                <button
                  v-if="report.excelJsonUrl"
                  @click="openJsonViewer(report.excelJsonUrl)"
                  class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-amnimo-600 border border-transparent rounded-xl hover:bg-amnimo-700 transition-colors shadow-sm hover:shadow-lg hover:shadow-amnimo-500/30 active:scale-95"
                >
                  <Icon name="heroicons:table-cells" class="w-5 h-5" />
                  {{ $t("reportModal.viewData") }}
                </button>
                <button
                  @click="reportToDelete = report"
                  class="inline-flex items-center justify-center w-9 h-9 text-slate-400 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-sm active:scale-95"
                  :title="$t('reportModal.deleteReportTitle')"
                >
                  <Icon name="heroicons:trash" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <Transition name="modal">
          <div
            v-if="reportToDelete"
            class="absolute inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div
              class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm rounded-2xl"
              @click="reportToDelete = null"
            ></div>
            <div
              class="relative bg-white border border-slate-200 shadow-xl rounded-2xl p-6 max-w-sm w-full mx-4 text-center transform transition-all"
            >
              <div
                class="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100"
              >
                <Icon name="heroicons:exclamation-triangle" class="w-8 h-8" />
              </div>
              <h4 class="text-lg font-bold text-slate-900 mb-2">
                {{ $t("reportModal.deleteReportConfirmTitle") }}
              </h4>
              <p class="text-sm text-slate-500 mb-6 leading-relaxed">
                {{ $t("reportModal.deleteReportConfirmText1") }}
                <b class="text-slate-700">{{ reportToDelete.name }}</b
                >{{ $t("reportModal.deleteReportConfirmText2") }}
              </p>
              <div class="flex gap-3 justify-center">
                <button
                  @click="reportToDelete = null"
                  class="px-5 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors active:scale-95"
                >
                  {{ $t("reportModal.cancel") }}
                </button>
                <button
                  @click="confirmDeleteReport"
                  :disabled="isDeleting"
                  class="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <Icon
                    v-if="isDeleting"
                    name="heroicons:arrow-path"
                    class="w-4 h-4 animate-spin"
                  />
                  <Icon v-else name="heroicons:trash" class="w-4 h-4" />
                  {{ $t("reportModal.delete") }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <ExcelJsonViewer v-model="isJsonViewerOpen" :jsonUrl="activeJsonUrl" />
      <HtmlReportViewer v-model="isHtmlViewerOpen" :url="activeHtmlUrl" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "~/composables/useToast";

const { t } = useI18n();
const { addToast } = useToast();
import { useRouter } from "vue-router";
import ExcelJsonViewer from "~/components/ExcelJsonViewer.vue";

const router = useRouter();

const props = defineProps<{
  modelValue: boolean;
  sessionId: string;
}>();

const emit = defineEmits(["update:modelValue"]);

type ReportData = {
  id: string;
  name: string;
  createdAt: string;
  excelJsonUrl?: string;
  htmlReportUrl?: string;
  failedCount?: number;
  passedCount?: number;
  totalCount?: number;
};

const isLoading = ref(false);
const reports = ref<ReportData[]>([]);

const isJsonViewerOpen = ref(false);
const activeJsonUrl = ref("");

const openJsonViewer = (url: string) => {
  activeJsonUrl.value = url;
  isJsonViewerOpen.value = true;
};

const isHtmlViewerOpen = ref(false);
const activeHtmlUrl = ref("");

const openHtmlViewer = (url: string) => {
  activeHtmlUrl.value = url;
  isHtmlViewerOpen.value = true;
};

const fetchReports = async () => {
  if (props.sessionId) {
    isLoading.value = true;
    try {
      reports.value = await $fetch<ReportData[]>(
        `/api/sessions/${props.sessionId}/reports`,
      );
    } catch (e) {
      console.error("Failed to load reports", e);
      reports.value = [];
    } finally {
      isLoading.value = false;
    }
  }
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      fetchReports();
    }
  },
);

const isRerunning = ref(false);

const rerunFailedTests = async (reportName: string) => {
  if (!props.sessionId || isRerunning.value) return;
  isRerunning.value = true;
  try {
    await $fetch("/api/tests/run", {
      method: "POST",
      body: {
        sessionId: props.sessionId,
        testType: "release",
        mode: "rerun-failed",
        sessionName: reportName,
      },
    });
    emit("update:modelValue", false);
    router.push(`/sessions/${props.sessionId}/runner`);
  } catch (e: any) {
    addToast({
      title: t("reportModal.error"),
      message: t("reportModal.failedToRerun") + e.message,
      type: "error",
    });
  } finally {
    isRerunning.value = false;
  }
};

const reportToDelete = ref<ReportData | null>(null);
const isDeleting = ref(false);

const confirmDeleteReport = async () => {
  if (!reportToDelete.value || isDeleting.value) return;
  isDeleting.value = true;
  try {
    await $fetch("/api/reports/delete", {
      method: "POST",
      body: { reportId: reportToDelete.value.id },
    });
    // Successfully deleted, refresh list
    await fetchReports();
  } catch (e: any) {
    addToast({
      title: t("reportModal.error"),
      message:
        t("reportModal.failedToDelete") + (e.data?.statusMessage || e.message),
      type: "error",
    });
  } finally {
    isDeleting.value = false;
    reportToDelete.value = null;
  }
};
</script>
