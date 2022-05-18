<script setup lang="ts">
import { ref } from 'vue';
import { AppGalleryItemType } from '../../../@types/commons';

const isHovered = ref<boolean>(false);
const setIsHovered = (value: boolean) => {
  isHovered.value = value;
};

withDefaults(
  defineProps<{
    item: AppGalleryItemType;
    size?: 'small' | 'medium' | 'large';
    hideText?: boolean;
  }>(),
  {
    size: 'medium',
    hideText: false,
  },
);
</script>

<template>
  <li
    class="my-4 flex cursor-pointer"
    :class="{
      'h-12': size === 'small',
      'h-24': size === 'medium',
      'h-32': size === 'large',
    }"
    @mouseenter="setIsHovered(true)"
    @mouseleave="setIsHovered(false)"
  >
    <img
      class="rounded object-cover"
      :class="{
        'h-12 w-12 rounded-full': size === 'small',
        'h-24 w-24': size === 'medium',
        'h-32 w-32': size === 'large',
      }"
      :src="item.src"
      :alt="item.alt || item.title"
    />
    <section
      class="ml-4 flex w-full"
      :class="{
        'my-auto justify-between': size === 'small',
        'flex-col': size !== 'small',
      }"
    >
      <h2
        class="mb-2"
        :class="{
          'text-base': size === 'small',
          'text-xl': size === 'medium',
          'text-2xl': size === 'large',
        }"
      >
        {{ item.title }}
      </h2>
      <p
        v-if="item.text && !hideText"
        class="mb-0 overflow-hidden overflow-ellipsis"
        :class="{
          'max-w-xs whitespace-nowrap text-gray-500 dark:text-gray-400':
            size === 'small',
          'max-h-12': size === 'medium',
        }"
      >
        {{ item.text }}
      </p>
    </section>
  </li>
</template>

<style scoped></style>
