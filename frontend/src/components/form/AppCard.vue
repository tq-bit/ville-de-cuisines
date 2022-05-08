<script setup lang="ts">
defineProps<{
  center?: boolean;
  title?: string;
  block?: boolean;
  closable?: boolean;
}>();
const emit = defineEmits(['close']);
</script>

<template>
  <div
    class="relative mx-auto h-auto w-full rounded border bg-white p-4 shadow dark:border-gray-600 dark:bg-gray-800"
    :class="{ 'text-center': center, 'max-w-md': !block }"
  >
    <span
      v-if="closable"
      @click="emit('close')"
      class="absolute right-4 top-4 cursor-pointer"
    >
      <i-close></i-close>
    </span>
    <h3 class="mb-4 text-center text-2xl">{{ title }}</h3>
    <slot name="default" />
  </div>
</template>
