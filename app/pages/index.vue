<script setup lang="ts">
import { useSessionList } from "~/composables/sessions/useSessionList";
import { useSessionActions } from "~/composables/sessions/useSessionActions";
import { useReportViewers } from "~/composables/sessions/useReportViewers";
import { useConfirmModal } from "~/composables/ui/useConfirmModal";

const {
  sessionStore,
  searchQuery,
  filterStatus,
  filterDevice,
  dateRange,
  sortBy,
  uniqueDevices,
  filteredSessions,
  resetFilters,
  getStatusClass,
} = useSessionList();

const {
  isModalOpen,
  newSessionName,
  isCreating,
  openCreateModal,
  closeModal,
  handleCreateSession,
  handleDeleteSession,
  handleCloseSession,
  navigateToSession,
} = useSessionActions();

const {
  showReportModal,
  reportSessionId,
  showDataViewer,
  dataViewerUrl,
  showHtmlReport,
  htmlReportUrl,
  openReport,
  openHtmlReportDialog,
} = useReportViewers();

const { confirmModal, executeConfirm } = useConfirmModal();
</script>

<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden relative">
    <header
      class="h-16 flex items-center px-8 border-b border-gray-100 bg-white shrink-0 shadow-sm z-10 relative"
    >
      <h2 class="text-xl font-semibold text-slate-800 tracking-tight">
        {{ $t("home.title") }}
      </h2>
    </header>

    <div class="flex-1 p-8 overflow-auto bg-slate-50/50">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8 flex justify-between items-center animate-fade-in-up">
          <div>
            <h3 class="text-2xl font-bold text-slate-900 tracking-tight">
              {{ $t("home.activeSessions") }}
            </h3>
            <p class="text-slate-500 mt-1">{{ $t("home.description") }}</p>
          </div>
          <button
            @click="openCreateModal"
            class="inline-flex items-center gap-2 bg-amnimo-600 hover:bg-amnimo-700 hover:shadow-lg hover:shadow-amnimo-500/30 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Icon name="heroicons:plus" class="w-5 h-5" />
            {{ $t("home.newSession") }}
          </button>
        </div>

        <!-- Filter Toolbar -->
        <div
          class="relative z-20 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4 animate-fade-in-up"
          style="animation-delay: 0.05s"
        >
          <!-- Search -->
          <div class="flex-1 min-w-[200px] relative">
            <Icon
              name="heroicons:magnifying-glass"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('home.searchPlaceholder')"
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-amnimo-500 focus:ring-1 focus:ring-amnimo-500 transition-all outline-none"
            />
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap items-center gap-3">
            <CustomSelect
              v-model="filterStatus"
              :options="[
                { label: 'All Statuses', value: 'All' },
                { label: 'Draft', value: 'Draft' },
                { label: 'Preparing', value: 'Preparing' },
                { label: 'Ready', value: 'Ready' },
                { label: 'Running', value: 'Running' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Failed', value: 'Failed' },
                { label: 'Closed', value: 'Closed' },
              ]"
            />

            <CustomSelect
              v-model="filterDevice"
              :options="[
                { label: $t('home.allDevices'), value: 'All' },
                ...uniqueDevices.map((d: string) => ({ label: d, value: d })),
              ]"
            />

            <div
              class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:bg-white focus-within:border-amnimo-500 transition-colors shadow-sm"
              title="Filter by Created Date"
            >
              <Icon name="heroicons:calendar" class="w-4 h-4 text-slate-400" />
              <input
                v-model="dateRange.start"
                type="date"
                class="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
              />
              <span class="text-slate-400 text-xs font-medium">{{
                $t("home.to")
              }}</span>
              <input
                v-model="dateRange.end"
                type="date"
                class="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
              />
              <!-- Clear date button -->
              <button
                v-if="dateRange.start || dateRange.end"
                @click="dateRange = { start: '', end: '' }"
                class="ml-1 text-slate-400 hover:text-rose-500"
                title="Clear Dates"
              >
                <Icon name="heroicons:x-mark" class="w-4 h-4" />
              </button>
            </div>

            <div class="h-6 w-px bg-slate-200 mx-1"></div>

            <CustomSelect
              v-model="sortBy"
              icon="heroicons:arrows-up-down"
              :options="[
                { label: 'Newest First', value: 'Newest' },
                { label: 'Oldest First', value: 'Oldest' },
                { label: 'Name (A-Z)', value: 'Name (A-Z)' },
                { label: 'Name (Z-A)', value: 'Name (Z-A)' },
              ]"
            />
          </div>
        </div>

        <div v-if="sessionStore.isLoading" class="flex justify-center p-20">
          <AppLoader size="md" :text="$t('home.loading')" />
        </div>

        <div
          v-else-if="sessionStore.hasError"
          class="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 animate-fade-in"
        >
          {{ $t("home.loadError") }}
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up"
          style="animation-delay: 0.1s"
        >
          <div
            v-if="filteredSessions.length === 0"
            class="col-span-full p-12 text-center bg-white border border-dashed border-gray-200 rounded-2xl"
          >
            <div
              class="w-16 h-16 bg-amnimo-50 text-amnimo-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Icon name="heroicons:inbox" class="w-8 h-8" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-2">
              <span v-if="sessionStore.sessions.length > 0">{{
                $t("home.noMatch")
              }}</span>
              <span v-else>{{ $t("home.noActiveSessions") }}</span>
            </h3>
            <p class="text-slate-500 mb-6">
              <span v-if="sessionStore.sessions.length > 0">{{
                $t("home.tryAdjusting")
              }}</span>
              <span v-else>{{ $t("home.startFirstSession") }}</span>
            </p>
            <button
              v-if="sessionStore.sessions.length === 0"
              @click="openCreateModal"
              class="inline-flex items-center justify-center bg-amnimo-50 text-amnimo-700 hover:bg-amnimo-100 hover:text-amnimo-800 px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              {{ $t("home.newSession") }}
            </button>
            <button
              v-else
              @click="resetFilters"
              class="inline-flex items-center justify-center bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              {{ $t("home.clearFilters") }}
            </button>
          </div>

          <div
            v-for="session in filteredSessions"
            :key="session.id"
            @click="session.status !== 'Closed' && navigateToSession(session)"
            :class="[
              session.status === 'Closed'
                ? 'border-slate-300 bg-slate-200/80 opacity-80 grayscale'
                : 'bg-white shadow-soft hover:shadow-glass hover:border-amnimo-200 border-gray-100 hover:-translate-y-1 cursor-pointer',
              'group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300',
            ]"
          >
            <div
              class="px-5 py-4 border-b border-gray-50/80"
              :class="
                session.status === 'Closed' ? 'bg-transparent' : 'bg-white'
              "
            >
              <div class="flex justify-between items-start gap-2">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 mb-1.5">
                    <!-- Test Type Badge -->
                    <span
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border shadow-sm"
                      :class="{
                        'bg-purple-50 text-purple-700 border-purple-200':
                          session.testType === 'playground',
                        'bg-blue-50 text-blue-700 border-blue-200':
                          session.testType === 'system',
                        'bg-emerald-50 text-emerald-700 border-emerald-200':
                          !session.testType || session.testType === 'release',
                      }"
                    >
                      <Icon
                        :name="
                          session.testType === 'playground'
                            ? 'heroicons:beaker'
                            : session.testType === 'system'
                              ? 'heroicons:cube-transparent'
                              : 'heroicons:rocket-launch'
                        "
                        class="w-3 h-3"
                      />
                      {{ session.testType || "release" }}
                    </span>
                  </div>
                </div>
                <span
                  class="shrink-0 inline-flex items-center px-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm border"
                  :class="getStatusClass(session.status)"
                >
                  {{
                    $t(`home.status.${session.status.toLowerCase()}`) ||
                    session.status
                  }}
                </span>
              </div>
              <h3
                class="font-bold text-slate-900 line-clamp-2 tracking-tight text-lg leading-tight"
                :title="session.name || session.id"
              >
                {{ session.name || session.id }}
              </h3>
              <p class="text-xs text-slate-500 mt-1.5 font-bold">
                {{ new Date(session.createdAt).toLocaleString() }}
              </p>
            </div>

            <div
              class="px-5 py-4 space-y-3 flex-1 text-sm text-slate-600"
              :class="
                session.status === 'Closed'
                  ? 'bg-transparent'
                  : 'bg-slate-50/30'
              "
            >
              <div class="flex justify-between items-center">
                <span class="text-slate-500 font-bold">{{
                  $t("home.device")
                }}</span>
                <span class="font-bold text-slate-800">
                  {{ session.series || "-"
                  }}{{ session.board ? ` / ${session.board}` : ""
                  }}{{ session.deviceType ? ` (${session.deviceType})` : "" }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500 font-bold">{{
                  $t("home.baseUrl")
                }}</span>
                <span
                  class="font-bold text-slate-800 truncate max-w-[140px]"
                  :title="session.baseUrl"
                  >{{ session.baseUrl || "-" }}</span
                >
              </div>

              <div
                v-if="session.status === 'Running' && session.meta"
                class="pt-3 mt-3 border-t border-gray-200/50 space-y-2"
              >
                <div
                  class="flex justify-between items-center text-xs font-bold"
                >
                  <span class="text-slate-500">{{ $t("home.progress") }}</span>
                  <span class="text-slate-700"
                    >{{ session.meta.specCounts?.completed || 0 }} /
                    {{ session.meta.specCounts?.total || 0 }}
                    {{ $t("home.specs") }}</span
                  >
                </div>
                <div
                  class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden"
                >
                  <div
                    class="h-1.5 rounded-full transition-all duration-500"
                    :class="
                      session.meta.testCounts?.failed > 0
                        ? 'bg-red-500'
                        : session.meta.specCounts?.completed ===
                            session.meta.specCounts?.total
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                    "
                    :style="{
                      width: session.meta.specCounts?.total
                        ? `${(session.meta.specCounts.completed / session.meta.specCounts.total) * 100}%`
                        : '0%',
                    }"
                  ></div>
                </div>
                <div class="flex gap-2 pt-1">
                  <div
                    class="flex-1 flex items-center justify-center gap-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold py-1 border border-emerald-100/50"
                    title="Passed"
                  >
                    <Icon name="heroicons:check-circle" class="w-3 h-3" />
                    {{ session.meta.testCounts?.passed || 0 }}
                  </div>
                  <div
                    class="flex-1 flex items-center justify-center gap-1 bg-rose-50 text-rose-700 rounded-md text-[10px] font-bold py-1 border border-rose-100/50"
                    title="Failed"
                  >
                    <Icon name="heroicons:x-circle" class="w-3 h-3" />
                    {{ session.meta.testCounts?.failed || 0 }}
                  </div>
                  <div
                    class="flex-1 flex items-center justify-center gap-1 bg-amber-50 text-amber-700 rounded-md text-[10px] font-bold py-1 border border-amber-100/50"
                    title="Skipped"
                  >
                    <Icon name="heroicons:minus-circle" class="w-3 h-3" />
                    {{ session.meta.testCounts?.skipped || 0 }}
                  </div>
                </div>
              </div>
            </div>

            <div
              class="px-4 py-3 border-t border-gray-50 flex justify-between items-center gap-2"
              :class="
                session.status === 'Closed' ? 'bg-transparent' : 'bg-white'
              "
            >
              <div
                class="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <button
                  @click.stop="handleDeleteSession(session.id)"
                  class="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Session"
                >
                  <Icon name="heroicons:trash" class="w-4 h-4" />
                </button>
                <button
                  v-if="session.status !== 'Closed'"
                  @click.stop="handleCloseSession(session.id)"
                  class="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Close Session"
                >
                  <Icon name="heroicons:lock-closed" class="w-4 h-4" />
                </button>
              </div>
              <div class="flex gap-2">
                <button
                  @click.stop="openReport(session.id)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shadow-sm hover:shadow-md"
                >
                  <Icon name="heroicons:document-text" class="w-4 h-4" />
                  {{ $t("home.viewReport") }}
                </button>
                <NuxtLink
                  v-if="session.status !== 'Closed'"
                  @click.stop
                  :to="
                    session.status === 'Draft'
                      ? `/sessions/${session.id}/setup`
                      : `/sessions/${session.id}/runner`
                  "
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amnimo-600 hover:bg-amnimo-700 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Icon name="heroicons:arrow-right" class="w-4 h-4" />
                  {{ session.status === "Draft" ? "Setup" : "Open" }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Session Modal -->
    <Transition name="modal">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
      >
        <div
          class="modal-backdrop fixed inset-0 bg-slate-900/60 backdrop-blur-sm transform-gpu will-change-opacity"
          @click="closeModal"
        ></div>

        <div
          class="modal-content relative bg-white rounded-2xl shadow-glass w-full max-w-md overflow-hidden border border-slate-200"
        >
          <div class="px-6 py-5 border-b border-slate-100">
            <h3 class="text-xl font-bold text-slate-900">
              {{ $t("home.modal.title") }}
            </h3>
          </div>

          <form @submit.prevent="handleCreateSession" class="p-6">
            <div class="space-y-4">
              <div>
                <label
                  for="sessionName"
                  class="block text-sm font-bold text-slate-800 mb-1.5"
                  >{{ $t("home.modal.sessionName") }}</label
                >
                <input
                  id="sessionName"
                  v-model="newSessionName"
                  type="text"
                  class="block w-full rounded-xl border-slate-300 bg-white text-slate-900 shadow-sm focus:border-amnimo-500 focus:ring-amnimo-500 sm:text-sm py-2.5 px-3 border transition-colors outline-none focus:ring-2 focus:ring-opacity-50"
                  required
                />
              </div>
              <p class="text-sm font-medium text-slate-500">
                {{ $t("home.modal.description") }}
              </p>
            </div>

            <div class="mt-8 flex justify-end gap-3">
              <button
                type="button"
                @click="closeModal"
                class="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm active:scale-95"
              >
                {{ $t("home.modal.cancel") }}
              </button>
              <button
                type="submit"
                :disabled="isCreating"
                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-amnimo-600 border border-transparent rounded-xl hover:bg-amnimo-700 disabled:opacity-50 transition-colors shadow-sm active:scale-95 w-full sm:w-auto"
              >
                <AppSpinner v-if="isCreating" size="sm" />
                {{ $t("home.modal.submit") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Report Modal -->
    <ReportModal v-model="showReportModal" :sessionId="reportSessionId" />

    <!-- Aggregated Data Viewer -->
    <ExcelJsonViewer
      v-model="showDataViewer"
      :jsonUrl="dataViewerUrl"
      @openHtmlReport="openHtmlReportDialog"
    />

    <HtmlReportViewer
      v-if="htmlReportUrl"
      v-model="showHtmlReport"
      :url="htmlReportUrl"
    />

    <!-- Confirm Modal -->
    <ConfirmModal
      v-model="confirmModal.isOpen"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :confirmText="confirmModal.confirmText"
      :type="confirmModal.type"
      :isLoading="confirmModal.isLoading"
      @confirm="executeConfirm"
    />
  </div>
</template>
