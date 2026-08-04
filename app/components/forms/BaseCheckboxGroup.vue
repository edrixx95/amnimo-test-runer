<script setup lang="ts">
const props = defineProps<{
  modelValue?: any[];
  options: { label: string; value: any; description?: string; disabled?: boolean }[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void;
}>();

const onUpdate = (value: any, isChecked: boolean) => {
  let newValue = [...(props.modelValue || [])];
  if (isChecked) {
    if (!newValue.includes(value)) newValue.push(value);
  } else {
    newValue = newValue.filter(v => v !== value);
  }
  emit('update:modelValue', newValue);
};
</script>

<template>
  <div class="space-y-4">
    <BaseCheckbox
      v-for="opt in options"
      :key="opt.value"
      :label="opt.label"
      :description="opt.description"
      :disabled="opt.disabled"
      :modelValue="(modelValue || []).includes(opt.value)"
      @update:modelValue="(checked) => onUpdate(opt.value, checked)"
    />
  </div>
</template>
