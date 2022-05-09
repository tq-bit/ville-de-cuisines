<script setup lang="ts">
import { onMounted } from 'vue';
import { AppGalleryItemType } from '../../@types';
import useRecipeStore from '../../store/recipeStore';
import useActiveUserStore from '../../store/activeUserStore';

import { useRouter } from 'vue-router';

const router = useRouter();
const recipeStore = useRecipeStore();
const activeUserStore = useActiveUserStore();

const onGalleryItemClick = (payload: AppGalleryItemType) => {
  router.push({
    path: `/recipe/${payload.$id}`,
  });
};

const openRecipeModal = () => {
  router.push({ path: '/my-kitchen/recipe' });
};

const openIngredientModal = () => {
  router.push({ path: '/my-kitchen/ingredient' });
};

const openRecipeCategoryPage = () => {
  router.push({ path: '/my-kitchen/recipe-category' });
};

onMounted(
  async () =>
    await recipeStore.syncActiveUserRecipes(activeUserStore.account.$id),
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
        <app-button @click="openRecipeModal" class="mb-4" block>
          Add new recipe</app-button
        >
        <app-button @click="openIngredientModal" class="mb-4" block>
          Add ingredients</app-button
        >
        <app-button @click="openRecipeCategoryPage" class="mb-4" block>
          Add recipe category</app-button
        >
      </app-card>
    </template>

    <template v-slot:default>
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
      <h1 class="mb-4 text-3xl">My recipes</h1>
      <app-gallery
        :columns="3"
        :items="recipeStore.activeUserPublicRecipesForGallery"
        @click="onGalleryItemClick"
        @click-create="router.push({ path: '/my-kitchen/recipe' })"
      ></app-gallery>
    </template>
  </app-grid>
</template>

<style scoped></style>
