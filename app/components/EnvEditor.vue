<template>
  <div class="space-y-6">
    <!-- Block 1 -->
    <div
      class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-soft hover:border-amnimo-300"
    >
      <h4
        class="text-base font-bold text-slate-800 mb-5 flex items-center gap-2"
      >
        <div
          class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"
        >
          <Icon name="heroicons:cpu-chip" class="w-5 h-5 text-indigo-500" />
        </div>
        Device & Firmware Config
      </h4>
      <div class="space-y-5">
        <!-- Row 1: Readonly -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div v-for="key in block1Row1Keys" :key="key" class="relative">
            <label
              class="flex items-center text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide"
            >
              {{ key }}
              <div
                v-if="envComments[key]"
                class="relative group ml-1.5 flex items-center"
              >
                <Icon
                  name="heroicons:information-circle"
                  class="w-4 h-4 text-amnimo-400 hover:text-amnimo-600 cursor-help transition-colors"
                />
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs z-[100]"
                >
                  <div
                    class="bg-slate-800 text-white text-[11px] font-medium leading-relaxed px-3 py-2 rounded-lg shadow-xl whitespace-pre-wrap"
                  >
                    {{ envComments[key] }}
                  </div>
                  <div
                    class="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"
                  ></div>
                </div>
              </div>
            </label>
            <template v-if="!isPlayground">
              <input
                type="text"
                v-model="parsedEnv[key]"
                readonly
                class="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
              />
            </template>
            <template v-else>
              <div class="relative">
                <input
                  type="text"
                  v-model="parsedEnv[key]"
                  @click="toggleDropdown(key)"
                  @blur="handleBlur"
                  @input="emitChange"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-amnimo-500/20 focus:border-amnimo-500 transition-all placeholder-slate-400 outline-none"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Icon
                    name="heroicons:chevron-up-down"
                    class="w-5 h-5 transition-colors duration-200"
                    :class="focusedField === key ? 'text-amnimo-500' : 'text-slate-400'"
                  />
                </div>
              </div>
              <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <div
                  v-show="focusedField === key && getOptions(key).length > 0"
                  :id="`dropdown-${key}`"
                  class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                >
                  <ul class="py-1">
                    <li
                      v-for="opt in getOptions(key)"
                      :key="opt"
                      @mousedown.prevent="selectOption(key, opt)"
                      :class="[
                        'px-4 py-2 text-sm cursor-pointer transition-colors break-all',
                        parsedEnv[key] === opt
                          ? 'bg-amnimo-50 text-amnimo-600 font-bold'
                          : 'text-slate-700 hover:bg-amnimo-50 hover:text-amnimo-600',
                      ]"
                    >
                      {{ opt || '(Empty)' }}
                    </li>
                  </ul>
                </div>
              </Transition>
            </template>
          </div>
        </div>

        <!-- Row 2: Firmwares -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div v-for="key in block1Row2Keys" :key="key" class="relative">
            <label
              class="flex items-center text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide"
            >
              {{ key }}
              <div
                v-if="envComments[key]"
                class="relative group ml-1.5 flex items-center"
              >
                <Icon
                  name="heroicons:information-circle"
                  class="w-4 h-4 text-amnimo-400 hover:text-amnimo-600 cursor-help transition-colors"
                />
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs z-[100]"
                >
                  <div
                    class="bg-slate-800 text-white text-[11px] font-medium leading-relaxed px-3 py-2 rounded-lg shadow-xl whitespace-pre-wrap"
                  >
                    {{ envComments[key] }}
                  </div>
                  <div
                    class="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"
                  ></div>
                </div>
              </div>
            </label>
            <div class="relative">
              <input
                type="text"
                :value="parsedEnv[key]"
                readonly
                @click="toggleDropdown(key)"
                @blur="handleBlur"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-800 cursor-pointer focus:bg-white focus:ring-2 focus:ring-amnimo-500/20 focus:border-amnimo-500 transition-all placeholder-slate-400 outline-none"
              />
              <div
                class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
              >
                <Icon
                  name="heroicons:chevron-up-down"
                  class="w-5 h-5 transition-colors duration-200"
                  :class="
                    focusedField === key ? 'text-amnimo-500' : 'text-slate-400'
                  "
                />
              </div>
            </div>

            <!-- Custom Dropdown -->
            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-show="focusedField === key && getOptions(key).length > 0"
                :id="`dropdown-${key}`"
                class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
              >
                <ul class="py-1">
                  <li
                    v-for="opt in getOptions(key)"
                    :key="opt"
                    @mousedown.prevent="selectOption(key, opt)"
                    :class="[
                      'px-4 py-2 text-sm cursor-pointer transition-colors break-all',
                      parsedEnv[key] === opt
                        ? 'bg-amnimo-50 text-amnimo-600 font-bold'
                        : 'text-slate-700 hover:bg-amnimo-50 hover:text-amnimo-600',
                    ]"
                  >
                    {{ opt }}
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Block 2 -->
    <div
      class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-soft hover:border-amnimo-300"
    >
      <h4
        class="text-base font-bold text-slate-800 mb-5 flex items-center gap-2"
      >
        <div
          class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"
        >
          <Icon name="heroicons:globe-alt" class="w-5 h-5 text-emerald-500" />
        </div>
        Environment & Network Config
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div v-for="key in block2Keys" :key="key">
          <label
            class="flex items-center text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide"
          >
            {{ key }}
            <div
              v-if="envComments[key]"
              class="relative group ml-1.5 flex items-center"
            >
              <Icon
                name="heroicons:information-circle"
                class="w-4 h-4 text-amnimo-400 hover:text-amnimo-600 cursor-help transition-colors"
              />
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs z-[100]"
              >
                <div
                  class="bg-slate-800 text-white text-[11px] font-medium leading-relaxed px-3 py-2 rounded-lg shadow-xl whitespace-pre-wrap"
                >
                  {{ envComments[key] }}
                </div>
                <div
                  class="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"
                ></div>
              </div>
            </div>
          </label>
          <div class="relative">
            <input
              type="text"
              v-model="parsedEnv[key]"
              @input="emitChange"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-amnimo-500/20 focus:border-amnimo-500 transition-all placeholder-slate-400 outline-none"
              :class="{
                'pr-12': key === 'PC_SERVER_PORT' || key === 'PC_SERVER_URL',
              }"
            />

            <button
              v-if="key === 'PC_SERVER_URL'"
              @click="scanIIS(key)"
              :disabled="isScanningIIS"
              class="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
              title="Scan IIS Sites"
            >
              <Icon
                :name="
                  isScanningIIS ? 'heroicons:arrow-path' : 'heroicons:server'
                "
                class="w-5 h-5"
                :class="{ 'animate-spin': isScanningIIS }"
              />
            </button>

            <!-- IIS Dropdown -->
            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-show="showIISDropdown && iisTargetKey === key"
                class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
              >
                <ul class="py-1">
                  <li
                    v-if="iisSites.length === 0"
                    class="px-4 py-3 text-sm text-slate-500 text-center"
                  >
                    No active IIS sites found.
                  </li>
                  <li
                    v-for="site in iisSites"
                    :key="site.name"
                    @click="selectIISSite(site)"
                    class="px-4 py-2 text-sm cursor-pointer transition-colors border-b last:border-b-0 border-slate-100 hover:bg-indigo-50 group flex items-center justify-between"
                  >
                    <div>
                      <span
                        class="block font-bold text-slate-700 group-hover:text-indigo-600"
                        >{{ site.name }}</span
                      >
                      <span class="block text-xs text-slate-500 mt-0.5"
                        >Port: {{ site.port || "N/A" }}</span
                      >
                    </div>
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                      :class="
                        site.state === 'Started'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      "
                    >
                      {{ site.state }}
                    </span>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Block 3 -->
    <div
      class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-soft hover:border-amnimo-300"
    >
      <h4
        class="text-base font-bold text-slate-800 mb-5 flex items-center gap-2"
      >
        <div
          class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"
        >
          <Icon name="heroicons:cog-8-tooth" class="w-5 h-5 text-amber-500" />
        </div>
        System Constants
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div v-for="key in block3Keys" :key="key">
          <label
            class="flex items-center text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide"
          >
            {{ key }}
            <div
              v-if="envComments[key]"
              class="relative group ml-1.5 flex items-center"
            >
              <Icon
                name="heroicons:information-circle"
                class="w-4 h-4 text-amnimo-400 hover:text-amnimo-600 cursor-help transition-colors"
              />
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs z-[100]"
              >
                <div
                  class="bg-slate-800 text-white text-[11px] font-medium leading-relaxed px-3 py-2 rounded-lg shadow-xl whitespace-pre-wrap"
                >
                  {{ envComments[key] }}
                </div>
                <div
                  class="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"
                ></div>
              </div>
            </div>
          </label>
          <div class="relative">
            <input
              type="text"
              v-model="parsedEnv[key]"
              @click="toggleDropdown(key)"
              @blur="handleBlur"
              @input="emitChange"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-amnimo-500/20 focus:border-amnimo-500 transition-all placeholder-slate-400 outline-none"
            />
            <div
              v-if="getOptions(key).length > 0"
              class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            >
              <Icon
                name="heroicons:chevron-up-down"
                class="w-5 h-5 transition-colors duration-200"
                :class="
                  focusedField === key ? 'text-amnimo-500' : 'text-slate-400'
                "
              />
            </div>
          </div>
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-show="focusedField === key && getOptions(key).length > 0"
              :id="`dropdown-${key}`"
              class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
            >
              <ul class="py-1">
                <li
                  v-for="opt in getOptions(key)"
                  :key="opt"
                  @mousedown.prevent="selectOption(key, opt)"
                  :class="[
                    'px-4 py-2 text-sm cursor-pointer transition-colors break-all',
                    parsedEnv[key] === opt
                      ? 'bg-amnimo-50 text-amnimo-600 font-bold'
                      : 'text-slate-700 hover:bg-amnimo-50 hover:text-amnimo-600',
                  ]"
                >
                  {{ opt || '(Empty)' }}
                </li>
              </ul>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { getFirmwarePrefix } from "~~/shared/constants";

