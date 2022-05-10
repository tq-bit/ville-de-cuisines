<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { AppUploadPayload, AppGalleryItemType, Ingredient } from '../../@types';
import IngredientsApi from '../../api/resources/ingredients.api';

import useIngredientsStore from '../../store/ingredientsStore';
import useIngredientForm from '../../use/form/ingredientForm';
import useLazyIngredientSearch from '../../use/search/useLazyIngredientSearch';

// Router
const router = useRouter();

// Ingredient (main resource)
const ingredientsApi = new IngredientsApi();
const ingredientsStore = useIngredientsStore();
const {
  $id,
  name,
  description,
  calories,
  quantity,
  quantity_unit,
  primary_image_id,
  hasFormErrors,
  httpError,
  validationErrors,
  handleIngredientSubmit,
} = useIngredientForm();

const onSubmitIngredient = async () => {
  await handleIngredientSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    router.go(-1);
  }
};

const onDropIngredientImage = async (filePayload: AppUploadPayload) => {
  if (primary_image_id.value) {
    await ingredientsApi.deleteIngredientImage(
      primary_image_id.value as string,
    );
  }
  const [fileResponse, fileError] = await ingredientsApi.uploadIngredientImage(
    filePayload.fileData,
  );
  primary_image_id.value = fileResponse?.$id as string;
};


// Search logic
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
watch(ingredientsQuery, handleSearch);
onMounted(async () => await ingredientsStore.syncIngredients());
</script>

<template>
  <app-container class="mt-4">
    <h1>
      <span> 🍲 Create a new ingredient</span>
    </h1>
    <app-alert class="mb-6" v-if="hasFormErrors" variant="error">
      <ul>
        <li>{{ httpError?.message }}</li>
        <li v-for="(error, idx) in validationErrors" :key="idx">
          {{ error }}
        </li>
      </ul>
    </app-alert>
    <form @submit.prevent="onSubmitIngredient">
      <app-grid variant="sidebar-left">
        <template v-slot:left>
          <app-file-input
            label="Upload a ingredient image"
            class="mb-4"
            @drop="onDropIngredientImage"
          ></app-file-input>

          <app-button class="hidden md:block" block type="submit"
            >Submit ingredient</app-button
          >
        </template>

        <template v-slot:default>
          <app-input
            v-model="name"
            class="mb-2"
            name="name"
            label="Name"
          ></app-input>

          <app-grid variant="equal">
            <template v-slot:left>
              <app-input
                type="number"
                min="0"
                v-model="quantity"
                class="mb-2"
                name="quantity"
                label="Quantity"
              ></app-input>
            </template>

            <app-select
              v-model="quantity_unit"
              :options="ingredientsStore.quantityOptions"
              class="mb-2"
              name="quantity_unit"
              label-prefix="Choose a "
              label="Quantity unit"
            ></app-select>
          </app-grid>

          <app-input
            type="number"
            min="0"
            v-model="calories"
            class="mb-2"
            name="calories"
            label="Calories"
          ></app-input>

          <app-text-area
            rows="3"
            v-model="description"
            class="mb-2"
            name="description"
            label="Notes"
          ></app-text-area>

          <app-button class="md:hidden" block type="submit"
            >Submit ingredient</app-button
          >
        </template>
      </app-grid>
    </form>

    <h2 class="my-4 text-2xl">
      Or browse {{ ingredientsStore.ingredients.length }} public ingredients
    </h2>

    <app-search
      size="small"
      v-model="ingredientsQuery"
      label-prefix="Start typing to  "
      label="Search for ingredients"
      :options="ingredientsStore.ingredientSearchResultsForGallery"
      :loading="loading"
    ></app-search>

    <app-feed size="small" :items="ingredientsStore.ingredientsForGallery"></app-feed>
  </app-container>
</template>

<style scoped></style>
