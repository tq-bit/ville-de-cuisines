<script setup lang="ts">
import { computed } from 'vue';
import iSearch from '../icons/iSearch.vue';

const props = withDefaults(
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

const isLoadingOrHasResults = computed(() => {
  return props.loading || props.options.length > 0;
});

const loadingFinishedWithResults = computed(() => {
  return !props.loading && props.options.length > 0;
});

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
    class="mb-1 block font-semibold text-green-600"
  >
    {{ label }}
  </label>
  <div class="relative mb-4">
    <span class="absolute m-2 ml-3 h-8 w-8 rounded text-green-600">
      <i-search></i-search>
    </span>
    <input
      class="h-12 w-full rounded border border-green-600 bg-gray-100 px-6 py-2 pl-14 text-gray-800 outline-none transition-all focus:bg-white dark:bg-gray-800 dark:text-gray-200 focus:dark:bg-gray-900"
      :class="{ 'rounded-b-none border-b-0': isLoadingOrHasResults }"
      v-bind="$attrs"
      @input="onInput"
      :value="modelValue"
      :placeholder="labelPrefix ? labelPrefix + label?.toLowerCase() : label || $attrs.placeholder as string"
    />
    <div
      v-if="isLoadingOrHasResults"
      class="absolute w-full rounded-b border-x border-b border-green-600 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    >
      <p class="py-2 px-4" v-if="loading">Loading ...</p>

      <ul v-else-if="loadingFinishedWithResults">
        <li
          tabindex="0"
          v-for="option in options"
          :key="option"
          class="cursor-pointer rounded py-2 px-4 transition-all hover:bg-green-500 hover:text-white dark:hover:bg-green-700"
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
