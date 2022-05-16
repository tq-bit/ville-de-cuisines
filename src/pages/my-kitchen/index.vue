<script setup lang="ts">
import { onMounted } from 'vue';
import { AppGalleryItemType } from '../../@types';
import useRecipeStore from '../../store/recipeStore';
import useActiveUserStore from '../../store/activeUserStore';
import useDietStore from '@/store/dietStore';

import { useRouter } from 'vue-router';

const router = useRouter();
const recipeStore = useRecipeStore();
const activeUserStore = useActiveUserStore();
const dietStore = useDietStore();

const onGalleryItemClick = (payload: AppGalleryItemType) => {
  router.push({
    path: `/recipe/${payload.$id}`,
  });
};

const navToRecipeCreation = () => {
  router.push({ path: '/my-kitchen/recipe' });
};

const navToIngredientCreation = () => {
  router.push({ path: '/my-kitchen/ingredient' });
};

const navToRecipeCategoryCreation = () => {
  router.push({ path: '/my-kitchen/recipe-category' });
};

const navToDietPlanner = () => {
  router.push({ path: '/my-kitchen/diet-planner' });
};

onMounted(
  async () =>
    await Promise.all([
      recipeStore.syncActiveUserRecipes(activeUserStore.account.$id),
      dietStore.syncActiveUserDiets(),
    ]),
);
</script>

<template>
  <app-grid class="mt-4" variant="sidebar-left">
    <template v-slot:left>
      <app-card block>
        <svg-cooking-management
          class="mx-auto mb-4 w-10/12"
        ></svg-cooking-management>
        <hr class="mb-4" />
        <app-button @click="navToRecipeCreation" class="mb-4" block>
          Add new recipe</app-button
        >
        <app-button @click="navToRecipeCategoryCreation" class="mb-4" block>
          Add recipe category</app-button
        >
        <app-button @click="navToIngredientCreation" class="mb-4" block>
          Manage ingredients</app-button
        >
        <app-button @click="navToDietPlanner" class="mb-4" block>
          To diet planner</app-button
        >
      </app-card>
    </template>

    <template v-slot:default>
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>

      <h2>My week</h2>
      <app-diet-week
        class="mb-4"
        :items="dietStore.activeUserDiets"
      ></app-diet-week>

      <h2>My recipes</h2>
      <app-gallery
        variant="recipe"
        :columns="3"
        :items="recipeStore.activeUserPublicRecipesForGallery"
        @click="onGalleryItemClick"
        @click-create="router.push({ path: '/my-kitchen/recipe' })"
      ></app-gallery>
    </template>
  </app-grid>
</template>

<style scoped></style>
