<script setup lang="ts">
export interface AppGalleryItemType {
  src: string;
  alt: string;
  title: string;
}

defineProps<{
  item: AppGalleryItemType;
}>();
</script>

<template>
  <li
    class="w-full h-full cursor-pointer relative transition shadow rounded hover:scale-105"
  >
    <header>
      <img
        class="rounded h-auto w-full"
        :src="item.src"
        :alt="item.alt || item.title"
      />
    </header>
    <main>
      <div
        class="absolute rounded-bottom w-full bg-gray-100 dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 left-0 bottom-0"
      >
        <h4 class="font-semibold text-gray-800 dark:text-gray-100 text-center">
          {{ item.title }}
        </h4>
        <section class="px-2 py-1">
          <slot />
        </section>
      </div>
    </main>
  </li>
</template>

<style scoped></style>
