<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean;
  label?: string;
  description?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const onChange = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).checked);
};
</script>

<template>
  <div class="relative flex items-start">
    <div class="flex h-6 items-center">
      <input 
        type="checkbox" 
        :checked="modelValue"
        :disabled="disabled"
        @change="onChange"
        class="h-4 w-4 rounded border-slate-300 text-amnimo-600 focus:ring-amnimo-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      />
    </div>
    <div v-if="label || description || $slots.label" class="ml-3 text-sm leading-6">
      <label class="font-medium text-slate-900" :class="{ 'opacity-50': disabled }">
        <slot name="label">{{ label }}</slot>
      </label>
      <p v-if="description" class="text-slate-500" :class="{ 'opacity-50': disabled }">{{ description }}</p>
    </div>
  </div>
</template>
