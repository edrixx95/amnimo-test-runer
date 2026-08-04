<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
};
</script>

<template>
  <button 
    type="button" 
    :disabled="disabled"
    @click="toggle"
    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amnimo-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="modelValue ? 'bg-amnimo-600' : 'bg-slate-200'"
  >
    <span 
      aria-hidden="true" 
      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
      :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
    ></span>
  </button>
</template>
