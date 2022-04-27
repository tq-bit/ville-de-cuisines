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
    class="relative h-full w-full cursor-pointer rounded shadow transition hover:scale-105"
  >
    <header>
      <img
        class="h-auto w-full rounded"
        :src="item.src"
        :alt="item.alt || item.title"
      />
    </header>
    <main>
      <div
        class="rounded-bottom absolute left-0 bottom-0 w-full bg-gray-100 bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80"
      >
        <h4 class="text-center font-semibold text-gray-800 dark:text-gray-100">
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
