<script setup lang="ts">
import { computed, ref, watch } from "vue";

type InnerTest = {
  id: string;
  name: string;
  status: "waiting" | "running" | "PASSED" | "FAILED" | "SKIPPED";
  duration?: string;
};

type Spec = {
  id: number;
  path: string;
  status: "waiting" | "running" | "passed" | "failed";
  innerTests: InnerTest[];
};

const props = defineProps<{
  specs: Spec[];
  isTesting: boolean;
  allowDrag?: boolean;
}>();

const _emit = defineEmits<{
  (e: "remove-file", path: string): void;
  (e: "remove-case", path: string, caseName: string): void;
  (e: "reorder", draggedPath: string, targetPath: string, position: "before" | "after"): void;
}>();

const totalCases = computed(() => {
  let total = 0;
  for (const spec of props.specs) {
    if (spec.innerTests.length > 0) {
      total += spec.innerTests.length;
    } else {
      total += 1;
    }
  }
  return total;
});

const completedCases = computed(() => {
  let completed = 0;
  for (const spec of props.specs) {
    if (spec.innerTests.length > 0) {
      for (const test of spec.innerTests) {
        if (["PASSED", "FAILED", "SKIPPED"].includes(test.status)) {
          completed++;
        }
      }
    } else if (spec.status === "passed" || spec.status === "failed") {
      completed++;
    }
  }
  return completed;
});

const hasFailed = computed(
  () =>
    props.specs.some((s) => s.status === "failed") ||
    props.specs.some((s) => s.innerTests.some((t) => t.status === "FAILED")),
);

const testSummary = computed(() => {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  for (const spec of props.specs) {
    for (const test of spec.innerTests) {
      if (test.status === "PASSED") passed++;
      else if (test.status === "FAILED") failed++;
      else if (test.status === "SKIPPED") skipped++;
    }
  }
  return { passed, failed, skipped };
});

const progressPercentage = computed(() => {
  if (totalCases.value === 0) return 0;
  return (completedCases.value / totalCases.value) * 100;
});

const runningCases = computed(() => {
  let running = 0;
  for (const spec of props.specs) {
    if (spec.innerTests.length > 0) {
      for (const test of spec.innerTests) {
        if (test.status === "running") running++;
      }
    } else if (spec.status === "running") {
      running++;
    }
  }
  return running;
});

const runningPercentage = computed(() => {
  if (totalCases.value === 0) return 0;
  return (runningCases.value / totalCases.value) * 100;
});

const progressColorClass = computed(() => {
  if (hasFailed.value) return "bg-red-500";
  if (totalCases.value > 0 && progressPercentage.value === 100)
    return "bg-green-500";
  return "bg-amnimo-600";
});

const formatSpecName = (pathStr: string) => {
  const parts = pathStr.split(/[\\/]/);
  return parts.slice(-2).join("/") || pathStr;
};

const collapsedSpecs = ref<Set<string>>(new Set());

const toggleCollapse = (path: string) => {
  if (collapsedSpecs.value.has(path)) {
    collapsedSpecs.value.delete(path);
  } else {
    collapsedSpecs.value.add(path);
  }
};

watch(
  () => props.specs,
  (newSpecs) => {
    for (const spec of newSpecs) {
      const isFinished = spec.status === "passed" || spec.status === "failed";
      if (isFinished && !collapsedSpecs.value.has(spec.path)) {
        collapsedSpecs.value.add(spec.path);
      }
    }
  },
  { deep: true },
);

const getSpecProgress = (spec: Spec) => {
  if (spec.innerTests.length === 0) {
    if (spec.status === "passed" || spec.status === "failed") {
      return {
        percentage: 100,
        runningPercentage: 0,
        hasFailed: spec.status === "failed",
        completed: 1,
        total: 1,
      };
    }
    return {
      percentage: 0,
      runningPercentage: spec.status === "running" ? 100 : 0,
      hasFailed: false,
      completed: 0,
      total: 1,
    };
  }
  const total = spec.innerTests.length;
  const completed = spec.innerTests.filter((t) =>
    ["PASSED", "FAILED", "SKIPPED"].includes(t.status),
  ).length;
  const running = spec.innerTests.filter((t) => t.status === "running").length;

  const hasFailed = spec.innerTests.some((t) => t.status === "FAILED");
  return {
    percentage: (completed / total) * 100,
    runningPercentage: (running / total) * 100,
    hasFailed,
    completed,
    total,
  };
};

