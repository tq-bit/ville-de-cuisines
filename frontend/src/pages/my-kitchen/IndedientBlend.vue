<script setup lang="ts">
import AppScreenModal from '../../components/layout/AppScreenModal.vue';
import AppCard from '../../components/form/AppCard.vue';
import AppAlert from '../../components/ui/AppAlert.vue';
import AppSelect from '../../components/form/AppSelect.vue';
import AppInput from '../../components/form/AppInput.vue';
import AppButton from '../../components/form/AppButton.vue';

import { useRouter } from 'vue-router';
import usePrefForm from '../../use/form/userPrefForm';

const router = useRouter();
const {
  bio,
  location,
  theme,
  themeOptions,
  hasFormErrors,
  httpError,
  handleUpdatePreferencesSubmit,
} = usePrefForm();

const closePreferencesModal = () => {
  router.push({ path: '/my-kitchen' });
};

const onSubmitPreferences = async () => {
  await handleUpdatePreferencesSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    closePreferencesModal();
  }
};
</script>

<template>
  <app-screen-modal
    @keydown.esc="closePreferencesModal"
    @click-blend="closePreferencesModal"
  >
    <app-card
      block
      :closable="true"
      @close="closePreferencesModal"
      title="Preferences"
    >
      <form @submit.prevent="onSubmitPreferences">
        <app-input
          v-model="location"
          class="mb-2"
          name="location"
          label="Location"
        ></app-input>
        <app-input
          v-model="bio"
          class="mb-2"
          name="bio"
          label="Bio"
        ></app-input>
        <app-select
          class="mb-4"
          name="theme"
          v-model="theme"
          label-prefix="Select your preferred "
          label="App theme"
          :options="themeOptions"
        ></app-select>
        <app-button type="submit">Update preferences</app-button>
      </form>
    </app-card>
  </app-screen-modal>
</template>

<style scoped></style>
