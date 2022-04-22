<script setup lang="ts">
withDefaults(
  defineProps<{
    variant: 'sidebar-left' | 'sidebar-left-and-right';
  }>(),
  {
    variant: 'sidebar-left',
  },
);
</script>

<template>
  <section
    class="grid grid-cols-12 gap-x-4 gap-y-8 px-4 w-full max-w-screen-xl mx-auto"
  >
    <div
      class="col-span-12"
      :class="{
        'sm:col-span-4 lg:col-span-3': variant === 'sidebar-left',
        'lg:col-span-3': variant === 'sidebar-left-and-right',
      }"
    >
      <slot name="left" />
    </div>
    <div
      class="col-span-12"
      :class="{
        'sm:col-span-8 lg:col-span-9': variant === 'sidebar-left',
        'lg:col-span-6': variant === 'sidebar-left-and-right',
      }"
    >
      <slot name="default" />
    </div>
    <div
      class="absolute top-0 left-0 w-full h-full"
      :class="{
        'lg:col-span-3': variant === 'sidebar-left-and-right',
      }"
    >
      <slot name="right" />
    </div>
  </section>
</template>

<style scoped></style>
