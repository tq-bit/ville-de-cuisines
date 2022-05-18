<script setup lang="ts">
import { onMounted } from 'vue';
import { AppGalleryItemType } from '@/@types';
import useIngredientsStore from '@/store/ingredientsStore';
import useRecipeStore from '@/store/recipeStore';
import useActiveUserStore from '@/store/activeUserStore';
import useDietStore from '@/store/dietStore';

import { useRouter } from 'vue-router';

const router = useRouter();
const recipeStore = useRecipeStore();
const activeUserStore = useActiveUserStore();
const ingredientsStore = useIngredientsStore();
const dietStore = useDietStore();

const onGalleryItemClick = (payload: AppGalleryItemType) => {
  router.push({
    path: `/recipe/${payload.$id}`,
  });
};

onMounted(
  async () =>
    await Promise.all([
      recipeStore.syncActiveUserRecipes(activeUserStore.account.$id),
      ingredientsStore.syncIngredients(),
      dietStore.syncActiveUserDietsThisWeek(),
    ]),
);
</script>

<template>
  <app-container class="mt-4">
    <section class="mb-4 grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-4">
        <app-tile
          title="Recipes collected"
          :count="recipeStore.activeUserRecipes.length"
          unit="masterpieces"
          color="sky"
          size="medium"
        >
          <template v-slot:icon>
            <i-chart></i-chart>
          </template>
        </app-tile>
      </div>
      <div class="col-span-12 md:col-span-4">
        <app-tile
          title="Ingredients maintained"
          :count="ingredientsStore.ingredients.length"
          unit="public ingredients"
          color="amber"
          size="medium"
        >
          <template v-slot:icon>
            <i-shopping-bag></i-shopping-bag>
          </template>
        </app-tile>
      </div>
      <div class="col-span-12 md:col-span-4">
        <app-tile
          title="This week's diet"
          :count="dietStore.activeUserDietsThisWeekPlanned || 0"
          unit="of 21 meals planned"
          :color="
            dietStore.activeUserDietsThisWeekPlanned >= 14 ? 'emerald' : 'rose'
          "
          size="medium"
        >
          <template v-slot:icon>
            <i-clock></i-clock>
          </template>
        </app-tile>
      </div>
    </section>

    <h2>Your recipes</h2>
    <app-gallery
      variant="recipe"
      :columns="3"
      :items="recipeStore.activeUserPublicRecipesForGallery"
      @click="onGalleryItemClick"
      @click-create="router.push({ path: '/my-cuisine/recipe' })"
    ></app-gallery>
  </app-container>
</template>
