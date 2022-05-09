<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import useIngredientsStore from '../../../store/ingredientsStore';
import useRecipeStore from '../../../store/recipeStore';
import usePublicUserStore from '../../../store/publicUserStore';

import useLazyIngredientSearch from '../../../use/search/useLazyIngredientSearch';
import useLazyCategorySearch from '../../../use/search/useLazyCategorySearch';
import useLazyPublicUserSearch from '../../../use/search/useLazyPublicUserSearch';

import { AppGalleryItemType } from '../../../@types';

const ingredientsStore = useIngredientsStore();
const recipeStore = useRecipeStore();
const publicUserStore = usePublicUserStore();
const router = useRouter();

const query = ref<string>('');

const { handleSearch: handleIngredientsSearch, loading: loadingIngredients } =
  useLazyIngredientSearch(query);
const { handleSearch: handleRecipesSearch, loading: loadingRecipes } =
  useLazyCategorySearch(query);
const { handleSearch: handlePublicUserSearch, loading: loadingPublicUsers } =
  useLazyPublicUserSearch(query);

const results = computed<AppGalleryItemType[]>(() => {
  return [
    ...ingredientsStore.ingredientSearchResultsForGallery,
    ...recipeStore.recipeCategorySearchResultsForGallery,
    ...publicUserStore.publicUserSearchResultsFeedItems,
  ];
});
const loading = loadingIngredients || loadingPublicUsers || loadingRecipes;

const onClickSearchItem = (payload: AppGalleryItemType) => {
  const getSearchPath = ($id: string) => {
    const map = [
      {
        type: 'user',
        path: `/user/${$id}`,
      },
      {
        type: 'recipe',
        path: `/recipe/${$id}`,
      },
      {
        type: 'ingredient',
        path: `/recipe/ingredient/${$id}`,
      },
      {
        type: 'category',
        path: `/recipe/category/${$id}`,
      },
    ];

    return map.find(({ type }) => type === payload.type)?.path || '/error';
  };

  const path: string = getSearchPath(payload.$id);
  router.push({ path });
};

watch(query, (value) => {
  handleIngredientsSearch(value);
  handleRecipesSearch(value);
  handlePublicUserSearch(value);
});
</script>

<template>
  <app-search
    @click-item="onClickSearchItem"
    :loading="loading"
    size="small"
    v-model="query"
    :options="results"
    label="Browse Ville de Cuisines"
    :hide-label="true"
  ></app-search>
</template>

<style scoped></style>
