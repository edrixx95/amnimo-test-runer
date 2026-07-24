<script setup lang="ts">
import { onMounted } from "vue";
import { useFirmwareManager } from "~/composables/firmware/useFirmwareManager";

const {
  firmwares,
  isLoading,
  error,
  selectedSource,
  searchQuery,
  filterBoard,
  sortKey,
  sortOrder,
  isBoardDropdownOpen,
  BOARD_LIST,
  sortBy,
  selectBoardFilter,
  filteredFirmwares,
  selectSource,
  clearSource,
  fetchFirmwares,
  formatBytes,
} = useFirmwareManager();

onMounted(() => {
  fetchFirmwares();
});
</script>

<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">
    <header
      class="h-16 flex items-center px-8 border-b border-gray-100 bg-white shrink-0 shadow-sm z-10 relative"
    >
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-semibold text-slate-800 tracking-tight">
          {{ $t("firmware.title") }}
        </h2>
        <div v-if="selectedSource" class="flex items-center gap-2 text-sm">
          <Icon name="heroicons:chevron-right" class="w-4 h-4 text-slate-400" />
          <span
            class="px-2.5 py-1 bg-amnimo-50 text-amnimo-700 font-bold rounded-lg uppercase tracking-wider text-xs"
          >
            {{ selectedSource }}
          </span>
        </div>
      </div>
    </header>

    <div class="flex-1 p-8 overflow-auto">
      <div class="max-w-8xl mx-auto">
        <div class="mb-8 flex justify-between items-end">
          <div>
            <h3 class="text-2xl font-bold text-slate-900 tracking-tight">
              {{ $t("firmware.externalTitle") }}
            </h3>
            <p class="text-slate-500 mt-1">{{ $t("firmware.description") }}</p>
          </div>
          <button
            v-if="selectedSource"
            @click="fetchFirmwares"
            class="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-amnimo-700 px-4 py-2 rounded-xl font-medium transition-all shadow-sm"
          >
            <Icon
              name="heroicons:arrow-path"
              class="w-5 h-5"
              :class="{ 'animate-spin': isLoading }"
            />
            {{ $t("firmware.refresh") }}
          </button>
        </div>

        <!-- Step 1: Select Source -->
        <div v-if="!selectedSource" class="animate-fade-in-up">
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12"
          >
            <div
              @click="selectSource('staging')"
              class="group bg-white rounded-3xl p-8 border-2 border-transparent hover:border-amber-400 hover:shadow-glass hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center relative overflow-hidden"
            >
              <div
                class="absolute -right-10 -top-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"
              ></div>
              <div
                class="w-20 h-20 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <Icon name="heroicons:server" class="w-10 h-10" />
              </div>
              <h4 class="text-2xl font-bold text-slate-900 mb-2">
                {{ $t("firmware.stagingServer") }}
              </h4>
              <p class="text-slate-500 font-medium">
                {{ $t("firmware.stagingDesc") }}
              </p>
            </div>

            <div
              @click="selectSource('production')"
              class="group bg-white rounded-3xl p-8 border-2 border-transparent hover:border-emerald-400 hover:shadow-glass hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center relative overflow-hidden"
            >
              <div
                class="absolute -right-10 -top-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"
              ></div>
              <div
                class="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <Icon name="heroicons:check-badge" class="w-10 h-10" />
              </div>
              <h4 class="text-2xl font-bold text-slate-900 mb-2">
                {{ $t("firmware.productionServer") }}
              </h4>
              <p class="text-slate-500 font-medium">
                {{ $t("firmware.productionDesc") }}
              </p>
            </div>
          </div>
        </div>

        <!-- Step 2: Firmware List -->
        <div v-else class="animate-fade-in">
          <div class="mb-6 flex gap-4">
            <button
              @click="clearSource"
              class="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl font-medium transition-colors shadow-sm"
            >
              <Icon name="heroicons:arrow-left" class="w-5 h-5" />
              {{ $t("firmware.back") }}
            </button>

            <div
              class="flex-1 bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex gap-4"
            >
              <div class="flex-1 relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
                >
                  <Icon name="heroicons:magnifying-glass" class="w-5 h-5" />
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="$t('firmware.searchPlaceholder')"
                  class="block w-full pl-10 pr-3 py-2 border-none focus:ring-0 text-sm bg-transparent"
                />
              </div>

              <div class="w-px bg-slate-200 my-1"></div>

              <div class="relative w-48 shrink-0 flex items-center">
                <div
                  class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none"
                >
                  <Icon
                    name="heroicons:cpu-chip"
                    class="w-4 h-4 text-slate-400"
                  />
                </div>
                <button
                  @click="isBoardDropdownOpen = !isBoardDropdownOpen"
                  class="w-full py-2 pl-8 pr-3 text-left bg-transparent text-sm font-bold text-slate-700 outline-none flex items-center justify-between hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <span class="truncate">{{
                    filterBoard === "all"
                      ? $t("firmware.allBoards")
                      : filterBoard
                  }}</span>
                  <Icon
                    name="heroicons:chevron-down"
                    class="w-4 h-4 text-slate-400 transition-transform duration-300"
                    :class="{ 'rotate-180': isBoardDropdownOpen }"
                  />
                </button>

                <!-- Click outside overlay -->
                <div
                  v-if="isBoardDropdownOpen"
                  @click="isBoardDropdownOpen = false"
                  class="fixed inset-0 z-40"
                ></div>

                <!-- Dropdown menu -->
                <transition
                  enter-active-class="transition duration-200 ease-out origin-top-right"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-100 ease-in origin-top-right"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <div
                    v-if="isBoardDropdownOpen"
                    class="absolute z-50 top-full mt-2 w-48 right-0 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-2"
                  >
                    <div class="max-h-60 overflow-y-auto custom-scrollbar px-1">
                      <button
                        @click="selectBoardFilter('all')"
                        class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1"
                        :class="
                          filterBoard === 'all'
                            ? 'text-amnimo-700 bg-amnimo-50 font-bold'
                            : 'text-slate-600 hover:bg-slate-50 font-medium hover:text-slate-900'
                        "
                      >
                        <Icon
                          name="heroicons:square-3-stack-3d"
                          class="w-4 h-4"
                          :class="
                            filterBoard === 'all'
                              ? 'text-amnimo-500'
                              : 'text-slate-400'
                          "
                        />
                        {{ $t("firmware.allBoards") }}
                      </button>

                      <div class="h-px bg-slate-100 my-1 mx-2"></div>

                      <button
                        v-for="board in BOARD_LIST"
                        :key="board"
                        @click="selectBoardFilter(board)"
                        class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                        :class="
                          filterBoard === board
                            ? 'text-amnimo-700 bg-amnimo-50 font-bold'
                            : 'text-slate-600 hover:bg-slate-50 font-medium hover:text-slate-900'
                        "
                      >
                        <Icon
                          name="heroicons:cpu-chip"
                          class="w-4 h-4"
                          :class="
                            filterBoard === board
                              ? 'text-amnimo-500'
                              : 'text-slate-400 opacity-50'
                          "
                        />
                        {{ board }}
                      </button>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>

          <div
            v-if="isLoading && firmwares.length === 0"
            class="flex justify-center p-20"
          >
            <AppLoader size="md" :text="$t('firmware.loading')" />
          </div>

          <div
            v-else-if="error"
            class="p-8 text-center text-red-600 bg-white rounded-2xl shadow-sm border border-red-100"
          >
            <Icon
              name="heroicons:exclamation-circle"
              class="w-12 h-12 mx-auto mb-3 opacity-50"
            />
            <p class="font-medium">{{ error }}</p>
          </div>

          <div
            v-else-if="filteredFirmwares.length === 0"
            class="p-16 text-center text-slate-500 bg-white rounded-2xl shadow-sm border border-slate-100"
          >
            <Icon
              name="heroicons:document-magnifying-glass"
              class="w-12 h-12 mx-auto mb-3 opacity-50"
            />
            <p class="text-lg font-bold text-slate-900 mb-1">
              {{ $t("firmware.noFirmwares") }}
            </p>
            <p>{{ $t("firmware.tryAdjusting") }}</p>
          </div>

          <div
            v-else
            class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
          >
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr
                    class="bg-slate-50/80 border-b border-gray-200 text-xs uppercase tracking-wider font-bold text-slate-500 select-none"
                  >
                    <th
                      class="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                      @click="sortBy('filename')"
                    >
                      <div class="flex items-center gap-1.5">
                        {{ $t("firmware.fileName") }}
                        <Icon
                          v-if="sortKey === 'filename'"
                          :name="
                            sortOrder === 'asc'
                              ? 'heroicons:chevron-up'
                              : 'heroicons:chevron-down'
                          "
                          class="w-3.5 h-3.5 text-amnimo-600"
                        />
                        <Icon
                          v-else
                          name="heroicons:chevron-up-down"
                          class="w-3.5 h-3.5 opacity-0 group-hover:opacity-50"
                        />
                      </div>
                    </th>
                    <th
                      class="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                      @click="sortBy('board')"
                    >
                      <div class="flex items-center gap-1.5">
                        {{ $t("firmware.board") }}
                        <Icon
                          v-if="sortKey === 'board'"
                          :name="
                            sortOrder === 'asc'
                              ? 'heroicons:chevron-up'
                              : 'heroicons:chevron-down'
                          "
                          class="w-3.5 h-3.5 text-amnimo-600"
                        />
                        <Icon
                          v-else
                          name="heroicons:chevron-up-down"
                          class="w-3.5 h-3.5 opacity-0 group-hover:opacity-50"
                        />
                      </div>
                    </th>
                    <th
                      class="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                      @click="sortBy('isModem')"
                    >
                      <div class="flex items-center gap-1.5">
                        {{ $t("firmware.type") }}
                        <Icon
                          v-if="sortKey === 'isModem'"
                          :name="
                            sortOrder === 'asc'
                              ? 'heroicons:chevron-up'
                              : 'heroicons:chevron-down'
                          "
                          class="w-3.5 h-3.5 text-amnimo-600"
                        />
                        <Icon
                          v-else
                          name="heroicons:chevron-up-down"
                          class="w-3.5 h-3.5 opacity-0 group-hover:opacity-50"
                        />
                      </div>
                    </th>
                    <th
                      class="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                      @click="sortBy('version')"
                    >
                      <div class="flex items-center gap-1.5">
                        {{ $t("firmware.version") }}
                        <Icon
                          v-if="sortKey === 'version'"
                          :name="
                            sortOrder === 'asc'
                              ? 'heroicons:chevron-up'
                              : 'heroicons:chevron-down'
                          "
                          class="w-3.5 h-3.5 text-amnimo-600"
                        />
                        <Icon
                          v-else
                          name="heroicons:chevron-up-down"
                          class="w-3.5 h-3.5 opacity-0 group-hover:opacity-50"
                        />
                      </div>
                    </th>
                    <th
                      class="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                      @click="sortBy('size')"
                    >
                      <div class="flex items-center gap-1.5">
                        {{ $t("firmware.size") }}
                        <Icon
                          v-if="sortKey === 'size'"
                          :name="
                            sortOrder === 'asc'
                              ? 'heroicons:chevron-up'
                              : 'heroicons:chevron-down'
                          "
                          class="w-3.5 h-3.5 text-amnimo-600"
                        />
                        <Icon
                          v-else
                          name="heroicons:chevron-up-down"
                          class="w-3.5 h-3.5 opacity-0 group-hover:opacity-50"
                        />
                      </div>
                    </th>
                    <th
                      class="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                      @click="sortBy('date')"
                    >
                      <div class="flex items-center gap-1.5">
                        {{ $t("firmware.date") }}
                        <Icon
                          v-if="sortKey === 'date'"
                          :name="
                            sortOrder === 'asc'
                              ? 'heroicons:chevron-up'
                              : 'heroicons:chevron-down'
                          "
                          class="w-3.5 h-3.5 text-amnimo-600"
                        />
                        <Icon
                          v-else
                          name="heroicons:chevron-up-down"
                          class="w-3.5 h-3.5 opacity-0 group-hover:opacity-50"
                        />
                      </div>
                    </th>
                    <th class="px-6 py-4 text-right">
                      {{ $t("firmware.actions") }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="fw in filteredFirmwares"
                    :key="fw.url"
                    class="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-9 h-9 shrink-0 bg-amnimo-50 text-amnimo-600 rounded-xl flex items-center justify-center"
                        >
                          <Icon
                            name="heroicons:document-text"
                            class="w-5 h-5"
                          />
                        </div>
                        <div>
                          <p
                            class="font-bold text-slate-800 text-sm break-all leading-tight"
                          >
                            {{ fw.filename }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex gap-1.5 flex-wrap">
                        <span
                          v-for="b in fw.board.split('_')"
                          :key="b"
                          class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {{ b }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span
                        v-if="fw.isModem"
                        class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-amnimo-100 text-amnimo-700 border border-amnimo-200 uppercase tracking-wider"
                      >
                        {{ $t("firmware.modem") }}
                      </span>
                      <span
                        v-else
                        class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider"
                      >
                        {{ $t("firmware.firmwareLabel") }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex flex-col">
                        <span
                          class="font-mono text-sm text-slate-800 font-bold"
                          v-if="
                            fw.version && fw.version.toLowerCase() !== 'modem'
                          "
                          >{{ fw.version }}</span
                        >
                        <span
                          class="font-mono text-sm text-slate-400 font-bold italic"
                          v-else
                          >N/A</span
                        >
                        <span
                          class="text-xs text-slate-400 font-semibold tracking-wide"
                          >{{ $t("firmware.build") }} {{ fw.build }}</span
                        >
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-600 font-semibold">
                      {{ formatBytes(fw.size) }}
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-500 font-medium">
                      {{ fw.date }}
                    </td>
                    <td class="px-6 py-4 text-right">
                      <a
                        :href="`/api/firmwares/download?url=${encodeURIComponent(fw.url)}`"
                        download
                        class="inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-amnimo-600 hover:text-white hover:border-amnimo-600 px-4 py-2 rounded-xl transition-all font-bold text-sm shadow-sm group-hover:shadow-md active:scale-95"
                      >
                        <Icon
                          name="heroicons:arrow-down-tray"
                          class="w-4 h-4"
                        />
                        {{ $t("firmware.download") }}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
