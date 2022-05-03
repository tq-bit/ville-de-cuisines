<script setup lang="ts">
import { ref } from 'vue';
import { AppGalleryItemType } from '../../../@types/commons';

const isHovered = ref<boolean>(false);
const setIsHovered = (value: boolean) => {
  isHovered.value = value;
};

defineProps<{
  item: AppGalleryItemType;
}>();
</script>

<template>
  <li
    @mouseenter="setIsHovered(true)"
    @mouseleave="setIsHovered(false)"
    class="my-4 flex h-24 cursor-pointer rounded border border-gray-600"
  >
    <img
      class="h-24 w-24 rounded object-cover"
      :src="item.src"
      :alt="item.alt || item.title"
    />
    <section class="w-full p-2">
      <h4 class="text-lg text-white">{{ item.title }}</h4>
    </section>
  </li>
</template>

<style scoped></style>
