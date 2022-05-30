<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { AppUploadPayload, AppGalleryItemType, Ingredient } from '../../@types';
import ingredientsApi from '../../api/ingredients.api';

import useIngredientsStore from '../../store/ingredientsStore';
import useIngredientForm from '../../use/form/ingredientForm';
import useLazyIngredientSearch from '../../use/search/useLazyIngredientSearch';
import useBusy from '@/use/useBusy';

// Busy indicator logic
const busyIndicator = useBusy('kitchen-ingredient');

// Router
const router = useRouter();

// Ingredient (main resource)
const ingredientsStore = useIngredientsStore();
const {
  $id,
  name,
  description,
  calories,
  quantity,
  quantity_unit,
  fat,
  saturated_fat,
  carbohydrate,
  sugar,
  fiber,
  protein,
  salt,
  primary_image_id,
  hasFormErrors,
  httpError,
  validationErrors,
  handleIngredientSubmit,
} = useIngredientForm();

const onSubmitIngredient = async () => {
  busyIndicator.toggleLocalStatus();
  await handleIngredientSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    router.go(-1);
  }
  busyIndicator.toggleLocalStatus();
};

const onDropIngredientImage = async (filePayload: AppUploadPayload) => {
  busyIndicator.toggleLocalStatus();
  if (primary_image_id.value) {
    await ingredientsApi.deleteIngredientImage(
      primary_image_id.value as string,
    );
  }
  const [fileResponse, fileError] = await ingredientsApi.uploadIngredientImage(
    filePayload.fileData,
  );
  primary_image_id.value = fileResponse?.$id as string;
  busyIndicator.toggleLocalStatus();
};

// Search logic
const ingredientsQuery = ref<string>('');
const { handleSearch, loading } = useLazyIngredientSearch(ingredientsQuery);
watch(ingredientsQuery, handleSearch);
onMounted(async () => await ingredientsStore.syncIngredients());
</script>

<template>
  <app-container class="mt-4">
    <h1>Create a new ingredient</h1>
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

          <app-button
            :loading="busyIndicator.localStatus.value"
            class="hidden md:block"
            block
            type="submit"
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
                min="0"
                v-model="quantity"
                class="mb-2"
                name="quantity"
                label="Quantity"
              ></app-input>
            </template>

            <app-select
              v-model="quantity_unit"
              class="mb-2"
              name="quantity_unit"
              label-prefix="Choose a "
              label="Quantity unit"
              :options="ingredientsStore.quantityOptions"
            ></app-select>
          </app-grid>

          <app-fieldset legend="Nutrients:">
            <app-grid class="mb-2" variant="equal">
              <template v-slot:left>
                <app-input
                  variant="small"
                  min="0"
                  v-model="calories"
                  class="mb-2"
                  name="calories"
                  label="Calories (kcal)"
                ></app-input>
              </template>

              <app-input
                variant="small"
                min="0"
                v-model="protein"
                class="mb-2"
                name="protein"
                label="Protein (g)"
              ></app-input>
            </app-grid>

            <app-grid class="mb-2" variant="equal">
              <template v-slot:left>
                <app-input
                  variant="small"
                  min="0"
                  v-model="fat"
                  class="mb-2"
                  name="fat"
                  label="Fat (g)"
                ></app-input>
              </template>

              <app-input
                variant="small"
                min="0"
                v-model="saturated_fat"
                class="mb-2"
                name="saturated_fat"
                label="Of it: Saturated fat (g)"
              ></app-input>
            </app-grid>

            <app-grid class="mb-2" variant="equal">
              <template v-slot:left>
                <app-input
                  variant="small"
                  min="0"
                  v-model="carbohydrate"
                  class="mb-2"
                  name="carbohydrate"
                  label="Carbohydrate (g)"
                ></app-input>
              </template>

              <app-input
                variant="small"
                min="0"
                v-model="sugar"
                class="mb-2"
                name="sugar"
                label="Of it: Sugar (g)"
              ></app-input>
            </app-grid>

            <app-grid class="mb-2" variant="equal">
              <template v-slot:left>
                <app-input
                  variant="small"
                  min="0"
                  v-model="fiber"
                  class="mb-2"
                  name="fiber"
                  label="Fiber (g)"
                ></app-input>
              </template>

              <app-input
                variant="small"
                min="0"
                v-model="salt"
                class="mb-2"
                name="salt"
                label="Salt (g)"
              ></app-input>
            </app-grid>
          </app-fieldset>

          <app-text-area
            rows="3"
            v-model="description"
            class="mb-2"
            name="description"
            label="Notes"
          ></app-text-area>

          <app-button
            class="md:hidden"
            block
            type="submit"
            :loading="busyIndicator.localStatus.value"
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
      label-prefix="Start typing to  "
      label="Search for ingredients"
      v-model="ingredientsQuery"
      :options="ingredientsStore.ingredientSearchResultsForGallery"
      :loading="loading"
    ></app-search>

    <app-feed
      size="small"
      :items="ingredientsStore.ingredientsForGallery"
    ></app-feed>
  </app-container>
</template>

<style scoped></style>
