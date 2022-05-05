<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <app-container>
    <app-hero
      class="mt-12"
      @clickGetStarted="router.push({ path: '/login' })"
    ></app-hero>
  </app-container>
</template>

<style scoped></style>
