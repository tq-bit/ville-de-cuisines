<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue';
import AppGrid from '../../components/layout/content/AppGrid.vue';
import AppContainer from '../../components/layout/content/AppContainer.vue';
import AppFileInput from '../../components/form/AppFileInput.vue';
import AppAlert from '../../components/ui/AppAlert.vue';
import AppInput from '../../components/form/AppInput.vue';
import AppButton from '../../components/form/AppButton.vue';

import useRecipeStore from '../../store/recipeStore';
import handleRecipeCategoryForm from '../../use/form/recipeCategoryForm';
import { useRouter } from 'vue-router';

// Router
const router = useRouter();
const recipeCategoryId = router.currentRoute.value.params
  .recipeCategoryId as string;

// Recipe Category
const {
  name,
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

const onDeleteRecipeCategory = () => {
  console.log('deleting category');
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
const onDropRecipeCategoryImage = (payload: any) => {
  console.log(payload);
};
</script>

<template>
  <app-container class="mt-4">
    <h1 class="my-4 text-3xl">
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

          <app-button
            v-if="recipeCategoryId"
            variant="warning-outline"
            @click="onDeleteRecipeCategory"
            class="mt-4 hidden md:block"
            block
            type="button"
            >Delete Category</app-button
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

          <app-button
            v-if="recipeCategoryId"
            @click="onDeleteRecipeCategory"
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
