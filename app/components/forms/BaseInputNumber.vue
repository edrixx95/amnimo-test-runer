<script setup lang="ts">
const props = defineProps<{
  modelValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const onInput = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value);
  if (!isNaN(val)) {
    emit('update:modelValue', val);
  }
};
</script>

<template>
  <BaseInput 
    type="number"
    :modelValue="modelValue?.toString()"
    :disabled="disabled"
    :min="min"
    :max="max"
    :step="step"
    @input="onInput"
  />
</template>
