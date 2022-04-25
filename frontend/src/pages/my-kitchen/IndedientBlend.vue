<script setup lang="ts">
import AppScreenModal from '../../components/layout/AppScreenModal.vue';
import AppCard from '../../components/form/AppCard.vue';
import AppAlert from '../../components/ui/AppAlert.vue';
import AppSelect from '../../components/form/AppSelect.vue';
import AppInput from '../../components/form/AppInput.vue';
import AppButton from '../../components/form/AppButton.vue';

import { useRouter } from 'vue-router';
import useIngredientForm from '../../use/form/ingredientForm';

const router = useRouter();
const {
  name,
  description,
  nutrients,
  calories,
  quantity,
  quantity_unit,
  hasFormErrors,
  httpError,
  validationErrors,
  handleIngredientSubmit,
} = useIngredientForm('create');

const closeIngredientsModal = () => {
  router.push({ path: '/my-kitchen' });
};

const onSubmitIngredient = async () => {
  await handleIngredientSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    closeIngredientsModal();
  }
};
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
        <app-input
          v-model="name"
          class="mb-2"
          name="name"
          label="Name"
        ></app-input>

        <app-input
          v-model="description"
          class="mb-2"
          name="description"
          label="Description"
        ></app-input>

        <app-input
          v-model="quantity"
          class="mb-2"
          name="quantity"
          label="Quantity"
        ></app-input>

        <app-input
          v-model="quantity_unit"
          class="mb-2"
          name="quantity_unit"
          label="Unit"
        ></app-input>

        <app-input
          v-model="calories"
          class="mb-2"
          name="calories"
          label="Calories"
        ></app-input>

        <app-input
          v-model="nutrients"
          class="mb-2"
          name="nutrients"
          label="Nutrients"
        ></app-input>

        <app-button type="submit">Submit ingredient</app-button>
      </form>
    </app-card>
  </app-screen-modal>
</template>

<style scoped></style>
