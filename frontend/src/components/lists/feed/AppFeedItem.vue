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
  }>(),
  {
    size: 'medium',
  },
);
</script>

<template>
  <li
    @mouseenter="setIsHovered(true)"
    @mouseleave="setIsHovered(false)"
    class="my-4 flex cursor-pointer"
    :class="{
      'h-12': size === 'small',
      'h-24': size === 'medium',
      'h-32': size === 'large',
    }"
  >
    <img
      class="rounded object-cover"
      :class="{
        'h-12 rounded-full': size === 'small',
        'h-24': size === 'medium',
        'h-32': size === 'large',
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
        :class="{
          'text-xl': size === 'medium',
          'text-2xl': size === 'large',
        }"
      >
        {{ item.title }}
      </h2>
      <p
        class="overflow-hidden overflow-ellipsis"
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
