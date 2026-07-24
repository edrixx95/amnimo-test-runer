<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
    isLoading?: boolean;
  }>(),
  {
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "danger",
    isLoading: false,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
}>();

const close = () => {
  if (props.isLoading) return;
  emit("update:modelValue", false);
};

const confirm = () => {
  emit("confirm");
};

const iconName = computed(() => {
  if (props.type === "danger") return "heroicons:exclamation-triangle";
  if (props.type === "warning") return "heroicons:exclamation-circle";
  return "heroicons:information-circle";
});

const iconBgClass = computed(() => {
  if (props.type === "danger") return "bg-red-100 dark:bg-red-900/30";
  if (props.type === "warning") return "bg-amber-100 dark:bg-amber-900/30";
  return "bg-blue-100 dark:bg-blue-900/30";
});

const iconColorClass = computed(() => {
  if (props.type === "danger") return "text-red-600 dark:text-red-400";
  if (props.type === "warning") return "text-amber-600 dark:text-amber-400";
  return "text-blue-600 dark:text-blue-400";
});

const confirmBtnClass = computed(() => {
  if (props.type === "danger")
    return "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700";
  if (props.type === "warning")
    return "bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700";
  return "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700";
});
</script>

<template>
  <Transition name="modal">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0"
    >
      <div
        class="modal-backdrop fixed inset-0 bg-slate-900/60 backdrop-blur-sm transform-gpu will-change-opacity"
        @click="close"
      />

      <div
        class="modal-content relative bg-white rounded-2xl shadow-glass w-full max-w-md overflow-hidden border border-slate-200"
      >
        <div class="px-6 py-6">
          <div class="flex items-start gap-4">
            <div
              class="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl"
              :class="iconBgClass"
            >
              <Icon :name="iconName" class="w-7 h-7" :class="iconColorClass" />
            </div>
            <div class="pt-1 min-w-0 flex-1">
              <h3 class="text-xl font-bold text-slate-900">{{ title }}</h3>
              <p
                class="mt-2 text-sm font-medium text-slate-600 leading-relaxed"
              >
                {{ message }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="px-6 py-5 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3"
        >
          <button
            type="button"
            :disabled="isLoading"
            class="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50 active:scale-95 shadow-sm"
            @click="close"
          >
            {{ cancelText === "Cancel" ? $t("common.cancel") : cancelText }}
          </button>
          <button
            type="button"
            :disabled="isLoading"
            class="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-5 py-2.5 text-sm font-bold text-white border border-transparent rounded-xl disabled:opacity-50 transition-all shadow-sm active:scale-95"
            :class="confirmBtnClass"
            @click="confirm"
          >
            <AppSpinner v-if="isLoading" size="sm" />
            {{ confirmText === "Confirm" ? $t("common.confirm") : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
