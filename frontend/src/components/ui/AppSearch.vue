<script setup lang="ts">
import { ref } from 'vue';
import iSearch from '../icons/iSearch.vue';

withDefaults(
  defineProps<{
    hideLabel?: boolean;
    labelPrefix?: string;
    label?: string;
    placeholder?: string;
    modelValue?: any;
    options: any[];
    loading: boolean;
    listKey: string;
  }>(),
  {
    hideLabel: false,
    required: false,
    loading: false,
  },
);

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
  (event: 'click-item', payload: any): void;
}>();

const onInput = (ev: Event) =>
  emit('update:modelValue', (ev.target as HTMLInputElement).value);
</script>

<template>
  <label
    v-if="label && !hideLabel"
    class="font-semibold block mb-1 text-green-600"
  >
    {{ label }}
  </label>
  <div class="relative mb-4">
    <span tabindex="1" class="h-8 w-8 m-2 ml-3 rounded text-green-600 absolute">
      <i-search></i-search>
    </span>
    <input
      class="h-12 pl-14 px-6 py-2 w-full rounded text-gray-800 dark:text-gray-200 bg-gray-100 focus:bg-white dark:bg-gray-800 focus:dark:bg-gray-900 border border-green-600 transition-all outline-none"
      :class="{ 'border-b-0 rounded-b-none': options.length > 0 }"
      v-bind="$attrs"
      @input="onInput"
      :value="modelValue"
      :placeholder="labelPrefix ? labelPrefix + label?.toLowerCase() : label || $attrs.placeholder as string"
    />
    <div
      v-if="loading || options.length > 0"
      class="absolute w-full text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-b border-b border-x border-green-600"
    >
      <span class="py-2 px-4" v-if="loading"> Loading ...</span>

      <ul v-else-if="options.length > 0 && !loading">
        <li
          v-for="option in options"
          :key="option"
          class="py-2 px-4 cursor-pointer hover:bg-green-500 dark:hover:bg-green-700 hover:text-white rounded transition-all"
          @click="emit('click-item', option)"
        >
          {{ option[listKey] }}
        </li>
      </ul>
    </div>
  </div>
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
