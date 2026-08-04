<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  modelValue?: string[];
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const inputValue = ref('');

const addTag = () => {
  const val = inputValue.value.trim();
  if (val && !(props.modelValue || []).includes(val)) {
    const newValue = [...(props.modelValue || []), val];
    emit('update:modelValue', newValue);
    inputValue.value = '';
  }
};

const removeTag = (tag: string) => {
  const newValue = (props.modelValue || []).filter(t => t !== tag);
  emit('update:modelValue', newValue);
};
</script>

<template>
  <div class="min-h-[38px] flex flex-wrap items-center gap-2 p-1.5 rounded-md border-0 ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amnimo-600 bg-white" :class="{'opacity-50 cursor-not-allowed bg-slate-50': disabled}">
    <span 
      v-for="tag in modelValue" 
      :key="tag" 
      class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amnimo-50 text-amnimo-700 text-sm font-medium"
    >
      {{ tag }}
      <button v-if="!disabled" type="button" @click="removeTag(tag)" class="text-amnimo-400 hover:text-amnimo-600 focus:outline-none">
        <Icon name="heroicons:x-mark" class="w-3 h-3" />
      </button>
    </span>
    <input 
      type="text" 
      v-model="inputValue"
      @keydown.enter.prevent="addTag"
      :placeholder="(modelValue?.length || 0) === 0 ? placeholder : ''"
      :disabled="disabled"
      class="flex-1 min-w-[60px] border-none p-0 focus:ring-0 text-sm bg-transparent disabled:cursor-not-allowed"
    />
  </div>
</template>
