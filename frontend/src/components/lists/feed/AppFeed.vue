<script setup lang="ts">
import { AppGalleryItemType } from '../../../@types';
import AppFeedItem from './AppFeedItem.vue';

defineProps<{
  items: AppGalleryItemType[];
  size?: 'small' | 'medium' | 'large';
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
      :size="size"
    ></app-feed-item>
  </ul>
</template>

<style scoped></style>
