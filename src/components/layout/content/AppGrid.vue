<script setup lang="ts">
withDefaults(
  defineProps<{
    variant:
      | 'sidebar-left'
      | 'sidebar-left-and-right'
      | 'equal'
      | 'sidebar-right';
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
        'sm:col-span-4 md:col-span-4 lg:col-span-3': variant === 'sidebar-left',
        'sm:col-span-7 md:col-span-6 lg:col-span-8':
          variant === 'sidebar-right',
        'sm:col-span-4 lg:col-span-3': variant === 'sidebar-left-and-right',
        'md:col-span-6 lg:col-span-6': variant === 'equal',
      }"
    >
      <slot name="left" />
    </div>
    <div
      class="col-span-12"
      :class="{
        'sm:col-span-8 md:col-span-8 lg:col-span-9': variant === 'sidebar-left',
        'sm:col-span-5 md:col-span-6 lg:col-span-4':
          variant === 'sidebar-right',
        'sm:col-span-8 lg:col-span-6': variant === 'sidebar-left-and-right',
        'sm:col-span-12 md:col-span-6 lg:col-span-6': variant === 'equal',
      }"
    >
      <slot name="default" />
    </div>
    <div
      class="col-span-12 hidden lg:block"
      :class="{
        'lg:col-span-3': variant === 'sidebar-left-and-right',
      }"
    >
      <slot name="right" />
    </div>
  </section>
</template>

<style scoped></style>
