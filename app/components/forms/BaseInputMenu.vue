<script setup lang="ts">
// Simplified InputMenu wrapper using datalist for baseline implementation
import { ref } from 'vue';

const props = defineProps<{
  modelValue?: string;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const datalistId = 'dl-' + Math.random().toString(36).substring(2, 9);
</script>

<template>
  <div class="relative">
    <BaseInput 
      :modelValue="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @update:modelValue="(v) => emit('update:modelValue', v)"
      :list="datalistId"
      trailingIcon="heroicons:chevron-up-down"
    />
    <datalist :id="datalistId">
      <option v-for="opt in options" :key="opt" :value="opt"></option>
    </datalist>
  </div>
</template>
