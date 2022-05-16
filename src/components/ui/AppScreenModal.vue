<script setup lang="ts">
const emit = defineEmits(['click-blend']);
</script>

<template>
  <section
    @click.self="emit('click-blend')"
    class="fixed top-0 left-0 z-50 h-full w-full bg-black bg-opacity-50"
  >
    <div
      class="absolute left-4 right-4 top-12 mx-auto h-fit max-h-screen max-w-xl overflow-auto md:top-24"
    >
      <slot />
    </div>
  </section>
</template>
