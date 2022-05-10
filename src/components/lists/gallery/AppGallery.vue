<script setup lang="ts">
import { AppGalleryItemType } from '../../../@types/commons';
import AppGalleryItem from './AppGalleryItem.vue';
withDefaults(
  defineProps<{
    columns?: 1 | 2 | 3;
    items: AppGalleryItemType[];
    buttonText: string;
    showCtaButton: boolean;
  }>(),
  {
    columns: 2,
    buttonText: 'Be the first to create something!',
    showCtaButton: false,
  },
);

const emit = defineEmits<{
  (event: 'click', item: AppGalleryItemType): void;
  (event: 'click-create'): void;
}>();
</script>

<template>
  <ul v-if="items.length > 0" class="grid grid-cols-12 gap-8">
    <app-gallery-item
      @click="emit('click', item)"
      class="col-span-12 sm:col-span-12"
      :class="{
        'md:col-span-12 lg:col-span-12': columns === 1,
        'md:col-span-6 lg:col-span-6': columns === 2,
        'md:col-span-4 lg:col-span-4': columns === 3,
      }"
      v-for="item in items"
      :key="item.title"
      :item="item"
    ></app-gallery-item>
  </ul>
  <div v-else class="text-center">
    <h2 class="mb-4 text-xl font-semibold">
      Seems there's no content here yet.
    </h2>
    <app-button v-if="showCtaButton">{{ buttonText }}</app-button>
  </div>
</template>

<style scoped></style>
