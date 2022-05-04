<script setup lang="ts">
defineProps<{
  src: string;
  alt?: string;
  rounded?: boolean;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  cover?: 'medium' | 'large';
}>();
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    class="mx-auto h-auto w-full rounded border dark:border-gray-600"
    :class="{
      'h-48 w-full rounded object-cover': cover === 'medium',
      'h-64 w-full rounded object-cover': cover === 'large',
      rounded: rounded,
      'max-w-xs': size === 'xsmall',
      'max-w-sm': size === 'small',
      'max-w-md': size === 'medium',
      'max-w-lg': size === 'large',
      'max-w-xl': size === 'xlarge',
    }"
  />
</template>

<style scoped></style>
