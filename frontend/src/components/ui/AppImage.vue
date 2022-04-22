<script setup lang="ts">
defineProps<{
  src: string;
  alt?: string;
  rounded?: boolean;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
}>();
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    class="w-full h-auto mx-auto"
    :class="{
      'rounded-full': rounded,
      'max-w-xs': size === 'xsmall',
      'max-w-sm': size === 'small',
      'max-w-md': size === 'medium',
      'max-w-lg': size === 'large',
      'max-w-xl': size === 'xlarge',
    }"
  />
</template>

<style scoped></style>
