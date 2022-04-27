<script setup lang="ts">
import { ref, computed } from 'vue';
import AppGrid from '../../components/layout/content/AppGrid.vue';
import AppScreenModal from '../../components/layout/AppScreenModal.vue';
import AppPillList from '../../components/lists/pills/AppPillList.vue';
import AppCard from '../../components/form/AppCard.vue';
import AppFileInput from '../../components/form/AppFileInput.vue';
import AppAlert from '../../components/ui/AppAlert.vue';
import AppTextArea from '../../components/form/AppTextArea.vue';
import AppSwitch from '../../components/form/AppSwitch.vue';
import AppSelect from '../../components/form/AppSelect.vue';
import AppInput from '../../components/form/AppInput.vue';
import AppButton from '../../components/form/AppButton.vue';

import { useRouter } from 'vue-router';
import useRecipeForm from '../../use/form/recipeForm';
import { Ingredient } from '../../@types/commons';

const router = useRouter();
const {
  $id,
  originalRecipeId,
  name,
  description,
  pushIngredient,
  pushTag,
  removeIngredient,
  removeTag,
  isPublic,
  httpError,
  validationErrors,
  hasFormErrors,
  handleRecipeSubmit,
} = useRecipeForm();

const localTagModel = ref<string>();
const localTags = computed(() =>
  localTagModel.value?.split(',').map((text) => text.trim()),
);

const closeRecipeModal = () => router.push({ path: '/my-kitchen' });
const onSubmitIngredient = async () => {
  localTags.value?.forEach((tag) => pushTag(tag.trim()));
  await handleRecipeSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    closeRecipeModal();
  }
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
      <form @submit.prevent="onSubmitIngredient">
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
            <app-pill-list :texts="(localTags as string[])"></app-pill-list>
          </template>

          <app-file-input label="Upload a recipe image" class="mb-4">
          </app-file-input>
        </app-grid>

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

<style scoped></style>
