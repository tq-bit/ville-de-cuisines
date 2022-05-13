<script setup lang="ts">
import { ref } from 'vue';
import { DietEntry } from '@/@types';
const mockPayload = ref<DietEntry[]>([
  {
    $id: '1',
    $collection: 'dietEntries',
    $read: ['true'],
    $write: ['true'],
    date_unix: 1652392800000,
    diet_time: 'breakfast',
    recipe_id: '1',
    user_id: '1',
    recipe: {
      $id: '1',
      $collection: 'recipes',
      $read: ['true'],
      $write: ['true'],
      name: 'Eggs Benedic',
      description: 'A delicious breakfast',
      original_recipe_id: '2',
      username: 'Tobi',
      portions_count: 100,
      user_id: '2',
      is_public: true,

      ingredients: [
        {
          $id: '1',
          $collection: 'ingredients',
          $read: ['true'],
          $write: ['true'],
          name: 'Eggs',
          quantity: 2,
          quantity_unit: 'piece',
          calories: 12,
          description: 'A delicious breakfast',
        },
      ],
    },
  },
  {
    $id: '1',
    $collection: 'dietEntries',
    $read: ['true'],
    $write: ['true'],
    date_unix: 1652392800000,
    diet_time: 'lunch',
    recipe_id: '1',
    user_id: '1',
    recipe: {
      $id: '1',
      $collection: 'recipes',
      $read: ['true'],
      $write: ['true'],
      name: 'Eggs Benedict',
      description: 'A delicious breakfast',
      original_recipe_id: '2',
      username: 'Tobi',
      portions_count: 100,
      user_id: '2',
      is_public: true,

      ingredients: [
        {
          $id: '1',
          $collection: 'ingredients',
          $read: ['true'],
          $write: ['true'],
          name: 'Eggs',
          quantity: 2,
          quantity_unit: 'piece',
          calories: 12,
          description: 'A delicious breakfast',
        },
      ],
    },
  },
]);

function addItem() {
  mockPayload.value.push({
    $id: '1',
    $collection: 'dietEntries',
    $read: ['true'],
    $write: ['true'],
    date_unix: 1652392800000,
    diet_time: 'dinner',
    recipe_id: '1',
    user_id: '1',
    recipe: {
      $id: '1',
      $collection: 'recipes',
      $read: ['true'],
      $write: ['true'],
      name: 'Eggs Benedict',
      description: 'A delicious breakfast',
      original_recipe_id: '2',
      username: 'Tobi',
      portions_count: 100,
      user_id: '2',
      is_public: true,

      ingredients: [
        {
          $id: '1',
          $collection: 'ingredients',
          $read: ['true'],
          $write: ['true'],
          name: 'Eggs',
          quantity: 2,
          quantity_unit: 'piece',
          calories: 12,
          description: 'A delicious breakfast',
        },
      ],
    },
  });
}
</script>

<template>
  <app-container>
    <button @click="addItem">Add Item</button>
    <app-diet-calender :items="mockPayload"></app-diet-calender>
  </app-container>
</template>

<style scoped></style>
