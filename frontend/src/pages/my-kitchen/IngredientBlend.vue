<script setup lang="ts">
import { onMounted } from 'vue';
import AppGrid from '../../components/layout/content/AppGrid.vue';
import AppScreenModal from '../../components/layout/AppScreenModal.vue';
import AppCard from '../../components/form/AppCard.vue';
import AppAlert from '../../components/ui/AppAlert.vue';
import AppSelect from '../../components/form/AppSelect.vue';
import AppInput from '../../components/form/AppInput.vue';
import AppButton from '../../components/form/AppButton.vue';
import AppTextArea from '../../components/form/AppTextArea.vue';

import { useRouter } from 'vue-router';
import useIngredientForm from '../../use/form/ingredientForm';
import useIngredientsStore from '../../store/ingredientsStore';

const router = useRouter();
const {
  $id,
  name,
  description,
  calories,
  quantity,
  quantity_unit,
  hasFormErrors,
  httpError,
  validationErrors,
  handleIngredientSubmit,
  setIngredientToEditById,
} = useIngredientForm();
const { quantityOptions } = useIngredientsStore();

const closeIngredientsModal = () => {
  router.push({ path: '/my-kitchen' });
};

const onSubmitIngredient = async () => {
  await handleIngredientSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    closeIngredientsModal();
  }
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
  <app-screen-modal
    @keydown.esc="closeIngredientsModal"
    @click-blend="closeIngredientsModal"
  >
    <app-card
      block
      :closable="true"
      @close="closeIngredientsModal"
      title="Add new ingredient"
    >
      <app-alert class="mb-6" v-if="hasFormErrors" variant="error">
        <ul>
          <li>{{ httpError?.message }}</li>

          <li>{{ validationErrors?.name }}</li>
          <li>{{ validationErrors?.description }}</li>
          <li>{{ validationErrors?.quantity }}</li>
          <li>{{ validationErrors?.quantity_unit }}</li>
          <li>{{ validationErrors?.calories }}</li>
          <li>{{ validationErrors?.nutrients }}</li>
        </ul>
      </app-alert>
      <form @submit.prevent="onSubmitIngredient">
        <app-grid v-if="$id" variant="equal">
          <template v-slot:left>
            <app-input
              v-model="name"
              class="mb-2"
              name="name"
              label="Name"
            ></app-input>
          </template>

          <app-input
            v-if="$id"
            v-model="$id"
            class="mb-2"
            name="id"
            label="Ingredient ID"
          ></app-input>
        </app-grid>
        <app-input
          v-else
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
            :options="quantityOptions"
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
        <app-button type="submit">Submit ingredient</app-button>
      </form>
    </app-card>
  </app-screen-modal>
</template>

<style scoped></style>
