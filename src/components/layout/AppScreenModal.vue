<script setup lang="ts">
const emit = defineEmits(['click-blend']);
</script>

<template>
  <section
    @click.self="emit('click-blend')"
    class="fixed top-0 left-0 z-50 h-full w-full bg-black bg-opacity-50"
  >
    <div
      class="absolute left-0 right-0 mx-auto max-h-screen max-w-xl overflow-auto md:top-24"
    >
      <slot />
    </div>
  </section>
</template>