const props = defineProps<{
  modelValue: string;
  isPlayground?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const block1Row1Keys = ["SERIES", "BOARD", "DEVICE_TYPE"];
const block1Row2Keys = ["PREV_FIRMWARE_NAME", "TEST_FIRMWARE_NAME"];
const block2Keys = [
  "PC_SERVER_URL",
  "PC_SERVER_PORT",
  "INTERNET_ADDRESS",
  "INTERNET_GATEWAY_ADDRESS",
  "SIM_APN",
  "SIM_USERNAME",
  "SIM_PASSWORD",
];
const block3Keys = [
  "BASE_URL",
  "HOST",
  "TEST_USERNAME",
  "TEST_PASSWORD",
  "CLI_SERVER_URL",
  "CLI_SERVER_PORT",
];

const parsedEnv = ref<Record<string, string>>({});
const envComments = ref<Record<string, string>>({});
const allLines = ref<string[]>([]); // To preserve comments and empty lines

const firmwares = ref<string[]>([]);
const availablePorts = ref<string[]>([]);

const focusedField = ref<string | null>(null);

// IIS Scanning State
const isScanningIIS = ref(false);
const iisSites = ref<
  { name: string; state: string; port: number; url: string }[]
>([]);
const showIISDropdown = ref(false);
const iisTargetKey = ref<string | null>(null);

const scanIIS = async (key: string) => {
  iisTargetKey.value = key;
  isScanningIIS.value = true;
  try {
    const data = await $fetch<any[]>("/api/iis/sites");
    iisSites.value = data;
    showIISDropdown.value = true;
  } catch (error: any) {
    alert(
      error.data?.statusMessage ||
        "Failed to scan IIS. Please ensure you are running the test runner as Administrator.",
    );
  } finally {
    isScanningIIS.value = false;
  }
};

const selectIISSite = (site: { port: number; url: string }) => {
  if (site.url) {
    try {
      const urlObj = new URL(site.url);
      parsedEnv.value["PC_SERVER_URL"] = urlObj.hostname;
      if (site.port) {
        parsedEnv.value["PC_SERVER_PORT"] = site.port.toString();
      } else if (urlObj.port) {
        parsedEnv.value["PC_SERVER_PORT"] = urlObj.port;
      }
    } catch (e) {
      // Fallback
      if (iisTargetKey.value === "PC_SERVER_PORT" && site.port) {
        parsedEnv.value["PC_SERVER_PORT"] = site.port.toString();
      } else if (iisTargetKey.value === "PC_SERVER_URL" && site.url) {
        parsedEnv.value["PC_SERVER_URL"] = site.url;
      }
    }
  } else if (site.port) {
    parsedEnv.value["PC_SERVER_PORT"] = site.port.toString();
  }

  showIISDropdown.value = false;
  emitChange();
};

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".relative")) {
      showIISDropdown.value = false;
    }
  });
});

