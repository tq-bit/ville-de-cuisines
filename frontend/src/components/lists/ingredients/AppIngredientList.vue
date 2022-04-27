<script setup lang="ts">
import { Ingredient } from '../../../@types/commons';
import AppIngredientItem from './AppIngredientItem.vue';

defineProps<{ editable: boolean; ingredients: Ingredient[] }>();
</script>

<template>
  <ul
    class="mb-2 flex w-full flex-wrap rounded border py-2 dark:border-gray-600 dark:bg-gray-800"
  >
    <app-ingredient-item
      v-for="ingredient in ingredients"
      :key="ingredient.$id"
      :ingredient="ingredient"
      :editable="editable"
    ></app-ingredient-item>
  </ul>
</template>
