<script setup lang="ts">
import AppPill from './AppPill.vue';

defineProps<{ texts: string[] }>();
</script>

<template>
  <ul class="flex flex-wrap w-full">
    <app-pill v-for="text in texts" :key="text" :text="text"></app-pill>
  </ul>
</template>
