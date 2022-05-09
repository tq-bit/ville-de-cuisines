<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

import useRecipeStore from '../../store/recipeStore';
import handleRecipeCategoryForm from '../../use/form/recipeCategoryForm';
import { useRouter } from 'vue-router';
import { AppUploadPayload } from '../../@types/commons';

// Router
const router = useRouter();
const recipeCategoryId = router.currentRoute.value.params
  .recipeCategoryId as string;

// Recipe Category
const {
  name,
  primary_image_id,
  hasFormErrors,
  httpError,
  validationErrors,
  handleRecipeCategorySubmit,
  handleRecipeCategoryReset,
  setRecipeCategoryValues,
} = handleRecipeCategoryForm();
const recipeStore = useRecipeStore();

const onSubmitRecipeCategory = async () => {
  await handleRecipeCategorySubmit();
  if (!hasFormErrors.value && !httpError.value) {
    handleRecipeCategoryReset();
    router.push({ path: '/my-kitchen' });
  }
};

const setActiveRecipeCategoryToUpdate = async (recipeCategoryId: string) => {
  const [response, error] = await recipeStore.fetchRecipeCategoryById(
    recipeCategoryId,
  );
  setRecipeCategoryValues({
    $id: response?.$id,
    name: response?.name,
    primary_image_id: response?.primary_image_id,
  });
};

onMounted(async () => {
  if (recipeCategoryId) {
    await setActiveRecipeCategoryToUpdate(recipeCategoryId);
  }
});

// Image methods
const onDropRecipeCategoryImage = async (filePayload: AppUploadPayload) => {
  if (primary_image_id.value) {
    await recipeStore.deleteRecipeCategoryImage(
      primary_image_id.value as string,
    );
  }
  const [fileResponse, fileError] = await recipeStore.uploadRecipeCategoryImage(
    filePayload.fileData,
  );
  primary_image_id.value = fileResponse?.$id as string;
};
const cleanUploadedImageIfExists = async () => {
  const isCreationFormAndHasUploadedImage =
    primary_image_id.value && !recipeCategoryId;

  if (isCreationFormAndHasUploadedImage) {
    await recipeStore.deleteRecipeCategoryImage(
      primary_image_id.value as string,
    );
  }
};
onBeforeUnmount(async () => {
  await cleanUploadedImageIfExists();
});
</script>

<template>
  <app-container class="mt-4">
    <h1>
      <span :title="`Category Id: ${recipeCategoryId}`" v-if="recipeCategoryId">
        Updating recipe for {{ recipeCategoryId }}</span
      >
      <span v-else> 🍲 Create a new category</span>
    </h1>
    <app-alert class="mb-6" v-if="hasFormErrors" variant="error">
      <ul>
        <li>{{ httpError?.message }}</li>
        <li v-for="(error, idx) in validationErrors" :key="idx">
          {{ error }}
        </li>
      </ul>
    </app-alert>
    <form @submit.prevent="onSubmitRecipeCategory">
      <app-grid variant="sidebar-left">
        <template v-slot:left>
          <app-file-input
            label="Upload a category image"
            class="mb-4"
            @drop="onDropRecipeCategoryImage"
          ></app-file-input>

          <app-button class="hidden md:block" block type="submit"
            >Submit Recipe Category</app-button
          >
        </template>

        <template v-slot:default>
          <app-input
            v-model="name"
            name="name"
            label="Category name"
          ></app-input>

          <app-button class="md:hidden" block type="submit"
            >Submit Recipe</app-button
          >
        </template>
      </app-grid>
    </form>
  </app-container>
</template>
