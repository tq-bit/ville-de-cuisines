<script setup lang="ts">
withDefaults(
  defineProps<{
    variant: 'sidebar-left' | 'equal' | 'sidebar-right';
  }>(),
  {
    variant: 'sidebar-left',
  },
);
</script>

<template>
  <section
    class="mx-auto grid w-full max-w-screen-xl grid-cols-12 gap-2 px-4 md:gap-8 md:px-0"
    :class="{
      'gap-x-0 gap-y-0 px-0 sm:gap-x-4 sm:px-4': variant === 'equal',
    }"
  >
    <div
      class="col-span-12"
      :class="{
        'md:col-span-4 lg:col-span-3': variant === 'sidebar-left',
        'md:col-span-6 lg:col-span-8': variant === 'sidebar-right',
        'md:col-span-6 lg:col-span-6': variant === 'equal',
      }"
    >
      <slot name="left" />
    </div>
    <div
      class="col-span-12"
      :class="{
        ' md:col-span-8 lg:col-span-9': variant === 'sidebar-left',
        ' md:col-span-6 lg:col-span-4': variant === 'sidebar-right',
        'sm:col-span-12 md:col-span-6 lg:col-span-6': variant === 'equal',
      }"
    >
      <slot name="default" />
    </div>
  </section>
</template>

<style scoped></style>
