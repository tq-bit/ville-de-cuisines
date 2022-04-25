<script setup lang="ts">
const emit = defineEmits(['click-blend']);
</script>

<template>
  <section
    @click.self="emit('click-blend')"
    class="fixed top-0 left-0 h-full w-full bg-black bg-opacity-50 z-50"
  >
    <div
      class="absolute md:top-24 max-h-screen overflow-auto left-0 right-0 max-w-xl mx-auto"
    >
      <slot />
    </div>
  </section>
</template>
