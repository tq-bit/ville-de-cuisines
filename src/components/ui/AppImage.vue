<script setup lang="ts">
defineProps<{
  src?: string;
  alt?: string;
  rounded?: boolean;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  cover?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
}>();
</script>

<template>
  <div
    class="mx-auto w-full rounded-md bg-gradient-to-bl from-gray-50 to-gray-500"
    :class="{
      'w-24': size === 'xsmall',
      'w-36': size === 'small',
      'w-48': size === 'medium',
      'w-64': size === 'large',
      'w-96': size === 'xlarge',
    }"
  >
    <img
      :src="src"
      :alt="alt"
      class="mx-auto h-auto w-full rounded object-cover"
      :class="{
        'h-24 ': cover === 'xsmall',
        'h-36 ': cover === 'small',
        'h-48 ': cover === 'medium',
        'h-64': cover === 'large',
        'h-96': cover === 'xlarge',
        'w-24': size === 'xsmall',
        'w-36': size === 'small',
        'w-48': size === 'medium',
        'w-64': size === 'large',
        'w-96': size === 'xlarge',
      }"
    />
  </div>
</template>

<style scoped></style>
