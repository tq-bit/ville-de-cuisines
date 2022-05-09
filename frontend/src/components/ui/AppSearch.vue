<script setup lang="ts">
import { ref, computed } from 'vue';
import { AppGalleryItemType } from '../../@types';
import { APP_DEBOUNCE_TIMEOUT } from '../../constants';

const props = withDefaults(
  defineProps<{
    hideLabel?: boolean;
    labelPrefix?: string;
    label?: string;
    placeholder?: string;
    modelValue?: any;
    options: any[];
    loading: boolean;
    size: 'small' | 'medium' | 'large';
  }>(),
  {
    hideLabel: false,
    required: false,
    loading: false,
    size: 'small',
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

const onClickItem = (item: AppGalleryItemType) => {
  emit('click-item', item);
  inputHasFocus.value = false;
};

const onBlur = () =>
  setTimeout(() => (inputHasFocus.value = false), APP_DEBOUNCE_TIMEOUT);
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
      @blur="onBlur"
      :value="modelValue"
      :placeholder="labelPrefix ? labelPrefix + label?.toLowerCase() : label || $attrs.placeholder as string"
    />
    <transition name="grow-top">
      <div
        v-if="isLoadingOrHasResults"
        class="w-full py-1 px-2"
        :class="{
          'absolute top-11 border-b-2 border-green-600 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200':
            size === 'small',
        }"
      >
        <svg-loader v-if="loading"></svg-loader>

        <app-feed
          v-else-if="loadingFinishedWithResults"
          @click="(option) => onClickItem(option)"
          :size="size"
          :items="options"
        ></app-feed>
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
