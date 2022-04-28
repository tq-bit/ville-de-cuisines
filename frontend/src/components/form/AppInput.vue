<script setup lang="ts">
import { computed, useSlots } from 'vue';

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
    variant?: 'default' | 'small';
  }>(),
  {
    hideLabel: false,
    required: false,
    requiredSign: '*',
    variant: 'default',
  },
);
const slots = useSlots();

const hasIconSlot = computed(() => !!slots.icon);
const hasPostfixSlot = computed(() => !!slots.postfix);

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
  (event: 'enter', payload: string): void;
  (event: 'click-icon'): void;
  (event: 'click-postfix'): void;
}>();

const onInput = (ev: Event) =>
  emit('update:modelValue', (ev.target as HTMLInputElement).value);

const onEnter = (ev: Event) =>
  emit('enter', (ev.target as HTMLInputElement).value);
</script>

<template>
  <label
    v-if="label && !hideLabel"
    class="mb-1 block font-semibold text-green-600"
  >
    {{ label }}
  </label>

  <span
    @click="emit('click-icon')"
    v-if="hasIconSlot"
    class="absolute m-2 ml-3 h-8 w-8 rounded text-green-600"
    :class="{ 'm-1': variant === 'small' }"
    ><slot name="icon"
  /></span>

  <input
    class="mb-4 w-full rounded border border-green-600 bg-gray-100 px-6 py-2 text-gray-800 outline-none transition-all focus:bg-white dark:bg-gray-800 dark:text-gray-200 focus:dark:bg-gray-900"
    :class="{
      'h-12': variant === 'default',
      'pl-12': hasIconSlot,
      'mb-0 h-8 px-1 py-1': variant === 'small',
    }"
    v-bind="$attrs"
    @keypress.enter="onEnter"
    @input="onInput"
    :value="modelValue"
    :required="required"
    :placeholder="labelPrefix ? labelPrefix + label?.toLowerCase() : label || $attrs.placeholder as string"
  />

  <span
    v-if="hasPostfixSlot"
    class="inline"
    :class="{ 'p-1': variant === 'small' }"
    @click="emit('click-postfix')"
    ><slot name="postfix"></slot
  ></span>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
