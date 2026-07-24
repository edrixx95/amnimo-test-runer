<template>
  <Transition name="modal">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[80] flex items-center justify-center p-4"
    >
      <div
        class="modal-backdrop fixed inset-0 bg-slate-900/60 backdrop-blur-sm transform-gpu will-change-opacity"
        @click="$emit('update:modelValue', false)"
      ></div>
      <div
        class="modal-content relative bg-white rounded-2xl shadow-glass w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden"
      >
        <div
          class="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0"
        >
          <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon name="heroicons:globe-alt" class="w-6 h-6 text-amnimo-500" />
            {{ $t("htmlReportViewer.title") }}
          </h3>
          <div class="flex items-center gap-3">
            <a
              :href="url"
              target="_blank"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:text-amnimo-600 hover:border-amnimo-200 transition-all shadow-sm active:scale-95"
            >
              <Icon
                name="heroicons:arrow-top-right-on-square"
                class="w-5 h-5"
              />
              {{ $t("htmlReportViewer.openInNewTab") }}
            </a>
            <button
              @click="$emit('update:modelValue', false)"
              class="text-slate-400 hover:text-amnimo-600 bg-slate-50 hover:bg-amnimo-50 p-2 rounded-xl transition-colors"
            >
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-hidden bg-slate-50 relative">
          <div
            v-if="isLoading"
            class="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 gap-4"
          >
            <AppLoader size="md" :text="$t('htmlReportViewer.loadingReport')" />
          </div>
          <iframe
            v-if="url"
            :src="url"
            class="w-full h-full border-none relative z-20"
            @load="isLoading = false"
          ></iframe>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: boolean;
  url: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const isLoading = ref(true);

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      isLoading.value = true;
    }
  },
);
</script>
