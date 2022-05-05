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
    class="cursor-pointer"
  >
    <main class="relative">
      <section
        v-if="isHovered"
        class="absolute flex h-48 w-full items-center justify-center text-lg transition-all"
        :class="{
          'bg-gray-800 bg-opacity-70 ': isHovered,
        }"
      >
        <h4 class="text-white">{{ item.title }}</h4>
      </section>
      <app-image :src="item.src" rounded cover="medium"></app-image>
    </main>
  </li>
</template>

<style scoped></style>
