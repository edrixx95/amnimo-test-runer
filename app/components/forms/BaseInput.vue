<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: string;
  trailingIcon?: string;
}>(), {
  type: 'text'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>

<template>
  <div class="relative rounded-md shadow-sm">
    <div v-if="icon" class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <Icon :name="icon" class="h-5 w-5 text-slate-400" aria-hidden="true" />
    </div>
    <input 
      :type="type" 
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
      class="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-amnimo-600 sm:text-sm sm:leading-6 disabled:bg-slate-50 disabled:text-slate-500 disabled:ring-slate-200"
      :class="[
        icon ? 'pl-10' : 'pl-3',
        trailingIcon ? 'pr-10' : 'pr-3'
      ]"
    />
    <div v-if="trailingIcon" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <Icon :name="trailingIcon" class="h-5 w-5 text-slate-400" aria-hidden="true" />
    </div>
  </div>
</template>
