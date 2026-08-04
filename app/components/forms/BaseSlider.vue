<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const onInput = (e: Event) => {
  emit('update:modelValue', parseFloat((e.target as HTMLInputElement).value));
};
</script>

<template>
  <div class="relative flex items-center w-full h-5">
    <input 
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      :disabled="disabled"
      @input="onInput"
      class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amnimo-600 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
</template>
