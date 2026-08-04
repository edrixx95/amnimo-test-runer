<script setup lang="ts">
// Simple baseline Listbox
const props = defineProps<{
  modelValue?: any;
  options: { label: string; value: any }[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();
</script>

<template>
  <div class="rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm">
    <ul class="max-h-60 overflow-auto outline-none">
      <li 
        v-for="opt in options" 
        :key="opt.value"
        @click="emit('update:modelValue', opt.value)"
        class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-slate-50 transition-colors"
        :class="modelValue === opt.value ? 'bg-amnimo-50 text-amnimo-900 font-semibold' : 'text-slate-900'"
      >
        <span class="block truncate">{{ opt.label }}</span>
        <span v-if="modelValue === opt.value" class="absolute inset-y-0 right-0 flex items-center pr-4 text-amnimo-600">
          <Icon name="heroicons:check" class="h-5 w-5" aria-hidden="true" />
        </span>
      </li>
    </ul>
  </div>
</template>
