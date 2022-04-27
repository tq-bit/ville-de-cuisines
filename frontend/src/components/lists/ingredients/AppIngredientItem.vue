<script setup lang="ts">
import { Ingredient } from '../../../@types/commons';
import { computed } from 'vue';
import AppInput from '../../form/AppInput.vue';

const props = defineProps<{ editable: boolean; ingredient: Ingredient }>();
const localIngredient = computed(() => props.ingredient);
</script>

<template>
  <li class="mb-2 flex w-full flex-row items-center">
    <span class="font-semibold text-green-600 underline">
      {{ ingredient.name }}
    </span>

    <div class="ml-auto flex w-20">
      <app-input
        v-if="editable"
        v-model="localIngredient.quantity"
        class="text-right"
        variant="small"
      >
        <template v-slot:postfix>
          <span>
            {{ ingredient.quantity_unit }}
          </span>
        </template>
      </app-input>

      <span class="text-right" v-else>
        {{ ingredient.quantity }}
        {{ ingredient.quantity_unit }}
      </span>
    </div>
  </li>
</template>
