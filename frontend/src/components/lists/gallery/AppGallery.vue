<script setup lang="ts">
import { AppGalleryItemType } from '../../../@types/commons';
import AppGalleryItem from './AppGalleryItem.vue';

defineProps<{
  galleryItems: AppGalleryItemType[];
}>();
</script>

<template>
  <ul class="grid grid-cols-12 gap-4">
    <app-gallery-item
      class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-6"
      v-for="item in galleryItems"
      :key="item.title"
      :item="item"
    >
      Test</app-gallery-item
    >
  </ul>
</template>

<style scoped></style>
