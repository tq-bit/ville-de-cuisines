<script setup lang="ts">
defineProps<{
  to: string;
  direction?: 'horizontal' | 'vertical';
}>();
</script>

<template>
  <router-link
    class="mx-2 p-2 text-sm font-semibold"
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
  @apply relative overflow-hidden text-green-400 dark:text-green-600;
}

.router-link-active::after {
  @apply absolute bottom-0 left-0 w-full border border-green-400 dark:border-green-600;
  content: '';
}
</style>
