<script setup lang="ts">
import AppGrid from '../components/layout/content/AppGrid.vue';
import AppButton from '../components/form/AppButton.vue';
import AppCard from '../components/form/AppCard.vue';
import AppGallery from '../components/lists/gallery/AppGallery.vue';

import imgCookingManagement from '../components/img/imgCookingManagement.vue';

const items = [
  {
    title: "Grammy's superfood",
    src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    alt: 'Cooking Management',
  },
  {
    title: 'My second recipe',
    src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    alt: 'Cooking Management',
  },
  {
    title: 'My third recipe',
    src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    alt: 'Cooking Management',
  },
  {
    title: 'My other recipe',
    src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    alt: 'Cooking Management',
  },
  {
    title: 'My next recipe',
    src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    alt: 'Cooking Management',
  },
];
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
      <app-card block title="My recipes">
        <app-gallery :gallery-items="items"></app-gallery>
      </app-card>
    </template>

    <template v-slot:right>
      <app-card block title="Schedule"></app-card>
    </template>
  </app-grid>
</template>

<style scoped></style>
