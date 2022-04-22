<script setup lang="ts">
import AppGrid from '../components/layout/content/AppGrid.vue';
import AppButton from '../components/form/AppButton.vue';
import AppImage from '../components/ui/AppImage.vue';
import AppCard from '../components/form/AppCard.vue';

import imgCookingManagement from '../components/img/imgCookingManagement.vue';
</script>

<template>
  <app-grid class="mt-4" variant="sidebar-left-and-right">
    <template v-slot:left>
      <app-card block title="My kitchen">
        <img-cooking-management class="mb-4"></img-cooking-management>
        <hr class="mb-4" />
        <app-button class="mb-4" block> Add new recipe</app-button>
        <app-button class="mb-4" block> Add ingredients</app-button>
      </app-card>
    </template>

    <template v-slot:default>
      <app-card block title="My recipes"></app-card>
    </template>

    <template v-slot:right>
      <app-card block title="Schedule"></app-card>
    </template>
  </app-grid>
</template>

<style scoped></style>
