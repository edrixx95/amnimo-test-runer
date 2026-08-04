<script setup lang="ts">
const props = defineProps<{
  modelValue?: string | Date;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>

<template>
  <!-- Basic native implementation for BaseCalendar -->
  <div class="relative">
    <input 
      type="date" 
      :value="modelValue"
      @input="onInput"
      class="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-amnimo-600 sm:text-sm sm:leading-6 bg-white"
    />
  </div>
</template>
