<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  modelValue?: any;
  options: { label: string; value: any }[];
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const isOpen = ref(false);

const selectOption = (opt: any) => {
  emit('update:modelValue', opt.value);
  isOpen.value = false;
};

const selectedLabel = computed(() => {
  const selected = props.options.find(o => o.value === props.modelValue);
  return selected ? selected.label : props.placeholder || 'Select...';
});
</script>

<template>
  <div class="relative">
    <button 
      type="button" 
      :disabled="disabled"
      @click="isOpen = !isOpen"
      class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:outline-none focus:ring-2 focus:ring-amnimo-600 sm:text-sm sm:leading-6 disabled:bg-slate-50 disabled:opacity-50"
    >
      <span class="block truncate" :class="!modelValue ? 'text-slate-400' : ''">{{ selectedLabel }}</span>
      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <Icon name="heroicons:chevron-up-down" class="h-5 w-5 text-slate-400" aria-hidden="true" />
      </span>
    </button>

    <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <ul v-if="isOpen" class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        <li 
          v-for="opt in options" 
          :key="opt.value"
          @click="selectOption(opt)"
          class="text-slate-900 relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-amnimo-50 hover:text-amnimo-900"
          :class="modelValue === opt.value ? 'bg-amnimo-50 font-semibold text-amnimo-900' : ''"
        >
          <span class="block truncate">{{ opt.label }}</span>
          <span v-if="modelValue === opt.value" class="absolute inset-y-0 right-0 flex items-center pr-4 text-amnimo-600">
            <Icon name="heroicons:check" class="h-5 w-5" aria-hidden="true" />
          </span>
        </li>
      </ul>
    </transition>
  </div>
</template>
