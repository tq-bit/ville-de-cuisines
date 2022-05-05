<script setup lang="ts">
defineProps<{
  to: string;
  direction?: 'horizontal' | 'vertical';
}>();
</script>

<template>
  <router-link
    class="mx-2 p-2 font-semibold"
    :class="{
      'mx-auto my-2 block text-center': direction === 'vertical',
    }"
    :to="to"
  >
    <slot />
  </router-link>
</template>

<style scoped>
.router-link-active {
  @apply overflow-hidden rounded bg-gray-100 text-green-500 dark:text-green-700;
}
</style>
