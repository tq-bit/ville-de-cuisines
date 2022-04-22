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
  }>(),
  {
    hideLabel: false,
    required: false,
    requiredSign: '*',
  },
);
const slots = useSlots();

const hasIconSlot = computed(() => !!slots.icon);

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
  (event: 'click-icon'): void;
}>();

const onInput = (ev: Event) =>
  emit('update:modelValue', (ev.target as HTMLInputElement).value);
</script>

<template>
  <div class="relative mb-4">
    <label
      v-if="label && !hideLabel"
      class="font-semibold block mb-1 text-green-600"
    >
      {{ label }}
    </label>

    <span
      @click="emit('click-icon')"
      tabindex="1"
      v-if="hasIconSlot"
      class="h-8 w-8 m-2 ml-4 rounded-full text-green-600 absolute"
      ><slot name="icon"
    /></span>

    <input
      class="h-12 px-6 py-4 w-full rounded-full text-gray-800 dark:text-gray-200 bg-gray-100 focus:bg-white dark:bg-gray-800 focus:dark:bg-gray-900 border-2 border-green-600 transition-all outline-none"
      :class="{ 'pl-12': hasIconSlot }"
      v-bind="$attrs"
      @input="onInput"
      :value="modelValue"
      :required="required"
      :placeholder="labelPrefix ? labelPrefix + label?.toLowerCase() : label || $attrs.placeholder as string"
    />
  </div>
</template>
