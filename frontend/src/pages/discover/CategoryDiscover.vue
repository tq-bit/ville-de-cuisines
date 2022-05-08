<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppContainer from '../../components/layout/content/AppContainer.vue';
import AppGallery from '../../components/lists/gallery/AppGallery.vue';

import useRecipeStore from '../../store/recipeStore';
import { useRouter } from 'vue-router';
import { AppGalleryItemType } from '../../@types/commons';

const recipeStore = useRecipeStore();
const router = useRouter();

const onClickGalleryCategoryItem = (payload: AppGalleryItemType) => {
  router.push({ path: `/recipe/category/${payload.$id}` });
};

onMounted(async () => {
  await recipeStore.syncRecipeCategories();
});
</script>

<template>
  <app-container tag="main" class="my-4">
    <h1 class="mb-4 text-3xl">
      Browse through
      {{ recipeStore.recipeCategoriesForGallery.length }} categories
    </h1>
    <app-gallery
      @click="onClickGalleryCategoryItem"
      :columns="3"
      :items="recipeStore.recipeCategoriesForGallery"
    ></app-gallery>

    <section class="text-center">
      <h2 class="text-md mt-8 mb-4 font-semibold">
        Didn't find the category you're looking for?
      </h2>

      <app-button @click="router.push('/my-kitchen/recipe-category')"
        >Create your own</app-button
      >
    </section>
  </app-container>
</template>
