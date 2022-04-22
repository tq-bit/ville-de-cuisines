<script setup lang="ts">
import AppGrid from '../components/layout/content/AppGrid.vue';
import AppButton from '../../components/form/AppButton.vue';
import AppImage from '../../components/ui/AppImage.vue';
import AppCard from '../../components/form/AppCard.vue';
</script>

<template>
  <app-grid class="variant" variant="sidebar-left-and-right">
    <template v-slot:left> left </template>

    <template v-slot:default> middle </template>

    <template v-slot:right> right </template>
  </app-grid>
</template>

<style scoped></style>
