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
  (event: 'update:modelValue', payload: boolean): void;
}>();

const onChange = (ev: Event) => {
  emit('update:modelValue', (ev.target as HTMLInputElement).checked);
};
</script>

<template>
  <label class="relative mb-4 flex cursor-pointer items-center">
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
      class="toggle-bg h-6 w-11 rounded-full bg-gray-100 transition-all focus:bg-white dark:bg-gray-800"
    ></div>
    <span
      v-if="label"
      class="text-md ml-3 font-medium text-gray-800 dark:text-gray-200"
      >{{ label }}</span
    >
  </label>
</template>

<style scoped>
.toggle-bg:after {
  content: '';
  @apply absolute top-0.5 left-0.5 h-5 w-5 rounded-full border border-gray-300 bg-white shadow-sm transition;
}

input:checked + .toggle-bg:after {
  transform: translateX(100%);
  @apply border-green-100;
}

input:checked + .toggle-bg {
  @apply bg-green-600;
}
</style>
