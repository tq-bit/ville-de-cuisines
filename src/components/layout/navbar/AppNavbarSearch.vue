<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { AppGalleryItemType } from '@/@types';

import { getSearchPathFromGalleryItem } from '@/router/globalSearchPathMap';
import useIngredientsStore from '@/store/ingredientsStore';
import useRecipeStore from '@/store/recipeStore';
import usePublicUserStore from '@/store/publicUserStore';

import useLazyRecipeSearch from '@/use/search/useLazyRecipeSearch';
import useLazyIngredientSearch from '@/use/search/useLazyIngredientSearch';
import useLazyCategorySearch from '@/use/search/useLazyCategorySearch';
import useLazyPublicUserSearch from '@/use/search/useLazyPublicUserSearch';

const ingredientsStore = useIngredientsStore();
const recipeStore = useRecipeStore();
const publicUserStore = usePublicUserStore();
const router = useRouter();

const query = ref<string>('');

const { handleSearch: handleRecipeSearch, loading: loadingRecipes } =
  useLazyRecipeSearch(query);
const { handleSearch: handleIngredientsSearch, loading: loadingIngredients } =
  useLazyIngredientSearch(query);
const {
  handleSearch: handleRecipeCategorySearch,
  loading: loadingRecipeCategories,
} = useLazyCategorySearch(query);
const { handleSearch: handlePublicUserSearch, loading: loadingPublicUsers } =
  useLazyPublicUserSearch(query);

const results = computed<AppGalleryItemType[]>(() => {
  return [
    ...recipeStore.publicRecipeSearchResultsForGallery,
    ...ingredientsStore.ingredientSearchResultsForGallery,
    ...recipeStore.recipeCategorySearchResultsForGallery,
    ...publicUserStore.publicUserSearchResultsFeedItems,
  ];
});

const loading =
  loadingRecipes ||
  loadingIngredients ||
  loadingPublicUsers ||
  loadingRecipeCategories;

const onClickSearchItem = (clickedItem: AppGalleryItemType) => {
  const path: string = getSearchPathFromGalleryItem(clickedItem);
  router.push({ path });
};

watch(query, (value) => {
  handleRecipeSearch(value);
  handleIngredientsSearch(value);
  handleRecipeCategorySearch(value);
  handlePublicUserSearch(value);
});
</script>

<template>
  <app-search
    size="small"
    v-model="query"
    label="Find recipes, ingredients or chefs"
    :loading="loading"
    :options="results"
    :hide-label="true"
    :hide-text="true"
    @click-item="onClickSearchItem"
  ></app-search>
</template>

<style scoped></style>
