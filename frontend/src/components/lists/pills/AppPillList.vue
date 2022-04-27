<script setup lang="ts">
import AppPill from './AppPill.vue';

defineProps<{ texts: string[] }>();
</script>

<template>
  <div class="flex flex-wrap w-full">
    <app-pill v-for="text in texts" :key="text" :text="text"></app-pill>
  </div>
</template>
