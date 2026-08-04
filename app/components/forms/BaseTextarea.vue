<script setup lang="ts">
const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value);
};
</script>

<template>
  <textarea 
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows || 3"
    :disabled="disabled"
    @input="onInput"
    class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-amnimo-600 sm:text-sm sm:leading-6 disabled:bg-slate-50 disabled:opacity-50"
  ></textarea>
</template>
