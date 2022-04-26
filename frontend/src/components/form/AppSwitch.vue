<script setup lang="ts">
withDefaults(
  defineProps<{
    hideLabel?: boolean;
    labelPrefix?: string;
    label?: string;
    placeholder?: string;
    modelValue?: any;
    error?: string;
    required?: boolean;
    requiredSign?: string;
  }>(),
  {
    hideLabel: false,
    required: false,
    requiredSign: '*',
  },
);

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
}>();

const onChange = (ev: Event) =>
  emit('update:modelValue', (ev.target as HTMLInputElement).value);
</script>

<template>
  <label class="flex items-center cursor-pointer relative mb-4">
    <input
      v-bind="$attrs"
      @change="onChange"
      :checked="modelValue"
      :required="required"
      :aria-label="label"
      :aria-required="required"
      :aria-checked="modelValue"
      type="checkbox"
      class="sr-only"
    />
    <div
      class="h-6 w-11 rounded-full toggle-bg bg-gray-100 focus:bg-white dark:bg-gray-800 border-2 border-green-600"
    ></div>
    <span
      v-if="label"
      class="ml-3 text-gray-800 dark:text-gray-200 text-md font-medium"
      >{{ label }}</span
    >
  </label>
</template>

<style scoped>
.toggle-bg:after {
  content: '';
  @apply absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition shadow-sm;
}

input:checked + .toggle-bg:after {
  transform: translateX(100%);
  @apply border-green-100;
}

input:checked + .toggle-bg {
  @apply bg-green-600;
}
</style>
