<script setup lang="ts">
withDefaults(
  defineProps<{
    variant: 'sidebar-left' | 'sidebar-left-and-right' | 'equal';
  }>(),
  {
    variant: 'sidebar-left',
  },
);
</script>

<template>
  <section
    class="grid grid-cols-12 gap-x-4 gap-y-8 px-4 md:px-0 w-full max-w-screen-xl mx-auto"
    :class="{
      'gap-x-0 gap-y-0 px-0 sm:gap-x-4 sm:px-4': variant === 'equal',
    }"
  >
    <div
      class="col-span-12"
      :class="{
        'sm:col-span-4 md:col-span-4 lg:col-span-3': variant === 'sidebar-left',
        'sm:col-span-4 lg:col-span-3': variant === 'sidebar-left-and-right',
        'md:col-span-6 lg:col-span-6': variant === 'equal',
      }"
    >
      <slot name="left" />
    </div>
    <div
      class="col-span-12"
      :class="{
        'sm:col-span-8 lg:col-span-9': variant === 'sidebar-left',
        'sm:col-span-8 lg:col-span-6': variant === 'sidebar-left-and-right',
        'sm:col-span-12 md:col-span-6 lg:col-span-6': variant === 'equal',
      }"
    >
      <slot name="default" />
    </div>
    <div
      class="hidden lg:block col-span-12"
      :class="{
        'lg:col-span-3': variant === 'sidebar-left-and-right',
      }"
    >
      <slot name="right" />
    </div>
  </section>
</template>

<style scoped></style>
