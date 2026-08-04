<script setup lang="ts">
const props = defineProps<{
  modelValue?: any;
  options: { label: string; value: any; description?: string; disabled?: boolean }[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();
</script>

<template>
  <div class="space-y-4">
    <div v-for="opt in options" :key="opt.value" class="relative flex items-start">
      <div class="flex h-6 items-center">
        <input 
          type="radio" 
          :name="'radio-group-' + $.uid"
          :value="opt.value"
          :checked="modelValue === opt.value"
          :disabled="opt.disabled"
          @change="emit('update:modelValue', opt.value)"
          class="h-4 w-4 border-slate-300 text-amnimo-600 focus:ring-amnimo-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        />
      </div>
      <div class="ml-3 text-sm leading-6">
        <label class="font-medium text-slate-900" :class="{ 'opacity-50': opt.disabled }">{{ opt.label }}</label>
        <p v-if="opt.description" class="text-slate-500" :class="{ 'opacity-50': opt.disabled }">{{ opt.description }}</p>
      </div>
    </div>
  </div>
</template>
