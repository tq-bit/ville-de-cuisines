<script setup lang="ts">
import { Ingredient } from '../../../@types/commons';
import AppIngredientItem from './AppIngredientItem.vue';

defineProps<{ editable: boolean; ingredients: Ingredient[] }>();
</script>

<template>
  <ul class="flex flex-wrap w-full">
    <app-ingredient-item
      v-for="ingredient in ingredients"
      :key="ingredient.$id"
      :ingredient="ingredient"
      :editable="editable"
    ></app-ingredient-item>
  </ul>
</template>
