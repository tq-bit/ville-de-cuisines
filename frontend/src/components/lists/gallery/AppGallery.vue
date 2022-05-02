<script setup lang="ts">
import { AppGalleryItemType } from '../../../@types/commons';
import AppGalleryItem from './AppGalleryItem.vue';

defineProps<{
  galleryItems: AppGalleryItemType[];
}>();
</script>

<template>
  <ul class="grid grid-cols-12 gap-8">
    <app-gallery-item
      class="col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6"
      v-for="item in galleryItems"
      :key="item.title"
      :item="item"
    ></app-gallery-item>
  </ul>
</template>

<style scoped></style>
