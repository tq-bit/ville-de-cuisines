<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue';
import recipesApi from '@/api/recipes.api';

import useRecipeStore from '@/store/recipeStore';
import useIngredientsStore from '@/store/ingredientsStore';

import { useRouter } from 'vue-router';
import useRecipeForm from '@/use/form/recipeForm';
import useLazyIngredientSearch from '@/use/search/useLazyIngredientSearch';
import useLazyCategorySearch from '@/use/search/useLazyCategorySearch';
import useBusy from '@/use/useBusy';
import {
  AppGalleryItemType,
  AppUploadPayload,
  Ingredient,
  Recipe,
} from '@/@types';

// Busy indicator logic
const busyIndicator = useBusy('kitchen-recipe');

// Router
const router = useRouter();
const recipeId = router.currentRoute.value.params.recipeId as string;
const isForkMode = computed<boolean>(() => {
  return !!router.currentRoute.value.path.match('/refine');
});
const isEditMode = computed<boolean>(() => {
  return !!router.currentRoute.value.path.match('/edit');
});

// Recipe (main resource)
const {
  $id,
  name,
  original_recipe_id,
  cooking_time_minutes,
  preparation_time_minutes,
  portions_count,
  description,
  category_id,
  pushIngredient,
  pushTag,
  isPublic,
  httpError,
  primary_image_id,
  validationErrors,
  hasFormErrors,
  handleRecipeSubmit,
  handleRecipeReset,
  setRecipeValues,
} = useRecipeForm();
const recipeStore = useRecipeStore();

const onSubmitRecipe = async () => {
  busyIndicator.toggleLocalStatus();
  commitLocalTagState();
  commitLocalIngredientState();
  await handleRecipeSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    handleRecipeReset();
    router.push({ path: '/my-cuisine/' });
  }
  busyIndicator.toggleLocalStatus();
};
const setActiveRecipeToUpdate = async (recipeId: string) => {
  busyIndicator.toggleLocalStatus();
  const [response, error] = await recipesApi.fetchPublicRecipeById(recipeId);
  setRecipeValues({
    $id: response?.$id,
    name: response?.name,
    description: response?.description,
    is_public: response?.is_public,
    primary_image_id: response?.primary_image_id,
    username: response?.username,
    portions_count: response?.portions_count,
    category_id: response?.category_id,
  });

  setLocalIngredientState(response as Recipe);
  setLocalTagState(response as Recipe);
  setLocalCategoryState(response as Recipe);
  busyIndicator.toggleLocalStatus();
};
const onDeleteRecipe = async () => {
  const confirmationResult = window.confirm(
    'Do you really want to delete this recipe?',
  );
  if (recipeId && confirmationResult) {
    busyIndicator.toggleLocalStatus();

    await recipesApi.deleteRecipe(recipeId);
    router.push({ path: '/my-cuisine' });

    busyIndicator.toggleLocalStatus();
  }
};

// Recipe fork (Recipe sub - feature)
const setRecipeForkToCreate = async (recipeId: string) => {
  const [response, error] = await recipesApi.fetchPublicRecipeById(recipeId);
  setRecipeValues({
    name: response?.name,
    description: response?.description,
    is_public: response?.is_public,
    primary_image_id: response?.primary_image_id,
    portions_count: response?.portions_count,
    category_id: response?.category_id,
    original_recipe_id: recipeId,
  });

  setLocalIngredientState(response as Recipe);
  setLocalTagState(response as Recipe);
  setLocalCategoryState(response as Recipe);
};

onMounted(async () => {
  if (recipeId && isEditMode.value === true) {
    await setActiveRecipeToUpdate(recipeId);
  }

  if (recipeId && isForkMode.value === true) {
    await setRecipeForkToCreate(recipeId);
  }
});

// Recipe categories (Recipe sub resource)
const categoryQuery = ref<string>('');
const categoryName = ref<string>('');
const { handleSearch: handleCategorySearch, loading: categoryLoading } =
  useLazyCategorySearch(categoryQuery);
const onClickCategorySearchItem = (payload: AppGalleryItemType) => {
  categoryName.value = payload.title;
  category_id.value = payload.$id;
  categoryQuery.value = payload.title;
};
const setLocalCategoryState = (recipe: Recipe) => {
  category_id.value = recipe.category_id;
  categoryQuery.value = recipe.category_name || '';
};
watch(categoryQuery, handleCategorySearch);

// Recipe Image
const onDropRecipeImage = async (filePayload: AppUploadPayload) => {
  if (primary_image_id.value) {
    await recipesApi.deleteRecipeImage(primary_image_id.value as string);
  }
  const [fileResponse, fileError] = await recipesApi.uploadRecipeImage(
    filePayload.fileData,
  );
  primary_image_id.value = fileResponse?.$id as string;
};
const cleanUploadedImageIfExists = async () => {
  const isCreationFormAndHasUploadedImage = primary_image_id.value && !recipeId;

  if (isCreationFormAndHasUploadedImage) {
    await recipesApi.deleteRecipeImage(primary_image_id.value as string);
  }
};
onBeforeUnmount(async () => {
  await cleanUploadedImageIfExists();
});

