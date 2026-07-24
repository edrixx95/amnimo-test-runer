<template>
  <div class="relative min-w-[140px]" ref="dropdownRef">
    <div
      @click="isOpen = !isOpen"
      class="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-pointer hover:bg-white hover:border-amnimo-500 transition-colors shadow-sm"
      :class="{ 'bg-white border-amnimo-500 ring-1 ring-amnimo-500': isOpen }"
    >
      <div class="flex items-center gap-2">
        <Icon v-if="icon" :name="icon" class="w-4 h-4 text-slate-400" />
        <span class="truncate">{{ selectedLabel }}</span>
      </div>
      <Icon
        name="heroicons:chevron-down"
        class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
        :class="{ 'rotate-180': isOpen }"
      />
    </div>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 w-full min-w-max mt-2 bg-white border border-slate-200 rounded-xl shadow-glass overflow-hidden right-0 origin-top-right"
      >
        <div class="max-h-60 overflow-y-auto custom-scrollbar py-1.5">
          <div
            v-for="option in options"
            :key="option.value"
            @click="selectOption(option.value)"
            class="px-3 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between gap-3"
            :class="[
              modelValue === option.value
                ? 'bg-amnimo-50 text-amnimo-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium',
            ]"
          >
            <span class="whitespace-nowrap">{{ option.label }}</span>
            <Icon
              v-if="modelValue === option.value"
              name="heroicons:check"
              class="w-4 h-4 text-amnimo-600 shrink-0"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  modelValue: string | number;
  options: { label: string; value: string | number }[];
  placeholder?: string;
  icon?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const { t } = useI18n();

const isOpen = ref(false);
const dropdownRef = ref(null);

onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});

const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue);
  return selected
    ? selected.label
    : props.placeholder || t("customSelect.select");
});

const selectOption = (value: string | number) => {
  emit("update:modelValue", value);
  isOpen.value = false;
};
</script>
