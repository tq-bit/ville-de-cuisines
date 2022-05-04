<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Recipe } from '../../@types/commons';
import AppContainer from '../../components/layout/content/AppContainer.vue';
import AppGrid from '../../components/layout/content/AppGrid.vue';
import AppImage from '../../components/ui/AppImage.vue';
import AppPillList from '../../components/lists/pills/AppPillList.vue';

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
};

// Ingredients & nutrients logic
const computedIngredients = computed(() => {
  return localRecipe.value?.ingredients;
});

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

        <app-pill-list :texts="localRecipe?.tags"></app-pill-list>
      </template>

      <template v-slot:default>
        <h1 class="mb-2 text-3xl">{{ localRecipe?.name }}</h1>
        <p class="mb-4">
          Submitted by
          <router-link
            class="font-semibold"
            :to="`/user/${localRecipe?.user_id}`"
            >{{ submittedBy }}</router-link
          >
        </p>
      </template>
    </app-grid>
  </app-container>
</template>

<style scoped></style>
