<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { AppGalleryItemType, Ingredient, Recipe } from '../../@types';
import AppContainer from '../../components/layout/content/AppContainer.vue';
import AppGrid from '../../components/layout/content/AppGrid.vue';
import AppImage from '../../components/ui/AppImage.vue';
import AppPillList from '../../components/lists/pills/AppPillList.vue';
import AppGallery from '../../components/lists/gallery/AppGallery.vue';
import AppButton from '../../components/form/AppButton.vue';
import AppInput from '../../components/form/AppInput.vue';
import AppIngredientList from '../../components/lists/ingredients/AppIngredientList.vue';

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
const suggestionCount = ref<number>(5);
const localRecipeSuggestions = ref<AppGalleryItemType[]>([]);
const localRecipeByUser = ref<AppGalleryItemType[]>([]);
const localRecipeIsOriginal = computed(() => {
  return localRecipe.value?.original_recipe_id === localRecipe.value?.$id;
});
const setLocalRecipe = async (recipeId: string) => {
  const [response, error] = await recipeStore.fetchRecipeById(recipeId);
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
    await recipeStore.syncRecipesByUser(userId as string);
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
  await setLocalRecipe(recipe.$id);
  await setLocalRecipeSuggestions(suggestionCount.value);
  await setLocalRecipeByUser();
};

onMounted(async () => {
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
          <h1 class="mb-2 text-3xl">{{ localRecipe?.name }}</h1>
          <app-image
            class="mb-2"
            cover="xlarge"
            :src="(localRecipe?.primary_image_href as string)"
          ></app-image>
          <div class="flex justify-between">
            <p>
              Category:
              <router-link
                class="font-semibold"
                :to="`/recipe/category/${localRecipe?.category_id}`"
                >{{ localRecipe?.category_name }}</router-link
              >
              <br />
              Submitted by
              <router-link
                class="font-semibold"
                :to="`/user/${localRecipe?.user_id}`"
                >{{ submittedBy }}</router-link
              >
            </p>
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
                  router.push({ path: `/my-kitchen/recipe/${router.currentRoute.value.params.recipeId as string}/fork` })
                "
                >Refine recipe
              </app-button>
            </div>
          </div>
        </section>

        <section class="my-8">
          <h2 class="mb-4 text-2xl">Ingredients</h2>

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
            :show-calories="true"
            :editable="false"
            :ingredients="computedIngredients"
          ></app-ingredient-list>
        </section>

        <section class="mb-8">
          <h2 class="my-4 text-2xl">Preparation steps</h2>
          <p>
            {{ localRecipe?.description }}
          </p>
        </section>
        <section class="mb-8">
          <h2 class="mb-4 text-2xl">Tagged as</h2>
          <app-pill-list :texts="localRecipe?.tags"></app-pill-list>
        </section>
      </template>

      <template v-slot:default>
        <h2 class="mb-4 text-xl">More recipes like this</h2>
        <app-gallery
          class="mb-8"
          :gallery-items="localRecipeSuggestions"
          :columns="1"
          @click="onClickGalleryItem"
        ></app-gallery>

        <h2 class="mb-4 text-xl">More recipes from {{ submittedBy }}</h2>
        <app-gallery
          :gallery-items="localRecipeByUser"
          :columns="1"
          @click="onClickGalleryItem"
        ></app-gallery>
      </template>
    </app-grid>
  </app-container>
</template>

<style scoped></style>
