<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AppUploadPayload } from '../../@types';

import useIngredientsStore from '../../store/ingredientsStore';
import useIngredientForm from '../../use/form/ingredientForm';

// Router
const router = useRouter();
const closeIngredientsModal = () => router.push({ path: '/my-kitchen' });

// Ingredient (main resource)
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
  setIngredientToEditById,
} = useIngredientForm();

const onSubmitIngredient = async () => {
  await handleIngredientSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    closeIngredientsModal();
  }
};

const onDropIngredientImage = async (filePayload: AppUploadPayload) => {
  if (primary_image_id.value) {
    await ingredientsStore.deleteIngredientImage(
      primary_image_id.value as string,
    );
  }
  const [fileResponse, fileError] =
    await ingredientsStore.uploadIngredientImage(filePayload.fileData);
  primary_image_id.value = fileResponse?.$id as string;
};

onMounted(() => {
  const params = router.currentRoute.value.params;
  const ingredientId = params.ingredientId as string;
  if (ingredientId) {
    setIngredientToEditById(ingredientId);
  }
});
</script>

<template>
  <app-container class="mt-4">
    <h1 class="my-4 text-3xl">
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
  </app-container>
</template>

<style scoped></style>
