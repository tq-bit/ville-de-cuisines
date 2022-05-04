<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'warning' | 'warning-outline' | 'ghost';
    block?: boolean;
    loading?: boolean;
    link?: string;
  }>(),
  {
    variant: 'default',
    block: false,
    loading: false,
  },
);
</script>

<template>
  <button
    v-bind="$attrs"
    class="h-10 rounded border-transparent px-4 py-2 font-semibold"
    :class="{
      'bg-gradient-to-bl from-green-400 to-green-500 text-gray-50  dark:from-green-600 dark:to-green-700':
        variant === 'default',
      'bg-gradient-to-bl from-orange-400 to-orange-500 text-gray-50  dark:from-orange-600 dark:to-orange-700':
        variant === 'warning',
      'border-2  border-orange-500 text-orange-500 hover:border-0 hover:bg-gradient-to-bl hover:from-orange-400 hover:to-orange-500 hover:text-gray-50 dark:border-orange-700 dark:text-orange-700 hover:dark:from-orange-600 hover:dark:to-orange-700 hover:dark:text-gray-50':
        variant === 'warning-outline',
      'w-full text-center': block,
    }"
    :disabled="loading"
    :aria-disabled="loading"
    :aria-busy="loading"
  >
    <slot />
  </button>
</template>

<style scoped>
/* Styles for the loader */
.loader {
  display: block;
  margin: auto;
  padding: var(0.25rem);
  border-radius: 50%;
  border-right: 2px solid transparent;
  animation: fullRotation var(0.5s) linear infinite;
}
@keyframes fullRotation {
  to {
    transform: rotate(360deg);
  }
}
</style>
