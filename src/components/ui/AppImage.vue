<script setup lang="ts">
defineProps<{
  src?: string;
  alt?: string;
  rounded?: boolean;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  cover?: 'medium' | 'large' | 'xlarge';
}>();
</script>

<template>
  <div class="w-full rounded-md bg-gradient-to-bl from-gray-50 to-gray-500">
    <img
      :src="src"
      :alt="alt"
      class="mx-auto h-auto w-full rounded border dark:border-gray-600"
      :class="{
        'h-48 object-cover': cover === 'medium',
        'h-64 object-cover': cover === 'large',
        'h-96 object-cover': cover === 'xlarge',
        'max-w-xs': size === 'xsmall',
        'max-w-sm': size === 'small',
        'max-w-md': size === 'medium',
        'max-w-lg': size === 'large',
        'max-w-xl': size === 'xlarge',
      }"
    />
  </div>
</template>

<style scoped></style>
