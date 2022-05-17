<script setup lang="ts">
defineProps<{
  count: number;
  unit: string;
  title: string;
  color: 'sky' | 'amber' | 'rose';
}>();
</script>

<template>
  <div
    class="mx-auto h-auto w-full max-w-sm rounded-md border bg-gradient-to-bl p-4 text-white"
    :class="{
      'border-sky-200 from-sky-300 to-sky-400 dark:border-sky-900  dark:from-sky-600 dark:to-sky-800':
        color === 'sky',
      'border-amber-200 from-amber-300 to-amber-400  dark:border-amber-900  dark:from-amber-600 dark:to-amber-800':
        color === 'amber',
      'border-rose-200 from-rose-300 to-rose-400  dark:border-rose-900  dark:from-rose-600 dark:to-rose-800':
        color === 'rose',
    }"
  >
    <h3>{{ title }}</h3>
    <main class="flex">
      <div class="w-5/6">
        <p class="text-4xl font-semibold">
          {{ count }} <span class="text-lg">{{ unit }}</span>
        </p>
        <slot />
      </div>
      <div class="mt-auto w-1/6">
        <slot name="icon" />
      </div>
    </main>
  </div>
</template>
