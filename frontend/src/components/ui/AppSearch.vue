<script setup lang="ts">
import { ref, computed } from 'vue';
import iSearch from '../icons/iSearch.vue';
import aniLoader from '../img/aniLoader.vue';
import AniLoader from '../img/aniLoader.vue';

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

const inputHasFocus = ref<boolean>(false);

const isLoadingOrHasResults = computed(() => {
  return inputHasFocus.value && (props.loading || props.options.length > 0);
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
    <span class="absolute right-0 m-2 ml-3 h-8 w-8 rounded text-green-600">
      <i-search></i-search>
    </span>
    <input
      ref="searchField"
      class="input h-12 pl-14"
      :class="{
        'focus:border-transparent': isLoadingOrHasResults,
      }"
      v-bind="$attrs"
      @input="onInput"
      @focus="inputHasFocus = true"
      @blur="inputHasFocus = false"
      :value="modelValue"
      :placeholder="labelPrefix ? labelPrefix + label?.toLowerCase() : label || $attrs.placeholder as string"
    />
    <transition name="grow-top">
      <div
        v-if="isLoadingOrHasResults"
        class="absolute top-11 w-full border-b-2 border-green-600 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      >
        <p class="py-2 px-4" v-if="loading">
          <ani-loader></ani-loader>
        </p>

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
    </transition>
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
