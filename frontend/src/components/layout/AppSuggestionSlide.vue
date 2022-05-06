<script setup lang="ts">
defineProps<{
  variant: 'top' | 'bottom';
}>();
</script>
<template>
  <section
    class="fixed left-12 right-12 -bottom-40 h-48 rounded-t border-t border-l border-r bg-gray-50 px-4 text-gray-800 transition-all hover:bottom-0 dark:bg-gray-800 dark:text-gray-200 md:left-28 md:right-28 lg:right-52 lg:left-52"
  >
    <header>
      <i-dots class="mx-auto cursor-pointer fill-green-600"></i-dots>
    </header>
    <slot></slot>
  </section>
</template>

<style scoped></style>
