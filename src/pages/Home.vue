<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <app-container>
    <app-hero
      class="mt-12 md:mt-36"
      @clickGetStarted="router.push({ path: '/signup' })"
      @click-learn-more="router.push({ path: '/about' })"
    ></app-hero>
  </app-container>
</template>

<style scoped></style>
