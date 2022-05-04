<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Ingredient, Recipe } from '../../@types/commons';
import AppContainer from '../../components/layout/content/AppContainer.vue';
import AppGrid from '../../components/layout/content/AppGrid.vue';
import AppImage from '../../components/ui/AppImage.vue';
import AppPillList from '../../components/lists/pills/AppPillList.vue';
import AppButton from '../../components/form/AppButton.vue';
import AppInput from '../../components/form/AppInput.vue';
import AppIngredientList from '../../components/lists/ingredients/AppIngredientList.vue';

import useRecipeStore from '../../store/recipeStore';
import useActiveUserStore from '../../store/activeUserStore';

// Router logic
const router = useRouter();
const recipeId = router.currentRoute.value.params.recipeId as string;

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
const localRecipeIsOriginal = computed(() => {
  return localRecipe.value?.original_recipe_id === localRecipe.value?.$id;
});
const setLocalRecipe = async () => {
  const [response, error] = await recipeStore.fetchRecipeById(recipeId);
  if (error) {
    console.error(error);
  }
  localRecipe.value = response as Recipe;
  userPortionsCount.value = localRecipe.value?.portions_count;
};

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

onMounted(async () => await setLocalRecipe());
</script>

<template>
  <app-container>
    <app-grid class="mt-4" variant="sidebar-left">
      <template v-slot:left>
        <app-image
          class="mb-2"
          cover="medium"
          :src="(localRecipe?.primary_image_href as string)"
        ></app-image>

        <section class="mb-4">
          <h1 class="mb-2 text-3xl">{{ localRecipe?.name }}</h1>
          <p>
            Submitted by
            <router-link
              class="font-semibold"
              :to="`/user/${localRecipe?.user_id}`"
              >{{ submittedBy }}</router-link
            >
          </p>
        </section>

        <app-button
          block
          v-if="activeUserIsSubmitter"
          @click="router.push({ path: `/my-kitchen/recipe/${recipeId}/edit` })"
          >Edit this recipe</app-button
        >

        <app-button
          block
          v-else
          @click="router.push({ path: `/my-kitchen/recipe/${recipeId}/fork` })"
          >Refine this recipe</app-button
        >
      </template>

      <template v-slot:default>
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
          <h2 class="my-4 text-2xl">Tagged as</h2>
          <app-pill-list :texts="localRecipe?.tags"></app-pill-list>
        </section>
      </template>
    </app-grid>
  </app-container>
</template>

<style scoped></style>
