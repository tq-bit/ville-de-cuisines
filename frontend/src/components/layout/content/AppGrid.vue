<script setup lang="ts">
withDefaults(
  defineProps<{
    variant: 'sidebar-left' | 'sidebar-left-and-right' | 'gallery';
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
      class="col-span-12 sm:col-span-4 lg:col-span-3"
      :class="{
        'sm:col-span-4 lg:col-span-3': variant === 'sidebar-left-and-right',
        hidden: variant === 'gallery',
      }"
    >
      <slot name="left" />
    </div>
    <div
      class="col-span-12 sm:col-span-8 lg:col-span-9"
      :class="{
        'sm:col-span-8 lg:col-span-6': variant === 'sidebar-left-and-right',
        'col-auto': variant === 'gallery',
      }"
    >
      <slot name="default" />
    </div>
    <div
      class="hidden lg:block col-span-12"
      :class="{
        'lg:col-span-3': variant === 'sidebar-left-and-right',
        'lg:hidden': variant === 'gallery',
      }"
    >
      <slot name="right" />
    </div>
  </section>
</template>

<style scoped></style>
