<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

const props = withDefaults(defineProps<{
  modelValue?: string;
  length?: number;
  disabled?: boolean;
}>(), {
  modelValue: '',
  length: 4
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const values = ref<string[]>(Array(props.length).fill(''));
const inputs = ref<HTMLInputElement[]>([]);

watch(() => props.modelValue, (newVal) => {
  const chars = (newVal || '').split('').slice(0, props.length);
  for (let i = 0; i < props.length; i++) {
    values.value[i] = chars[i] || '';
  }
}, { immediate: true });

const onInput = (index: number, e: Event) => {
  const target = e.target as HTMLInputElement;
  values.value[index] = target.value.slice(-1);
  emit('update:modelValue', values.value.join(''));
  
  if (target.value && index < props.length - 1) {
    inputs.value[index + 1]?.focus();
  }
};

const onKeydown = (index: number, e: KeyboardEvent) => {
  if (e.key === 'Backspace' && !values.value[index] && index > 0) {
    inputs.value[index - 1]?.focus();
  }
};
</script>

<template>
  <div class="flex gap-2 items-center">
    <input 
      v-for="(val, idx) in values" 
      :key="idx"
      ref="inputs"
      type="text"
      inputmode="numeric"
      maxlength="1"
      :value="val"
      :disabled="disabled"
      @input="(e) => onInput(idx, e)"
      @keydown="(e) => onKeydown(idx, e)"
      class="w-12 h-14 text-center text-xl font-semibold rounded-md border-0 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-amnimo-600 disabled:bg-slate-50 disabled:opacity-50"
    />
  </div>
</template>