const toggleDropdown = async (key: string) => {
  if (focusedField.value === key) {
    focusedField.value = null;
  } else {
    focusedField.value = key;
    await nextTick();
    const dropdown = document.getElementById(`dropdown-${key}`);
    const activeItem = dropdown?.querySelector(".font-bold");
    if (activeItem && dropdown) {
      activeItem.scrollIntoView({ block: "center" });
    }
  }
};

const handleBlur = () => {
  focusedField.value = null;
};

const selectOption = (key: string, opt: string) => {
  parsedEnv.value[key] = opt;
  focusedField.value = null;
  emitChange();
};

const getOptions = (key: string) => {
  if (key === "CLI_SERVER_PORT") {
    return availablePorts.value;
  }
  if (key === "PREV_FIRMWARE_NAME" || key === "TEST_FIRMWARE_NAME") {
    let list = firmwares.value;

    // 1. Exclude bootloaders and enforce strict format
    list = list.filter((fw) => {
      const isBootloader = fw.toLowerCase().includes("bootloader");
      const isValid = /^.*-\d+\.\d+\.\d+-b\d+\.amf$/i.test(fw);
      return !isBootloader && isValid;
    });

    // 2. Filter by current board if selected
    const currentBoard = parsedEnv.value["BOARD"];
    if (currentBoard) {
      const requiredPrefix = getFirmwarePrefix(currentBoard);
      list = list.filter((fw) => {
        const prefix = fw.split("-")[0]?.toLowerCase() || "";
        return prefix === requiredPrefix;
      });
    }

    return list;
  }

  if (key === "SERIES") {
    return ["G", "X", "R", "C"];
  }
  
  if (key === "BOARD") {
    const series = parsedEnv.value["SERIES"];
    if (series === "G") return ["AG10", "AG20"];
    if (series === "X") return ["AX11", "AX12", "AX21", "AX30"];
    if (series === "R") return ["AR10", "AR20"];
    if (series === "C") return ["AC10", "AC15", "AC25"];
    return ["AG10", "AG20", "AX11", "AX12", "AX21", "AX30", "AR10", "AR20", "AC10", "AC15", "AC25"];
  }

  if (key === "DEVICE_TYPE") {
    const board = parsedEnv.value["BOARD"];
    if (board === "AX30") return ["A", "B"];
    if (board === "AC15" || board === "AC25") return ["V2A", "V3A"];
    if (board === "AR10") return ["WoM"];
    return [""];
  }

  return [];
};