const draggedSpecIndex = ref<number | null>(null);
const dragOverSpecIndex = ref<number | null>(null);

const onDragStart = (e: DragEvent, index: number) => {
  if (!props.allowDrag) return;
  draggedSpecIndex.value = index;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  }
};

const onDragOver = (e: DragEvent, index: number) => {
  if (!props.allowDrag) return;
  e.preventDefault();
  if (draggedSpecIndex.value !== index) {
    dragOverSpecIndex.value = index;
  }
};

const onDragLeave = () => {
  dragOverSpecIndex.value = null;
};

const onDrop = (e: DragEvent, index: number) => {
  if (!props.allowDrag) return;
  dragOverSpecIndex.value = null;
  
  let draggedIdx = draggedSpecIndex.value;
  if (draggedIdx === null && e.dataTransfer) {
    const data = e.dataTransfer.getData("text/plain");
    if (data) {
      draggedIdx = parseInt(data, 10);
    }
  }

  if (draggedIdx === null || isNaN(draggedIdx) || draggedIdx === index) return;
  
  const draggedSpec = props.specs[draggedIdx];
  const targetSpec = props.specs[index];
  
  if (draggedSpec && targetSpec) {
    const position = draggedIdx > index ? 'before' : 'after';
    _emit('reorder', draggedSpec.path, targetSpec.path, position);
  }
  
  draggedSpecIndex.value = null;
};

const onDragEnd = () => {
  draggedSpecIndex.value = null;
  dragOverSpecIndex.value = null;
};
</script>