// Ingredients
const ingredientsStore = useIngredientsStore();
const ingredientsQuery = ref<string>('');
let localIngredientState = ref<Ingredient[]>([]);
const { handleSearch, loading } = useLazyIngredientSearch(ingredientsQuery);
const onClickIngredientSearchItem = (ingredient: AppGalleryItemType) => {
  const ingredientToPush: Ingredient | undefined =
    ingredientsStore.ingredientSearchResults.find(
      (item) => item.$id === ingredient.$id,
    );
  if (ingredientToPush) {
    localIngredientState.value.push(ingredientToPush);
    ingredientsQuery.value = '';
  }
};
const setLocalIngredientState = (recipe: Recipe) => {
  localIngredientState.value = recipe?.ingredients ?? [];
};
const onRemoveLocalIngredientItem = (ingredient: Ingredient) => {
  localIngredientState.value = localIngredientState.value.filter(
    (item) => item.$id !== ingredient.$id,
  );
};
const commitLocalIngredientState = () => {
  localIngredientState.value.forEach((ingredient) =>
    pushIngredient(ingredient),
  );
};
watch(ingredientsQuery, handleSearch);
onMounted(async () => await ingredientsStore.syncIngredients());

// Tags
let localTagModel = ref<string>();
const localTagState = computed(() =>
  localTagModel.value?.split(',').map((text) => text.trim()),
);
const setLocalTagState = (recipe: Recipe) => {
  localTagModel.value = recipe?.tags?.join(', ');
};
const commitLocalTagState = () => {
  localTagState.value?.forEach((tag) => pushTag(tag.trim()));
};
</script>

<template>
  <app-container class="mt-4">
    <h1>
      <span :title="`RecipeID: ${recipeId}`" v-if="isEditMode">
        Updating recipe for {{ name }}</span
      >
      <span :title="`RecipeID: ${recipeId}`" v-else-if="isForkMode">
        Create your own recipe for {{ name }}</span
      >
      <span v-else> Create a new recipe</span>
    </h1>
    <app-alert class="mb-6" v-if="hasFormErrors" variant="error">
      <ul>
        <li>{{ httpError?.message }}</li>
        <li v-for="(error, idx) in validationErrors" :key="idx">
          {{ error }}
        </li>
      </ul>
    </app-alert>
    <form @submit.prevent="onSubmitRecipe">
      <app-grid variant="sidebar-left">
        <template v-slot:left>
          <app-file-input
            label="Upload a recipe image"
            class="mb-4"
            @drop="onDropRecipeImage"
          ></app-file-input>

          <app-switch
            v-model="isPublic"
            label="Make my recipe public"
          ></app-switch>
          <app-button
            :loading="busyIndicator.localStatus.value"
            class="hidden md:block"
            block
            type="submit"
            >Submit Recipe</app-button
          >

          <app-button
            v-if="isEditMode"
            variant="warning-outline"
            @click="onDeleteRecipe"
            class="mt-4 hidden md:block"
            block
            type="button"
            >Delete Recipe</app-button
          >
        </template>

        <template v-slot:default>
          <app-search
            v-model="categoryQuery"
            label-prefix="Start typing to search and choose a "
            label="Recipe category"
            :options="recipeStore.recipeCategorySearchResultsForGallery"
            :loading="categoryLoading"
            @click-item="onClickCategorySearchItem"
            listKey="name"
          ></app-search>

          <app-input v-model="name" name="name" label="Recipe name"></app-input>
          <app-input
            v-model="portions_count"
            name="portions_count"
            label="Recipe portions"
            type="number"
          ></app-input>

          <app-input
            v-model="localTagModel"
            label-prefix="Add comma-separated "
            label="Tags"
          ></app-input>
          <app-pill-list
            class="mb-4"
            :texts="(localTagState as string[])"
          ></app-pill-list>

          <app-input
            type="number"
            v-model="preparation_time_minutes"
            label="Preparation time in minutes"
          ></app-input>

          <app-input
            type="number"
            v-model="cooking_time_minutes"
            label="Cooking time in minutes"
          ></app-input>

          <app-search
            v-model="ingredientsQuery"
            label-prefix="Start typing to search and "
            label="Add ingredients"
            :options="ingredientsStore.ingredientSearchResultsForGallery"
            :loading="loading"
            @click-item="onClickIngredientSearchItem"
            listKey="name"
          ></app-search>
          <app-ingredient-list
            class="mb-4"
            :editable="true"
            :ingredients="localIngredientState"
            @remove-ingredient="onRemoveLocalIngredientItem"
          ></app-ingredient-list>

          <app-text-area
            v-model="description"
            name="description"
            label-prefix="Add the recipe's "
            label="Preparation steps"
            rows="10"
          ></app-text-area>

          <app-button
            :loading="busyIndicator.localStatus.value"
            class="md:hidden"
            block
            type="submit"
            >Submit Recipe</app-button
          >

          <app-button
            v-if="isEditMode"
            @click="onDeleteRecipe"
            class="md:hidden"
            block
            type="button"
            >Delete Recipe</app-button
          >
        </template>
      </app-grid>
    </form>
  </app-container>
</template>
