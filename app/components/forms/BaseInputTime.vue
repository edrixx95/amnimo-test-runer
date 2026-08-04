<script setup lang="ts">
const props = defineProps<{
  modelValue?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <BaseInput 
    type="time" 
    :modelValue="modelValue"
    :disabled="disabled"
    @update:modelValue="(v) => emit('update:modelValue', v)"
  />
</template>
