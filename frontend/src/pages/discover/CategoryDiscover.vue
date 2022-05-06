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
  <app-container tag="main" class="mt-4">
    <app-gallery
      @click="onClickGalleryCategoryItem"
      :columns="3"
      :items="recipeStore.recipeCategoriesForGallery"
    ></app-gallery>
  </app-container>
</template>
