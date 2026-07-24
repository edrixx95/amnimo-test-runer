<script setup lang="ts">
import { computed } from "vue";

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
}>();

const _emit = defineEmits<{
  (e: "remove-file", path: string): void;
  (e: "remove-case", path: string, caseName: string): void;
}>();

const completedSpecs = computed(
  () =>
    props.specs.filter((s) => s.status === "passed" || s.status === "failed")
      .length,
);
const hasFailed = computed(() =>
  props.specs.some((s) => s.status === "failed"),
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
  if (props.specs.length === 0) return 0;
  return (completedSpecs.value / props.specs.length) * 100;
});

const progressColorClass = computed(() => {
  if (hasFailed.value) return "bg-red-500";
  if (progressPercentage.value === 100) return "bg-green-500";
  return "bg-blue-500";
});

const formatSpecName = (pathStr: string) => {
  const parts = pathStr.split(/[\\/]/);
  return parts.slice(-2).join("/") || pathStr;
};
</script>

<template>
  <div
    class="flex flex-col h-full bg-white border border-slate-200 overflow-hidden shadow-soft"
  >
    <div class="p-5 border-b border-slate-100 bg-slate-50/50">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-bold text-slate-800 flex items-center gap-2">
          <Icon name="heroicons:queue-list" class="w-5 h-5 text-amnimo-500" />
          {{ $t("testProgress.testQueue") }}
        </h3>
        <span
          class="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm"
          :title="$t('testProgress.completedSuites')"
        >
          {{ completedSpecs }} / {{ specs.length }}
        </span>
      </div>

      <!-- Inner Tests Summary -->
      <div v-if="specs.length > 0" class="flex gap-2 mb-3">
        <div
          class="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100/50 shadow-sm"
        >
          <Icon name="heroicons:check-circle" class="w-4 h-4" />
          {{ testSummary.passed }}
        </div>
        <div
          class="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold border border-rose-100/50 shadow-sm"
        >
          <Icon name="heroicons:x-circle" class="w-4 h-4" />
          {{ testSummary.failed }}
        </div>
        <div
          class="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100/50 shadow-sm"
        >
          <Icon name="heroicons:minus-circle" class="w-4 h-4" />
          {{ testSummary.skipped }}
        </div>
      </div>

      <!-- Progress Bar -->
      <div
        class="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner"
      >
        <div
          class="h-3 rounded-full transition-all duration-700 ease-out flex items-center justify-end relative overflow-hidden"
          :class="progressColorClass"
          :style="{ width: `${progressPercentage}%` }"
        >
          <div
            v-if="isTesting"
            class="absolute inset-0 bg-white/20 animate-[pulse_2s_ease-in-out_infinite]"
          />
          <div
            v-if="isTesting"
            class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"
          />
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-3 space-y-3 relative custom-scrollbar">
      <div
        v-if="specs.length === 0"
        class="absolute inset-0 flex flex-col items-center justify-center text-slate-400"
      >
        <div
          class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 border border-slate-100 shadow-sm"
        >
          <Icon name="heroicons:inbox" class="w-8 h-8 opacity-50" />
        </div>
        <p class="text-sm font-medium">{{ $t("testProgress.queueIsEmpty") }}</p>
      </div>

      <div
        v-for="spec in specs"
        :key="spec.path"
        class="border border-slate-100 rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md bg-white"
      >
        <!-- Spec Header -->
        <div
          class="flex items-center gap-3 p-2 bg-white transition-colors"
          :class="{ 'bg-amnimo-50/30': spec.status === 'running' }"
        >
          <div class="shrink-0">
            <Icon
              v-if="spec.status === 'waiting'"
              name="heroicons:clock"
              class="w-5 h-5 text-slate-300"
            />
            <AppSpinner
              v-else-if="spec.status === 'running'"
              size="md"
              class="text-amnimo-500"
            />
            <Icon
              v-else-if="spec.status === 'passed'"
              name="heroicons:check-circle"
              class="w-5 h-5 text-emerald-500"
            />
            <Icon
              v-else-if="spec.status === 'failed'"
              name="heroicons:x-circle"
              class="w-5 h-5 text-rose-500"
            />
          </div>
          <div class="min-w-0 flex-1">
            <p
              class="text-sm font-bold text-slate-800 truncate"
              :title="spec.path"
            >
              {{ formatSpecName(spec.path) }}
            </p>
            <p
              v-if="spec.innerTests.length > 0"
              class="text-xs font-medium text-slate-500 mt-0.5"
            >
              {{ spec.innerTests.length }} {{ $t("testProgress.tests") }}
            </p>
          </div>
          <div v-if="!isTesting" class="shrink-0 flex items-center">
            <button
              class="w-6 h-6 flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-colors"
              :title="$t('testProgress.removeFile')"
              @click.stop="$emit('remove-file', spec.path)"
            >
              <Icon name="heroicons:minus" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Inner Tests (Visible if running or has inner tests) -->
        <div
          v-if="spec.innerTests.length > 0"
          class="border-t border-slate-100 bg-slate-50/50"
        >
          <ul class="divide-y divide-slate-100/80">
            <li
              v-for="test in spec.innerTests"
              :key="test.id"
              class="p-2 pl-10 flex items-start gap-3 hover:bg-slate-100/50 transition-colors"
            >
              <div class="shrink-0 mt-0.5">
                <AppSpinner
                  v-if="test.status === 'running'"
                  size="sm"
                  class="text-amnimo-500"
                />
                <Icon
                  v-else-if="test.status === 'PASSED'"
                  name="heroicons:check-circle"
                  class="w-4 h-4 text-emerald-500"
                />
                <Icon
                  v-else-if="test.status === 'FAILED'"
                  name="heroicons:x-circle"
                  class="w-4 h-4 text-rose-500"
                />
                <Icon
                  v-else-if="test.status === 'SKIPPED'"
                  name="heroicons:minus-circle"
                  class="w-4 h-4 text-amber-500"
                />
              </div>
              <div
                class="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span
                    class="font-mono text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm shrink-0"
                    >{{ test.id }}</span
                  >
                  <span
                    class="text-sm font-medium text-slate-500 truncate"
                    :title="test.name"
                    >{{ test.name }}</span
                  >
                </div>
                <p
                  v-if="test.duration"
                  class="text-xs font-mono text-slate-400 shrink-0"
                >
                  {{ test.duration }}
                </p>
                <button
                  v-if="!isTesting"
                  class="shrink-0 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                  :title="$t('testProgress.removeCase')"
                  @click.stop="$emit('remove-case', spec.path, test.name)"
                >
                  <Icon name="heroicons:minus" class="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
