<script setup lang="ts">
import { ref, computed, onMounted, onUpdated } from 'vue';
import { useRouter } from 'vue-router';
import { AppGalleryItemType, Ingredient, Recipe } from '../../@types';
import recipesApi from '../../api/recipes.api';

import useRecipeStore from '../../store/recipeStore';
import useActiveUserStore from '../../store/activeUserStore';

// Router logic
const router = useRouter();

// User logic
const activeUserStore = useActiveUserStore();
const activeUserIsSubmitter = computed(() => {
  return activeUserStore.user.$id === localRecipe.value?.user_id;
});
const submittedBy = computed(() => {
  return activeUserIsSubmitter.value ? 'you' : localRecipe.value?.username;
});

// Recipe Logic
const recipeStore = useRecipeStore();
const localRecipe = ref<Recipe>();
const suggestionCount = ref<number>(3);
const localRecipeSuggestions = ref<AppGalleryItemType[]>([]);
const localRecipeByUser = ref<AppGalleryItemType[]>([]);
const localRecipeIsOriginal = computed(() => {
  return localRecipe.value?.original_recipe_id === localRecipe.value?.$id;
});
const setLocalRecipe = async (recipeId: string) => {
  const [response, error] = await recipesApi.fetchPublicRecipeById(recipeId);
  if (error) {
    console.error(error);
  }
  localRecipe.value = response as Recipe;
  userPortionsCount.value = localRecipe.value?.portions_count;
};
const setLocalRecipeSuggestions = async (count: number) => {
  const categoryId = localRecipe.value?.category_id;
  if (categoryId) {
    await recipeStore.syncRecipesByCategory(categoryId as string, count);
    const suggestions = recipeStore.publicRecipesByCategoryForGallery(
      categoryId as string,
    );
    localRecipeSuggestions.value = suggestions.filter((suggestion) => {
      return suggestion.$id !== localRecipe.value?.$id;
    });
  }
};
const setLocalRecipeByUser = async () => {
  const userId = localRecipe.value?.user_id;
  if (userId) {
    await recipeStore.syncRecipesByUser(
      userId as string,
      suggestionCount.value,
    );
    const recipes = recipeStore.publicRecipesByUserForGallery(userId as string);
    localRecipeByUser.value = recipes.filter((recipe) => {
      return recipe.$id !== localRecipe.value?.$id;
    });
  }
};
const onClickGalleryItem = async (recipe: AppGalleryItemType) => {
  router.push({
    path: `/recipe/${recipe.$id}`,
  });
};

onMounted(async () => {
  await setLocalRecipe(router.currentRoute.value.params.recipeId as string);
  await setLocalRecipeSuggestions(suggestionCount.value);
  await setLocalRecipeByUser();
});

onUpdated(async () => {
  await setLocalRecipe(router.currentRoute.value.params.recipeId as string);
  await setLocalRecipeSuggestions(suggestionCount.value);
  await setLocalRecipeByUser();
});

// Ingredients & nutrients logic
const userPortionsCount = ref<number>();
const computedIngredients = computed(() => {
  const localIngredients = localRecipe.value?.ingredients;
  if (localIngredients && localIngredients.length > 0) {
    return localIngredients.map((ingredient) => {
      return computeIngredientCountForPortion(ingredient);
    });
  } else {
    return [];
  }
});
const computeIngredientCountForPortion = (ingredient: Ingredient) => {
  if (localRecipe.value && userPortionsCount.value) {
    return {
      ...ingredient,
      calories:
        (ingredient.calories / localRecipe.value?.portions_count) *
        userPortionsCount.value,
      quantity:
        (ingredient.quantity / localRecipe.value?.portions_count) *
        userPortionsCount.value,
    };
  } else {
    return ingredient;
  }
};
</script>

<template>
  <app-container>
    <app-grid class="mt-4" variant="sidebar-right">
      <template v-slot:left>
        <section class="mb-4">
          <h1>
            {{ localRecipe?.name }}
            <span class="text-xl" v-if="!localRecipeIsOriginal"
              >(variation)</span
            >
          </h1>
          <app-image
            class="mb-2"
            cover="xlarge"
            :src="(localRecipe?.primary_image_href as string)"
          ></app-image>
          <div class="mb-4 flex justify-between">
            <div>
              <span>
                Category:
                <router-link
                  class="font-semibold"
                  :to="`/recipe/category/${localRecipe?.category_id}`"
                  >{{ localRecipe?.category_name }}</router-link
                ></span
              >
              <br />

              <span>
                Submitted by
                <router-link
                  class="font-semibold"
                  :to="`/user/${localRecipe?.user_id}`"
                  >{{ submittedBy }}</router-link
                >
                <br />
              </span>

              <span class="font-semibold" v-if="!localRecipeIsOriginal">
                <router-link :to="`/recipe/${localRecipe?.original_recipe_id}`">
                  To original recipe
                </router-link>
                <br />
              </span>
            </div>

            <div class="max-w-xs">
              <app-button
                v-if="activeUserIsSubmitter"
                @click="
                  router.push({ path: `/my-kitchen/recipe/${router.currentRoute.value.params.recipeId as string}/edit` })
                "
                >Edit recipe</app-button
              >

              <app-button
                v-else
                @click="
                  router.push({ path: `/my-kitchen/recipe/${router.currentRoute.value.params.recipeId as string}/refine` })
                "
              >
                Refine {{ localRecipe?.name }}
              </app-button>
            </div>
          </div>
          <app-tag class="mr-2" v-if="localRecipe?.cooking_time_minutes">
            <i-clock></i-clock>
            <span class="ml-1"
              >{{ localRecipe.cooking_time_minutes }} min.</span
            >
          </app-tag>
          <app-tag v-if="localRecipe?.calories_per_portion">
            <i-fire></i-fire>
            <span class="ml-1"
              >{{ localRecipe.calories_per_portion }} kcal</span
            >
          </app-tag>
        </section>

        <section class="mt-6">
          <h2>Ingredients</h2>

          <div class="mb-2 flex">
            <span class="my-auto mr-2">I'm cooking for </span>
            <div class="w-16">
              <app-input
                class="text-center"
                variant="small"
                type="number"
                v-model="userPortionsCount"
              ></app-input>
            </div>
            <span class="my-auto ml-2"> people </span>
          </div>

          <app-ingredient-list
            :editable="false"
            :ingredients="computedIngredients"
          ></app-ingredient-list>
        </section>

        <section class="mt-4 mb-8">
          <h2>Preparation steps</h2>
          <app-markdown :text="localRecipe?.description || ''"> </app-markdown>
        </section>
        <section class="mb-8">
          <h2 class="mb-4 text-2xl">Tagged as</h2>
          <app-pill-list :texts="localRecipe?.tags"></app-pill-list>
        </section>
      </template>

      <template v-slot:default>
        <h2 class="mt-2 text-xl">More recipes like this</h2>
        <app-gallery
          class="mb-8"
          :items="localRecipeSuggestions"
          :columns="1"
          @click="onClickGalleryItem"
        ></app-gallery>

        <h2 class="mb-4 text-xl">More recipes from {{ submittedBy }}</h2>
        <app-gallery
          :items="localRecipeByUser"
          :columns="1"
          @click="onClickGalleryItem"
        ></app-gallery>
      </template>
    </app-grid>
  </app-container>
</template>

<style scoped></style>
