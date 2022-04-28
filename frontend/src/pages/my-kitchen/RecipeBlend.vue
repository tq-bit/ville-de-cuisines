<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import AppGrid from '../../components/layout/content/AppGrid.vue';
import AppScreenModal from '../../components/layout/AppScreenModal.vue';
import AppPillList from '../../components/lists/pills/AppPillList.vue';
import AppCard from '../../components/form/AppCard.vue';
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
import { AppUploadPayload, Ingredient } from '../../@types/commons';

// Router
const router = useRouter();
const closeRecipeModal = () => router.push({ path: '/my-kitchen' });

// Recipe (main resource)
const {
  name,
  description,
  pushIngredient,
  pushTag,
  isPublic,
  httpError,
  primary_image,
  validationErrors,
  hasFormErrors,
  handleRecipeSubmit,
} = useRecipeForm();
const recipeStore = useRecipeStore();

const onSubmitRecipe = async () => {
  commitLocalTagState();
  commitLocalIngredientState();
  await handleRecipeSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    closeRecipeModal();
  }
};

// Recipe Image
const onDropRecipeImage = async (filePayload: AppUploadPayload) => {
  if (primary_image.value) {
    await recipeStore.deleteRecipeImage(primary_image.value as string);
  }
  const [fileResponse, fileError] = await recipeStore.uploadRecipeImage(
    filePayload.fileData,
  );
  primary_image.value = fileResponse?.$id as string;
};
onBeforeUnmount(async () => {
  if (primary_image.value) {
    await recipeStore.deleteRecipeImage(primary_image.value as string);
  }
});

// Ingredients
const ingredientsStore = useIngredientsStore();
const ingredientsQuery = ref<string>('');
const localIngredientState = ref<Ingredient[]>([]);
const { handleSearch, loading } = useLazyIngredientSearch(ingredientsQuery);
const onClickIngredientItem = (ingredient: Ingredient) => {
  localIngredientState.value.push(ingredient);
  ingredientsQuery.value = '';
};
const commitLocalIngredientState = () => {
  localIngredientState.value.forEach((ingredient) =>
    pushIngredient(ingredient),
  );
};
watch(ingredientsQuery, handleSearch);

// Tags
const localTagModel = ref<string>();
const localTagState = computed(() =>
  localTagModel.value?.split(',').map((text) => text.trim()),
);
const commitLocalTagState = () => {
  localTagState.value?.forEach((tag) => pushTag(tag.trim()));
};
</script>

<template>
  <app-screen-modal
    @keydown.esc="closeRecipeModal"
    @click-blend="closeRecipeModal"
  >
    <app-card
      block
      :closable="true"
      @close="closeRecipeModal"
      title="Add new recipe"
    >
      <app-alert class="mb-6" v-if="hasFormErrors" variant="error">
        <ul>
          <li>{{ httpError?.message }}</li>
          <li v-for="(error, idx) in validationErrors" :key="idx">
            {{ error }}
          </li>
        </ul>
      </app-alert>
      <form @submit.prevent="onSubmitRecipe">
        <app-grid variant="equal">
          <template v-slot:left>
            <app-input
              v-model="name"
              name="name"
              label="Recipe name"
            ></app-input>

            <app-input
              v-model="localTagModel"
              label-prefix="Add comma-separated "
              label="Tags"
            ></app-input>
            <app-pill-list :texts="(localTagState as string[])"></app-pill-list>
          </template>

          <app-file-input
            label="Upload a recipe image"
            class="mb-4"
            @drop="onDropRecipeImage"
          ></app-file-input>
        </app-grid>

        <app-search
          v-model="ingredientsQuery"
          label-prefix="Start typing to search and "
          label="Add ingredients"
          :options="ingredientsStore.ingredientSearchResults"
          :loading="loading"
          @click-item="onClickIngredientItem"
          listKey="name"
        ></app-search>

        <app-ingredient-list
          :editable="true"
          :ingredients="localIngredientState"
        ></app-ingredient-list>

        <app-text-area
          v-model="description"
          name="description"
          label-prefix="Add the recipe's "
          label="Preparation steps"
          rows="5"
        ></app-text-area>

        <app-switch
          v-model="isPublic"
          label="Make my recipe public"
        ></app-switch>
        <app-button type="submit">Submit Recipe</app-button>
      </form>
    </app-card>
  </app-screen-modal>
</template>
