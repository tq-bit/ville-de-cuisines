<script setup lang="ts">
import { AppGalleryItemType } from '../../../@types/commons';

defineProps<{
  item: AppGalleryItemType;
}>();
</script>

<template>
  <li class="w-full cursor-pointer rounded transition hover:scale-105">
    <header class="relative h-48">
      <img
        class="h-48 w-full rounded-t bg-cover bg-center bg-no-repeat object-cover"
        :src="item.src"
        :alt="item.alt || item.title"
      />
    </header>
    <main class="p-2">
      <div class="w-full rounded-b">
        <h4 class="text-center font-semibold">
          {{ item.title }}
        </h4>
        <section class="p-2">
          <slot />
        </section>
      </div>
    </main>
  </li>
</template>

<style scoped></style>
