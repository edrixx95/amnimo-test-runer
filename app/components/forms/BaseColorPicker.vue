<script setup lang="ts">
const props = defineProps<{
  modelValue?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>

<template>
  <div class="flex items-center gap-2">
    <input 
      type="color" 
      :value="modelValue" 
      :disabled="disabled"
      @input="onInput"
      class="h-8 w-8 rounded cursor-pointer border-0 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <span class="text-sm text-slate-600 font-mono">{{ modelValue }}</span>
  </div>
</template>
