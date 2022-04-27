<script setup lang="ts">
defineProps<{ text: string }>();
</script>

<template>
  <li
    v-if="text"
    class="m-1 mx-1 rounded border border-green-600 px-2 py-1 text-sm text-green-600"
  >
    {{ text }}
  </li>
</template>
