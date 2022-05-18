<script setup lang="ts">
import { onMounted } from 'vue';
import { AppGalleryItemType } from '@/@types';
import useRecipeStore from '@/store/recipeStore';
import useActiveUserStore from '@/store/activeUserStore';

import { useRouter } from 'vue-router';

const router = useRouter();
const recipeStore = useRecipeStore();
const activeUserStore = useActiveUserStore();

const onGalleryItemClick = (payload: AppGalleryItemType) => {
  router.push({
    path: `/recipe/${payload.$id}`,
  });
};

onMounted(
  async () =>
    await Promise.all([
      recipeStore.syncActiveUserRecipes(activeUserStore.account.$id),
    ]),
);
</script>

<template>
  <app-container class="mt-4">
    <kitchen-tiles></kitchen-tiles>

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
