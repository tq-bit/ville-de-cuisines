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

const onClick = (item: AppGalleryItemType) => {
  emit('click', item);
};
</script>

<template>
  <ul>
    <app-feed-item
      @click="() => onClick(item)"
      v-for="item in items"
      :key="item.title"
      :item="item"
      :size="size"
    ></app-feed-item>
  </ul>
</template>

<style scoped></style>
