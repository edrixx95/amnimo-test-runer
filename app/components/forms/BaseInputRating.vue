<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: number;
  max?: number;
  disabled?: boolean;
}>(), {
  modelValue: 0,
  max: 5,
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const setRating = (val: number) => {
  if (!props.disabled) {
    emit('update:modelValue', val);
  }
};
</script>

<template>
  <div class="flex items-center gap-1">
    <button
      v-for="i in max"
      :key="i"
      type="button"
      :disabled="disabled"
      @click="setRating(i)"
      class="focus:outline-none focus-visible:ring-2 focus-visible:ring-amnimo-600 rounded-sm transition-colors"
      :class="disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'"
    >
      <Icon 
        :name="i <= modelValue ? 'heroicons:star-solid' : 'heroicons:star'" 
        class="w-6 h-6"
        :class="i <= modelValue ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-300'"
      />
    </button>
  </div>
</template>
