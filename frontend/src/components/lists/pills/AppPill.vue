<script setup lang="ts">
defineProps<{ text: string }>();
</script>

<template>
  <span
    v-if="text"
    class="text-sm px-2 py-1 mx-1 m-1 rounded text-green-600 border border-green-600"
  >
    {{ text }}
  </span>
</template>
