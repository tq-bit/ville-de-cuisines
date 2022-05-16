<script setup lang="ts">
import useDietStore from '@/store/dietStore';

// Diet logic
const dietStore = useDietStore();
</script>

<template>
  <app-diet-form></app-diet-form>
  <app-diet-week :items="dietStore.activeUserDiets"></app-diet-week>
</template>
