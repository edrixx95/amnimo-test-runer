<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">
    <header class="h-16 flex items-center px-8 border-b border-gray-100 bg-white shrink-0 shadow-sm z-10 relative">
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-semibold text-slate-800 tracking-tight">Firmware Management</h2>
        <div v-if="selectedSource" class="flex items-center gap-2 text-sm">
          <Icon name="heroicons:chevron-right" class="w-4 h-4 text-slate-400" />
          <span class="px-2.5 py-1 bg-amnimo-50 text-amnimo-700 font-bold rounded-lg uppercase tracking-wider text-xs">
            {{ selectedSource }}
          </span>
        </div>
      </div>
    </header>

    <div class="flex-1 p-8 overflow-auto">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8 flex justify-between items-end">
          <div>
            <h3 class="text-2xl font-bold text-slate-900 tracking-tight">External Firmwares</h3>
            <p class="text-slate-500 mt-1">Download firmware images from Staging and Production servers</p>
          </div>
          <button v-if="selectedSource" @click="fetchFirmwares" class="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-amnimo-700 px-4 py-2 rounded-xl font-medium transition-all shadow-sm">
            <Icon name="heroicons:arrow-path" class="w-5 h-5" :class="{'animate-spin': isLoading}" />
            Refresh
          </button>
        </div>

        <!-- Step 1: Select Source -->
        <div v-if="!selectedSource" class="animate-fade-in-up">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
            <div @click="selectSource('staging')" class="group bg-white rounded-3xl p-8 border-2 border-transparent hover:border-amber-400 hover:shadow-glass hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center relative overflow-hidden">
              <div class="absolute -right-10 -top-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div class="w-20 h-20 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon name="heroicons:server" class="w-10 h-10" />
              </div>
              <h4 class="text-2xl font-bold text-slate-900 mb-2">Staging Server</h4>
              <p class="text-slate-500 font-medium">Testing and pre-release firmwares</p>
            </div>
            
            <div @click="selectSource('production')" class="group bg-white rounded-3xl p-8 border-2 border-transparent hover:border-emerald-400 hover:shadow-glass hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center relative overflow-hidden">
              <div class="absolute -right-10 -top-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div class="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon name="heroicons:check-badge" class="w-10 h-10" />
              </div>
              <h4 class="text-2xl font-bold text-slate-900 mb-2">Production Server</h4>
              <p class="text-slate-500 font-medium">Stable, officially released firmwares</p>
            </div>
          </div>
        </div>

        <!-- Step 2: Firmware List -->
        <div v-else class="animate-fade-in">
          <div class="mb-6 flex gap-4">
            <button @click="clearSource" class="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl font-medium transition-colors shadow-sm">
              <Icon name="heroicons:arrow-left" class="w-5 h-5" />
              Back
            </button>
            
            <div class="flex-1 bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex gap-4">
              <div class="flex-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Icon name="heroicons:magnifying-glass" class="w-5 h-5" />
                </div>
                <input v-model="searchQuery" type="text" placeholder="Search filename..." class="block w-full pl-10 pr-3 py-2 border-none focus:ring-0 text-sm bg-transparent" />
              </div>
              
              <div class="w-px bg-slate-200 my-1"></div>
              
              <div class="relative w-48 shrink-0 flex items-center">
                <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Icon name="heroicons:cpu-chip" class="w-4 h-4 text-slate-400" />
                </div>
                <button @click="isBoardDropdownOpen = !isBoardDropdownOpen" class="w-full py-2 pl-8 pr-3 text-left bg-transparent text-sm font-bold text-slate-700 outline-none flex items-center justify-between hover:bg-slate-50 rounded-lg transition-colors">
                  <span class="truncate">{{ filterBoard === 'all' ? 'All Boards' : filterBoard }}</span>
                  <Icon name="heroicons:chevron-down" class="w-4 h-4 text-slate-400 transition-transform duration-300" :class="{'rotate-180': isBoardDropdownOpen}" />
                </button>
                
                <!-- Click outside overlay -->
                <div v-if="isBoardDropdownOpen" @click="isBoardDropdownOpen = false" class="fixed inset-0 z-40"></div>

                <!-- Dropdown menu -->
                <transition
                  enter-active-class="transition duration-200 ease-out origin-top-right"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-100 ease-in origin-top-right"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <div v-if="isBoardDropdownOpen" class="absolute z-50 top-full mt-2 w-48 right-0 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-2">
                    <div class="max-h-60 overflow-y-auto custom-scrollbar px-1">
                      <button @click="selectBoardFilter('all')" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1" :class="filterBoard === 'all' ? 'text-amnimo-700 bg-amnimo-50 font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium hover:text-slate-900'">
                        <Icon name="heroicons:square-3-stack-3d" class="w-4 h-4" :class="filterBoard === 'all' ? 'text-amnimo-500' : 'text-slate-400'" />
                        All Boards
                      </button>
                      
                      <div class="h-px bg-slate-100 my-1 mx-2"></div>
                      
                      <button v-for="board in BOARD_LIST" :key="board" @click="selectBoardFilter(board)" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors" :class="filterBoard === board ? 'text-amnimo-700 bg-amnimo-50 font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium hover:text-slate-900'">
                        <Icon name="heroicons:cpu-chip" class="w-4 h-4" :class="filterBoard === board ? 'text-amnimo-500' : 'text-slate-400 opacity-50'" />
                        {{ board }}
                      </button>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>

          <div v-if="isLoading && firmwares.length === 0" class="flex justify-center p-20">
            <AppLoader size="md" text="Loading firmwares..." />
          </div>
          
          <div v-else-if="error" class="p-8 text-center text-red-600 bg-white rounded-2xl shadow-sm border border-red-100">
            <Icon name="heroicons:exclamation-circle" class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p class="font-medium">{{ error }}</p>
          </div>

          <div v-else-if="filteredFirmwares.length === 0" class="p-16 text-center text-slate-500 bg-white rounded-2xl shadow-sm border border-slate-100">
            <Icon name="heroicons:document-magnifying-glass" class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p class="text-lg font-bold text-slate-900 mb-1">No firmwares found</p>
            <p>Try adjusting your search or filters.</p>
          </div>
          
          <div v-else class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-gray-200 text-xs uppercase tracking-wider font-bold text-slate-500 select-none">
                    <th class="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group" @click="sortBy('filename')">
                      <div class="flex items-center gap-1.5">
                        Filename
                        <Icon v-if="sortKey === 'filename'" :name="sortOrder === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="w-3.5 h-3.5 text-amnimo-600" />
                        <Icon v-else name="heroicons:chevron-up-down" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />
                      </div>
                    </th>
                    <th class="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group" @click="sortBy('board')">
                      <div class="flex items-center gap-1.5">
                        Board
                        <Icon v-if="sortKey === 'board'" :name="sortOrder === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="w-3.5 h-3.5 text-amnimo-600" />
                        <Icon v-else name="heroicons:chevron-up-down" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />
                      </div>
                    </th>
                    <th class="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group" @click="sortBy('isModem')">
                      <div class="flex items-center gap-1.5">
                        Type
                        <Icon v-if="sortKey === 'isModem'" :name="sortOrder === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="w-3.5 h-3.5 text-amnimo-600" />
                        <Icon v-else name="heroicons:chevron-up-down" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />
                      </div>
                    </th>
                    <th class="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group" @click="sortBy('version')">
                      <div class="flex items-center gap-1.5">
                        Version
                        <Icon v-if="sortKey === 'version'" :name="sortOrder === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="w-3.5 h-3.5 text-amnimo-600" />
                        <Icon v-else name="heroicons:chevron-up-down" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />
                      </div>
                    </th>
                    <th class="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group" @click="sortBy('size')">
                      <div class="flex items-center gap-1.5">
                        Size
                        <Icon v-if="sortKey === 'size'" :name="sortOrder === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="w-3.5 h-3.5 text-amnimo-600" />
                        <Icon v-else name="heroicons:chevron-up-down" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />
                      </div>
                    </th>
                    <th class="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group" @click="sortBy('date')">
                      <div class="flex items-center gap-1.5">
                        Date
                        <Icon v-if="sortKey === 'date'" :name="sortOrder === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="w-3.5 h-3.5 text-amnimo-600" />
                        <Icon v-else name="heroicons:chevron-up-down" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />
                      </div>
                    </th>
                    <th class="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="fw in filteredFirmwares" :key="fw.url" class="hover:bg-slate-50/50 transition-colors group">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 shrink-0 bg-amnimo-50 text-amnimo-600 rounded-xl flex items-center justify-center">
                          <Icon name="heroicons:document-text" class="w-5 h-5" />
                        </div>
                        <div>
                          <p class="font-bold text-slate-800 text-sm break-all leading-tight">
                            {{ fw.filename }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex gap-1.5 flex-wrap">
                        <span v-for="b in fw.board.split('_')" :key="b" class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {{ b }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span v-if="fw.isModem" class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-amnimo-100 text-amnimo-700 border border-amnimo-200 uppercase tracking-wider">
                        Modem
                      </span>
                      <span v-else class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                        Firmware
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex flex-col">
                        <span class="font-mono text-sm text-slate-800 font-bold" v-if="fw.version && fw.version.toLowerCase() !== 'modem'">{{ fw.version }}</span>
                        <span class="font-mono text-sm text-slate-400 font-bold italic" v-else>N/A</span>
                        <span class="text-xs text-slate-400 font-semibold tracking-wide">Build {{ fw.build }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-600 font-semibold">
                      {{ formatBytes(fw.size) }}
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-500 font-medium">
                      {{ fw.date }}
                    </td>
                    <td class="px-6 py-4 text-right">
                      <a :href="`/api/firmwares/download?url=${encodeURIComponent(fw.url)}`" download
                         class="inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-amnimo-600 hover:text-white hover:border-amnimo-600 px-4 py-2 rounded-xl transition-all font-bold text-sm shadow-sm group-hover:shadow-md active:scale-95">
                        <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
                        Download
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Firmware {
  filename: string;
  source: string;
  board: string;
  version: string;
  build: string;
  isModem: boolean;
  date: string;
  size: number;
  url: string;
}

const firmwares = ref<Firmware[]>([]);
const isLoading = ref(false);
const error = ref('');

const selectedSource = ref<string | null>(null);
const searchQuery = ref('');
const filterBoard = ref('all');
const sortKey = ref<keyof Firmware>('date');
const sortOrder = ref<'asc' | 'desc'>('desc');

const sortBy = (key: keyof Firmware) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    // Default descending for date, asc for others
    sortOrder.value = key === 'date' ? 'desc' : 'asc';
  }
};

const isBoardDropdownOpen = ref(false);
const BOARD_LIST = ['AG10', 'AG20', 'AX11', 'AX12', 'AX21', 'AX30', 'AR10', 'AR20', 'AC10', 'AC15', 'AC25'];

const selectBoardFilter = (board: string) => {
  filterBoard.value = board;
  isBoardDropdownOpen.value = false;
};

const filteredFirmwares = computed(() => {
  if (!selectedSource.value) return [];
  
  let result = firmwares.value.filter(fw => {
    // Exact Source match
    if (fw.source !== selectedSource.value) return false;

    // Search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      if (!fw.filename.toLowerCase().includes(query)) return false;
    }
    
    // Board
    if (filterBoard.value !== 'all') {
      const boardParts = fw.board.split('_');
      if (!boardParts.includes(filterBoard.value)) return false;
    }
    
    return true;
  });

  result.sort((a, b) => {
    let valA: any = a[sortKey.value];
    let valB: any = b[sortKey.value];

    if (sortKey.value === 'date') {
      valA = new Date(a.date).getTime();
      valB = new Date(b.date).getTime();
    } else if (sortKey.value === 'version') {
      // Basic natural sort for versions (e.g. 1.2.10 > 1.2.9)
      const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
      return sortOrder.value === 'asc' 
        ? collator.compare(valA, valB) 
        : collator.compare(valB, valA);
    } else if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = (valB as string).toLowerCase();
    }

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });

  return result;
});

const selectSource = (source: string) => {
  selectedSource.value = source;
  searchQuery.value = '';
  filterBoard.value = 'all';
};

const clearSource = () => {
  selectedSource.value = null;
};

const fetchFirmwares = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    firmwares.value = await $fetch<Firmware[]>('/api/firmwares/external');
  } catch (err: any) {
    console.error('Failed to fetch firmwares', err);
    error.value = 'Failed to load firmwares from external servers. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

onMounted(() => {
  fetchFirmwares();
});
</script>
