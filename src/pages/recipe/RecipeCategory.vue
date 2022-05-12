<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AppGalleryItemType, RecipeCategory } from '../../@types';
import useRecipeStore from '../../store/recipeStore';
import { useRouter } from 'vue-router';
import categoryApi from '../../api/recipeCategories.api';

const recipeStore = useRecipeStore();

const router = useRouter();
const onClickGalleryItem = (recipe: AppGalleryItemType) => {
  router.push({ path: `/recipe/${recipe.$id}` });
};

const suggestionCount = ref<number>(6);
const localRecipeCategory = ref<RecipeCategory>();
const localRecipesByCategory = ref<AppGalleryItemType[]>([]);

const setLocalRecipeCategory = async (categoryId: string) => {
  const [response, error] = await categoryApi.fetchRecipeCategoryById(
    categoryId,
  );
  if (error) {
    console.error(error);
  }
  localRecipeCategory.value = response as RecipeCategory;
};
const setLocalRecipeSuggestions = async (count: number) => {
  if (router.currentRoute.value.params.recipeCategoryId) {
    await recipeStore.syncRecipesByCategory(
      router.currentRoute.value.params.recipeCategoryId as string,
      count,
    );
    localRecipesByCategory.value =
      recipeStore.publicRecipesByCategoryForGallery(
        router.currentRoute.value.params.recipeCategoryId as string,
      );
  }
};

onMounted(async () => {
  await setLocalRecipeCategory(
    router.currentRoute.value.params.recipeCategoryId as string,
  );
  await setLocalRecipeSuggestions(suggestionCount.value);
});
</script>

<template>
  <div class="mt-4">
    <app-grid variant="sidebar-left">
      <template v-slot:left>
        <app-card block>
          <app-image
            class="mb-4"
            :rounded="true"
            size="xsmall"
            :src="(localRecipeCategory?.primary_image_href as string)"
          ></app-image>
          <h4 class="mb-4">
            <span class="font-semibold">Category: </span
            >{{ localRecipeCategory?.name }}
          </h4>
          <form @submit.prevent="setLocalRecipeSuggestions(suggestionCount)">
            <app-input
              v-model="suggestionCount"
              label="Recipe suggestion count"
            ></app-input>
            <app-button block type="submit">Refresh suggestions</app-button>
          </form>
        </app-card>
      </template>

      <template v-slot:default>
        <app-gallery
          :items="localRecipesByCategory"
          :cols="2"
          @click="onClickGalleryItem"
        ></app-gallery>
      </template>
    </app-grid>
  </div>
</template>

<style scoped></style>
