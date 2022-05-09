<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AppGalleryItemType, Ingredient } from '../../@types';
import useRecipeStore from '../../store/recipeStore';
import useIngredientsStore from '../../store/ingredientsStore';
import { useRouter } from 'vue-router';

const recipeStore = useRecipeStore();
const ingredientsStore = useIngredientsStore();

const router = useRouter();
const onClickGalleryItem = (recipe: AppGalleryItemType) => {
  router.push({ path: `/recipe/${recipe.$id}` });
};

const suggestionCount = ref<number>(6);
const localIngredient = ref<Ingredient>();
const localRecipesByIngredient = ref<AppGalleryItemType[]>([]);

const setLocalIngredient = async (categoryId: string) => {
  const [response, error] = await ingredientsStore.fetchIngredientById(
    categoryId,
  );
  if (error) {
    console.error(error);
  }
  localIngredient.value = response as Ingredient;
};
const setLocalRecipeSuggestions = async (count: number) => {
  if (router.currentRoute.value.params.ingredientId) {
    await recipeStore.syncRecipesByIngredient(
      router.currentRoute.value.params.ingredientId as string,
      count,
    );
    localRecipesByIngredient.value =
      recipeStore.publicRecipesByIngredientForGallery(
        router.currentRoute.value.params.ingredientId as string,
      );
  }
};

onMounted(async () => {
  await setLocalIngredient(
    router.currentRoute.value.params.ingredientId as string,
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
            :src="(localIngredient?.primary_image_href as string)"
          ></app-image>
          <h1 class="mb-4">
            <span class="font-semibold">Ingredient: </span
            >{{ localIngredient?.name }}
          </h1>
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
        <h1 class="mb-4 text-3xl md:text-4xl">
          Recipes in which {{ localIngredient?.name }} is used:
        </h1>
        <app-gallery
          :items="localRecipesByIngredient"
          :cols="2"
          @click="onClickGalleryItem"
        ></app-gallery>
      </template>
    </app-grid>
  </div>
</template>

<style scoped></style>
