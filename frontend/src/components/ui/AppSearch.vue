<script setup lang="ts">
import iSearch from '../icons/iSearch.vue';
import AppInput from '../form/AppInput.vue';
</script>

<template>
  <app-input
    :hide-label="true"
    class="mx-2 mb-0 border-none"
    label="🍔 Discover delicious recipes"
  >
    <template v-slot:icon>
      <i-search></i-search>
    </template>
  </app-input>
</template>

<style scoped></style>
