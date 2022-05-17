<script setup lang="ts">
withDefaults(
  defineProps<{
    to: string;
    variant?: 'default' | 'button';
  }>(),
  {
    variant: 'default',
  },
);
</script>

<template>
  <router-link
    class="w-fit rounded py-2 px-3 text-sm font-semibold"
    :class="{
      'text-green-600 transition-colors hover:bg-gray-100 hover:dark:bg-gray-700':
        variant === 'default',
      'bg-gradient-to-bl from-green-400 to-green-500  text-gray-50 dark:from-green-600 dark:to-green-700':
        variant === 'button',
    }"
    :to="to"
  >
    <slot />
  </router-link>
</template>
