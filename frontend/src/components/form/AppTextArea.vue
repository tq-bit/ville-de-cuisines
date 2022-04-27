<script setup lang="ts">
import { computed } from 'vue';

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
  (event: 'click-icon'): void;
}>();

const onInput = (ev: Event) =>
  emit('update:modelValue', (ev.target as HTMLInputElement).value);
</script>

<template>
  <label
    v-if="label && !hideLabel"
    class="mb-1 block font-semibold text-green-600"
  >
    {{ label }}
  </label>

  <textarea
    class="mb-4 max-h-screen w-full overflow-auto rounded border border-green-600 bg-gray-100 px-6 py-3 text-gray-800 outline-none transition-all focus:bg-white dark:bg-gray-800 dark:text-gray-200 focus:dark:bg-gray-900"
    v-bind="$attrs"
    @input="onInput"
    :value="modelValue"
    :required="required"
    :placeholder="labelPrefix ? labelPrefix + label?.toLowerCase() : label || $attrs.placeholder as string"
  />
</template>