<template>
  <div
    class="flex flex-col h-full bg-slate-50 border-l border-slate-200 overflow-hidden"
  >
    <div class="p-5 border-b border-slate-200 bg-white z-10 shadow-sm relative">
      <div class="flex justify-between items-center mb-4">
        <h3
          class="font-extrabold text-slate-800 flex items-center gap-2 text-lg"
        >
          <Icon name="heroicons:queue-list" class="w-5 h-5 text-amnimo-600" />
          {{ $t("testProgress.testQueue") }}
        </h3>
        <span
          class="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 shadow-sm"
          :title="$t('testProgress.completedCases')"
        >
          {{ completedCases }}
          <span class="text-slate-400 font-normal mx-0.5">/</span>
          {{ totalCases }}
        </span>
      </div>

      <!-- Inner Tests Summary -->
      <div v-if="specs.length > 0" class="flex gap-2 mb-4">
        <div
          class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold shadow-sm transition-all"
        >
          <Icon name="heroicons:check-circle" class="w-4 h-4 opacity-75" />
          {{ testSummary.passed }}
        </div>
        <div
          class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold shadow-sm transition-all"
        >
          <Icon name="heroicons:x-circle" class="w-4 h-4 opacity-75" />
          {{ testSummary.failed }}
        </div>
        <div
          class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold shadow-sm transition-all"
        >
          <Icon name="heroicons:minus-circle" class="w-4 h-4 opacity-75" />
          {{ testSummary.skipped }}
        </div>
      </div>

      <!-- Progress Bar -->
      <div
        class="w-full bg-slate-100 rounded-full h-2.5 shadow-inner border border-slate-200/50 flex overflow-hidden"
      >
        <!-- Completed Segment -->
        <div
          v-if="progressPercentage > 0"
          class="h-full transition-all duration-1000 ease-out relative overflow-hidden"
          :class="progressColorClass"
          :style="{ width: `${progressPercentage}%` }"
        >
          <div
            v-if="isTesting && progressPercentage < 100"
            class="absolute inset-0 bg-white/20 animate-[pulse_2s_ease-in-out_infinite]"
          />
        </div>

        <!-- Running Segment -->
        <div
          v-if="isTesting && runningPercentage > 0"
          class="h-full transition-all duration-1000 ease-out bg-amnimo-300 relative overflow-hidden"
          :style="{ width: `${runningPercentage}%` }"
        >
          <div
            class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"
          />
        </div>
      </div>
    </div>

    <div
      class="flex-1 overflow-y-auto p-4 space-y-4 relative custom-scrollbar bg-slate-50/50"
    >
      <div
        v-if="specs.length === 0"
        class="absolute inset-0 flex flex-col items-center justify-center text-slate-400"
      >
        <div
          class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-3 border border-slate-200 shadow-sm"
        >
          <Icon name="heroicons:inbox" class="w-8 h-8 opacity-50" />
        </div>
        <p class="text-sm font-medium">{{ $t("testProgress.queueIsEmpty") }}</p>
      </div>

      <div
        v-for="(spec, index) in specs"
        :key="spec.path"
        class="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm group/spec relative cursor-grab active:cursor-grabbing"
        :class="{ 'opacity-50 border-dashed border-slate-300': draggedSpecIndex === index }"
        draggable="true"
        @dragstart="onDragStart($event, index)"
        @dragover.prevent="onDragOver($event, index)"
        @dragenter.prevent
        @dragleave="onDragLeave"
        @drop.prevent="onDrop($event, index)"
        @dragend="onDragEnd"
        >
        <!-- Drop Line Indicator Top -->
        <div 
          v-if="dragOverSpecIndex === index && draggedSpecIndex !== null && draggedSpecIndex > index" 
          class="absolute -top-[2px] left-0 right-0 h-[3px] bg-amnimo-500 rounded-full z-10"
        />
        <!-- Drop Line Indicator Bottom -->
        <div 
          v-if="dragOverSpecIndex === index && draggedSpecIndex !== null && draggedSpecIndex < index" 
          class="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-amnimo-500 rounded-full z-10"
        />

        <!-- Spec Header -->
        <div
          class="relative flex items-center gap-3 px-4 py-3 bg-white transition-colors border-b border-slate-100 cursor-pointer select-none group/header"
          :class="{ 'bg-amnimo-50/20': spec.status === 'running' }"
          @click="toggleCollapse(spec.path)"
        >
          <!-- Spec Mini Progress Bar -->
          <div
            v-if="spec.innerTests.length > 0"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 opacity-80 flex"
          >
            <!-- Completed Segment -->
            <div
              v-if="getSpecProgress(spec).percentage > 0"
              class="h-full transition-all duration-1000 ease-out"
              :class="
                getSpecProgress(spec).hasFailed
                  ? 'bg-red-500'
                  : getSpecProgress(spec).percentage >= 100
                    ? 'bg-green-500'
                    : 'bg-amnimo-500'
              "
              :style="{ width: `${getSpecProgress(spec).percentage}%` }"
            />

            <!-- Running Segment -->
            <div
              v-if="
                spec.status === 'running' &&
                getSpecProgress(spec).runningPercentage > 0
              "
              class="h-full transition-all duration-1000 ease-out bg-amnimo-300 relative overflow-hidden"
              :style="{ width: `${getSpecProgress(spec).runningPercentage}%` }"
            >
              <div
                class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"
              />
            </div>
          </div>

          <div
            class="shrink-0 flex items-center justify-center w-6 h-6 rounded-full"
            :class="{
              'bg-slate-100': spec.status === 'waiting',
              'bg-amnimo-100 text-amnimo-600': spec.status === 'running',
              'bg-emerald-100 text-emerald-600': spec.status === 'passed',
              'bg-rose-100 text-rose-600': spec.status === 'failed',
            }"
          >
            <Icon
              v-if="spec.status === 'waiting'"
              name="heroicons:clock"
              class="w-3.5 h-3.5 text-slate-400"
            />
            <AppSpinner v-else-if="spec.status === 'running'" size="sm" />
            <Icon
              v-else-if="spec.status === 'passed'"
              name="heroicons:check"
              class="w-4 h-4"
            />
            <Icon
              v-else-if="spec.status === 'failed'"
              name="heroicons:x-mark"
              class="w-4 h-4"
            />
          </div>
          <div class="min-w-0 flex-1">
            <p
              class="text-sm font-extrabold text-slate-700 truncate"
              :title="spec.path"
            >
              {{ formatSpecName(spec.path) }}
            </p>
            <p
              v-if="spec.innerTests.length > 0"
              class="text-[11px] font-semibold mt-0.5 uppercase tracking-wide transition-colors"
              :class="
                getSpecProgress(spec).hasFailed
                  ? 'text-rose-500'
                  : 'text-slate-400'
              "
            >
              <span v-if="getSpecProgress(spec).completed > 0"
                >{{ getSpecProgress(spec).completed }} /
              </span>
              {{ spec.innerTests.length }} {{ $t("testProgress.tests") }}
            </p>
          </div>
          <div
            v-if="!isTesting"
            class="shrink-0 flex items-center opacity-0 group-hover/spec:opacity-100 transition-opacity"
          >
            <button
              class="w-7 h-7 flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-colors"
              :title="$t('testProgress.removeFile')"
              @click.stop="$emit('remove-file', spec.path)"
            >
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>
          <div
            class="shrink-0 text-slate-300 group-hover/header:text-slate-500 transition-colors ml-1"
          >
            <Icon
              :name="
                collapsedSpecs.has(spec.path)
                  ? 'heroicons:chevron-down'
                  : 'heroicons:chevron-up'
              "
              class="w-4 h-4 transition-transform duration-200"
            />
          </div>
        </div>

        <!-- Inner Tests (Visible if running or has inner tests) -->
        <div
          v-show="!collapsedSpecs.has(spec.path) && spec.innerTests.length > 0"
          class="bg-slate-50/30 p-2"
        >
          <div
            class="space-y-1 relative before:absolute before:inset-y-4 before:left-[20px] before:w-px before:bg-slate-200"
          >
            <div
              v-for="test in spec.innerTests"
              :key="test.id + test.name"
              class="relative flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors group/case"
            >
              <!-- Tree indicator line connecting to circle -->
              <div
                class="absolute left-[17px] top-1/2 w-3 h-px bg-slate-200 -z-10"
              />

              <div
                class="shrink-0 mt-0.5 ml-[5px] relative z-10 bg-slate-50/50 flex items-center justify-center w-[16px] h-[16px] rounded-full"
              >
                <AppSpinner
                  v-if="test.status === 'running'"
                  size="sm"
                  class="text-amnimo-500"
                />
                <Icon
                  v-else-if="test.status === 'PASSED'"
                  name="heroicons:check-circle-solid"
                  class="w-4 h-4 text-emerald-500"
                />
                <Icon
                  v-else-if="test.status === 'FAILED'"
                  name="heroicons:x-circle-solid"
                  class="w-4 h-4 text-rose-500"
                />
                <Icon
                  v-else-if="test.status === 'SKIPPED'"
                  name="heroicons:minus-circle-solid"
                  class="w-4 h-4 text-amber-500"
                />
                <div
                  v-else
                  class="w-3.5 h-3.5 rounded-full border-2 border-slate-300 bg-white mt-1"
                />
              </div>
              <div
                class="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span
                    v-if="test.id"
                    class="font-mono text-[11px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0"
                    >{{ test.id }}</span
                  >
                  <span
                    class="text-sm cursor-pointer font-medium text-slate-600 truncate group-hover/case:text-slate-900 transition-colors"
                    :title="test.name"
                    >{{ test.name }}</span
                  >
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <p
                    v-if="test.duration"
                    class="text-[11px] font-mono font-medium text-slate-400"
                  >
                    {{ test.duration }}
                  </p>
                  <button
                    v-if="!isTesting"
                    class="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white hover:bg-rose-500 rounded-md transition-all opacity-0 group-hover/case:opacity-100"
                    :title="$t('testProgress.removeCase')"
                    @click.stop="$emit('remove-case', spec.path, test.name)"
                  >
                    <Icon name="heroicons:x-mark" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