const parseEnv = (content: string) => {
  const lines = content.split("\n");
  allLines.value = [...lines];

  const env: Record<string, string> = {};
  const comments: Record<string, string> = {};

  let currentCommentBlocks: string[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("#")) {
      if (!trimmed.startsWith("# ====")) {
        currentCommentBlocks.push(trimmed.replace(/^#\s*/, ""));
      } else {
        currentCommentBlocks = [];
      }
    } else if (trimmed) {
      const idx = line.indexOf("=");
      if (idx > -1) {
        const key = line.substring(0, idx).trim();
        const val = line.substring(idx + 1).trim();
        env[key] = val;

        // Filter out blocks like [ブロック1]
        const filteredComments = currentCommentBlocks.filter(
          (c) => !c.startsWith("["),
        );
        if (filteredComments.length > 0) {
          comments[key] = filteredComments.join("\n");
        }
      }
      // Note: intentionally NOT clearing currentCommentBlocks here
      // so that grouped variables without blank lines share the same tooltip.
    } else {
      currentCommentBlocks = [];
    }
  });

  // Set defaults if empty
  if (!env["TEST_USERNAME"]) env["TEST_USERNAME"] = "admin";
  if (!env["TEST_PASSWORD"]) env["TEST_PASSWORD"] = "yoko1234";
  if (!env["CLI_SERVER_URL"]) env["CLI_SERVER_URL"] = "http://localhost";

  parsedEnv.value = env;
  envComments.value = comments;
  emitChange(); // Make sure defaults are synced
};

const emitChange = () => {
  // Reconstruct env string keeping comments
  const newLines = allLines.value.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return line;

    const idx = line.indexOf("=");
    if (idx > -1) {
      const key = line.substring(0, idx).trim();
      if (parsedEnv.value[key] !== undefined) {
        return `${key}=${parsedEnv.value[key]}`;
      }
    }
    return line;
  });

  // Check if there are keys added that weren't in the original text
  const handledKeys = new Set<string>();
  newLines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = line.indexOf("=");
      if (idx > -1) {
        handledKeys.add(line.substring(0, idx).trim());
      }
    }
  });

  const allExpectedKeys = [
    ...block1Row1Keys,
    ...block1Row2Keys,
    ...block2Keys,
    ...block3Keys,
  ];
  allExpectedKeys.forEach((key) => {
    if (!handledKeys.has(key) && parsedEnv.value[key] !== undefined) {
      newLines.push(`${key}=${parsedEnv.value[key]}`);
    }
  });

  const finalString = newLines.join("\n");
  if (finalString !== props.modelValue) {
    emit("update:modelValue", finalString);
  }
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (Object.keys(parsedEnv.value).length === 0 && newVal !== "") {
      parseEnv(newVal);
    }
  },
);

onMounted(async () => {
  if (props.modelValue) {
    parseEnv(props.modelValue);
  }

  try {
    const fwList = await $fetch<string[]>("/api/firmwares");
    firmwares.value = fwList;
  } catch (err) {
    console.error("Failed to load firmwares", err);
  }

  try {
    const ports = await $fetch<number[]>("/api/utils/available-ports");
    availablePorts.value = ports.map((p) => p.toString());

    // Auto-assign first available port if not present
    if (!parsedEnv.value["CLI_SERVER_PORT"] && availablePorts.value.length > 0) {
      parsedEnv.value["CLI_SERVER_PORT"] = availablePorts.value[0];
      emitChange();
    }
  } catch (err) {
    console.error("Failed to load available ports", err);
  }
});
</script>
