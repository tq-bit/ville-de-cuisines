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
    variant: 'default' | 'small';
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
    class="font-semibold block mb-1 text-green-600"
  >
    {{ label }}
  </label>

  <span
    @click="emit('click-icon')"
    v-if="hasIconSlot"
    class="h-8 w-8 m-2 ml-3 rounded text-green-600 absolute"
    :class="{ 'm-1': variant === 'small' }"
    ><slot name="icon"
  /></span>

  <input
    class="px-6 py-2 mb-4 w-full rounded text-gray-800 dark:text-gray-200 bg-gray-100 focus:bg-white dark:bg-gray-800 focus:dark:bg-gray-900 border border-green-600 transition-all outline-none"
    :class="{
      'h-12': variant === 'default',
      'pl-12': hasIconSlot,
      'h-8 mb-0 px-1 py-1': variant === 'small',
    }"
    v-bind="$attrs"
    @keypress.enter="onEnter"
    @input="onInput"
    :value="modelValue"
    :required="required"
    :placeholder="labelPrefix ? labelPrefix + label?.toLowerCase() : label || $attrs.placeholder as string"
  />

  <span
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
