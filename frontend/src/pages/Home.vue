<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <app-container>
    <app-hero
      class="mt-24 md:mt-36"
      @clickGetStarted="router.push({ path: '/login' })"
      @click-learn-more="router.push({ path: '/about' })"
    ></app-hero>
  </app-container>
</template>

<style scoped></style>
