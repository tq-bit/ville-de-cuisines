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
      'block mx-auto text-center my-2': direction === 'vertical',
    }"
    :to="to"
  >
    <slot />
  </router-link>
</template>

<style scoped>
.router-link-active {
  @apply rounded bg-gray-100 text-green-500 dark:text-green-700 overflow-hidden;
}
</style>
