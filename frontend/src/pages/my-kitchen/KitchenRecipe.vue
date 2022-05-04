<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onBeforeUnmount,
  onMounted,
  nextTick,
} from 'vue';
import AppGrid from '../../components/layout/content/AppGrid.vue';
import AppContainer from '../../components/layout/content/AppContainer.vue';
import AppPillList from '../../components/lists/pills/AppPillList.vue';
import AppFileInput from '../../components/form/AppFileInput.vue';
import AppAlert from '../../components/ui/AppAlert.vue';
import AppTextArea from '../../components/form/AppTextArea.vue';
import AppSwitch from '../../components/form/AppSwitch.vue';
import AppInput from '../../components/form/AppInput.vue';
import AppButton from '../../components/form/AppButton.vue';
import AppSearch from '../../components/ui/AppSearch.vue';
import AppIngredientList from '../../components/lists/ingredients/AppIngredientList.vue';

import useRecipeStore from '../../store/recipeStore';
import useIngredientsStore from '../../store/ingredientsStore';

import { useRouter } from 'vue-router';
import useRecipeForm from '../../use/form/recipeForm';
import useLazyIngredientSearch from '../../use/search/useLazyIngredientSearch';
import useLazyCategorySearch from '../../use/search/useLazyCategorySearch';
import {
  AppUploadPayload,
  Ingredient,
  Recipe,
  RecipeCategory,
} from '../../@types/commons';

// Router
const router = useRouter();
const recipeId = router.currentRoute.value.params.recipeId as string;
const closeRecipeModal = () => router.push({ path: '/my-kitchen' });

// Recipe (main resource)
const {
  name,
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
  commitLocalTagState();
  commitLocalIngredientState();
  await handleRecipeSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    handleRecipeReset();
    closeRecipeModal();
  }
};
const setActiveRecipeToUpdate = async (recipeId: string) => {
  const [response, error] = await recipeStore.fetchRecipeById(recipeId);
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
};
const onDeleteRecipe = async () => {
  const confirmationResult = window.confirm(
    'Do you really want to delete this recipe?',
  );
  if (recipeId && confirmationResult) {
    await recipeStore.handleRecipeDeletion(recipeId);
    router.push({ path: '/my-kitchen' });
  }
};
onMounted(async () => {
  if (recipeId) {
    await setActiveRecipeToUpdate(recipeId);
  }
});

// Recipe categories (Recipe sub resource)
const categoryQuery = ref<string>('');
const categoryName = ref<string>('');
const { handleSearch: handleCategorySearch, loading: categoryLoading } =
  useLazyCategorySearch(categoryQuery);
const onClickCategorySearchItem = (payload: RecipeCategory) => {
  categoryName.value = payload.name;
  category_id.value = payload.$id;
  categoryQuery.value = payload.name;
};
watch(categoryQuery, handleCategorySearch);

// Recipe Image
const onDropRecipeImage = async (filePayload: AppUploadPayload) => {
  if (primary_image_id.value) {
    await recipeStore.deleteRecipeImage(primary_image_id.value as string);
  }
  const [fileResponse, fileError] = await recipeStore.uploadRecipeImage(
    filePayload.fileData,
  );
  primary_image_id.value = fileResponse?.$id as string;
};
const cleanUploadedImageIfExists = async () => {
  const isCreationFormAndHasUploadedImage = primary_image_id.value && !recipeId;

  if (isCreationFormAndHasUploadedImage) {
    await recipeStore.deleteRecipeImage(primary_image_id.value as string);
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
const onClickIngredientSearchItem = (ingredient: Ingredient) => {
  localIngredientState.value.push(ingredient);
  ingredientsQuery.value = '';
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
    <h1 class="my-4 text-3xl">
      <span :title="`RecipeID: ${recipeId}`" v-if="recipeId">
        Updating recipe for {{ name }}</span
      >
      <span v-else> 🍲 Create a new masterpiece</span>
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
          <app-button class="hidden md:block" block type="submit"
            >Submit Recipe</app-button
          >

          <app-button
            v-if="recipeId"
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
            :options="recipeStore.recipeCategorySearchResults"
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
          <app-pill-list :texts="(localTagState as string[])"></app-pill-list>

          <app-text-area
            v-model="description"
            name="description"
            label-prefix="Add the recipe's "
            label="Preparation steps"
            rows="5"
          ></app-text-area>

          <app-search
            v-model="ingredientsQuery"
            label-prefix="Start typing to search and "
            label="Add ingredients"
            :options="ingredientsStore.ingredientSearchResults"
            :loading="loading"
            @click-item="onClickIngredientSearchItem"
            listKey="name"
          ></app-search>
          <app-ingredient-list
            :editable="true"
            :ingredients="localIngredientState"
            @remove-ingredient="onRemoveLocalIngredientItem"
          ></app-ingredient-list>

          <app-button class="md:hidden" block type="submit"
            >Submit Recipe</app-button
          >

          <app-button
            v-if="recipeId"
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
