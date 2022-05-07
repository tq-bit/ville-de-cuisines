<script setup lang="ts">
import { Ingredient } from '../../../@types/';
import { computed } from 'vue';

const props = defineProps<{ editable: boolean; ingredient: Ingredient }>();
const emit = defineEmits(['click-remove']);
const localIngredient = computed(() => props.ingredient);
</script>

<template>
  <li class="flex w-full flex-row items-center px-2 py-2">
    <router-link
      class="font-semibold"
      :to="`/recipe/ingredient/${ingredient.$id}`"
    >
      {{ ingredient.name }}
    </router-link>

    <div class="ml-auto">
      <div class="flex w-36 items-center justify-between" v-if="editable">
        <app-input
          v-if="editable"
          v-model="localIngredient.quantity"
          class="text-right"
          variant="small"
        >
        </app-input>
        <span class="inline w-10">
          {{ ingredient.quantity_unit }}
        </span>

        <button type="button" @click="emit('click-remove')" class="ml-2 p-1">
          <i-close></i-close>
        </button>
      </div>
      <span class="text-right" v-else>
        {{ ingredient.quantity }}
        {{ ingredient.quantity_unit }}
      </span>
    </div>
  </li>
</template>
