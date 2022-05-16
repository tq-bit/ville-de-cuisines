<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'warning' | 'warning-outline' | 'link';
    block?: boolean;
    loading?: boolean;
    link?: string;
    size?: 'small' | 'medium' | 'large';
  }>(),
  {
    variant: 'default',
    block: false,
    loading: false,
    size: 'medium',
  },
);
</script>

<template>
  <button
    v-bind="$attrs"
    class="max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded border-transparent p-2 px-4 font-semibold"
    :class="{
      'bg-gradient-to-bl from-green-400 to-green-500 text-gray-50  dark:from-green-600 dark:to-green-700':
        variant === 'default',
      'bg-gradient-to-bl from-amber-400 to-amber-500 text-gray-50  dark:from-amber-600 dark:to-amber-700':
        variant === 'warning',
      'border-2  border-amber-500 text-amber-500 hover:border-0 hover:bg-gradient-to-bl hover:from-amber-400 hover:to-amber-500 hover:text-gray-50 dark:border-amber-700 dark:text-amber-700 hover:dark:from-amber-600 hover:dark:to-amber-700 hover:dark:text-gray-50':
        variant === 'warning-outline',
      'w-full text-center': block,
      'opacity-60': loading,
      'h-10': size === 'medium',
      'text-sm': size === 'small',
      'text-green-500 dark:text-green-700': variant === 'link',
    }"
    :disabled="loading"
    :aria-disabled="loading"
    :aria-busy="loading"
  >
    <span v-if="loading">
      <svg-loader width="100%" height="100%" color="white"></svg-loader>
    </span>
    <span v-else><slot /></span>
  </button>
</template>

<style scoped>
/* Styles for the loader */
.loader {
  height: 20px;
  width: 20px;
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
