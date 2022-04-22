<script setup lang="ts"></script>

<template>
  <section
    class="grid grid-cols-12 gap-x-4 gap-y-8 px-4 w-full max-w-screen-xl mx-auto"
  >
    <div class="col-span-12 sm:col-span-4 lg:col-span-3">
      <slot name="left" />
    </div>
    <div class="col-span-12 sm:col-span-8 lg:col-span-9">
      <slot name="default" />
    </div>
  </section>
</template>

<style scoped></style>
