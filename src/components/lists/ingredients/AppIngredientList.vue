<script setup lang="ts">
import { computed } from 'vue';
import { Ingredient } from '../../../@types';
import AppIngredientItem from './AppIngredientItem.vue';

const props = defineProps<{
  editable: boolean;
  ingredients: Ingredient[];
  showCalories?: boolean;
}>();
const emit = defineEmits<{
  (event: 'removeIngredient', ingredient: Ingredient): void;
}>();

const hasIngredients = computed(() => props.ingredients.length > 0);
const summedCalories = computed(() => {
  return props.ingredients.reduce((acc, ingredient) => {
    return acc + ingredient.calories;
  }, 0);
});
</script>

<template>
  <section
    class="rounded border-l-4 bg-gray-50 py-2 pl-2 dark:border-gray-700 dark:bg-gray-800"
    :class="{
      'border-green-600 dark:border-green-600': hasIngredients,
    }"
  >
    <p
      class="mx-auto py-4 text-center font-semibold text-green-600"
      v-if="!hasIngredients"
    >
      No ingredients added yet
    </p>
    <ul class="w-full" v-else>
      <app-ingredient-item
        v-for="ingredient in ingredients"
        :key="ingredient.$id"
        :ingredient="ingredient"
        :editable="editable"
        @click-remove="emit('removeIngredient', ingredient)"
      ></app-ingredient-item>
    </ul>

    <div
      class="mt-2 flex justify-between border-t border-green-600 px-2 py-4 dark:border-green-600"
      v-if="showCalories"
    >
      <p class="mb-0">Total energy</p>
      <p class="mb-0 font-semibold underline">{{ summedCalories }} kcal</p>
    </div>
  </section>
</template>
