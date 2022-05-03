<script setup lang="ts">
import { AppGalleryItemType } from '../../../@types/commons';
import AppFeedItem from './AppFeedItem.vue';

defineProps<{
  items: AppGalleryItemType[];
}>();

const emit = defineEmits<{
  (event: 'click', item: AppGalleryItemType): void;
}>();
</script>

<template>
  <ul>
    <app-feed-item
      @click="emit('click', item)"
      v-for="item in items"
      :key="item.title"
      :item="item"
    ></app-feed-item>
  </ul>
</template>

<style scoped></style>
