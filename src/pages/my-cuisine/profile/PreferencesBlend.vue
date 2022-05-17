<script setup lang="ts">
import { useRouter } from 'vue-router';
import usePrefForm from '@/use/form/userPrefForm';

// Router
const router = useRouter();
const closePreferencesModal = () => router.go(-1);

const {
  bio,
  theme,
  facebook_url,
  instagram_url,
  pinterest_url,
  themeOptions,
  hasFormErrors,
  httpError,
  validationErrors,
  handleUpdatePreferencesSubmit,
} = usePrefForm();

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
      <app-alert class="mb-6" v-if="hasFormErrors" variant="error">
        <ul>
          <li>{{ httpError?.message }}</li>
          <li v-for="(error, idx) in validationErrors" :key="idx">
            {{ error }}
          </li>
        </ul>
      </app-alert>
      <form @submit.prevent="onSubmitPreferences">
        <app-input
          name="facebook_url"
          v-model="facebook_url"
          label="Facebook Profile"
        ></app-input>
        <app-input
          name="instagram_url"
          v-model="instagram_url"
          label="Instagram Profile"
        ></app-input>
        <app-input
          name="pinterest_url"
          v-model="pinterest_url"
          label="Pinterest Profile"
        ></app-input>
        <app-select
          class="mb-4"
          name="theme"
          v-model="theme"
          label-prefix="Select your preferred "
          label="App theme"
          :options="themeOptions"
        ></app-select>

        <app-text-area
          v-model="bio"
          class="mb-2"
          name="bio"
          label="Bio"
        ></app-text-area>

        <app-button type="submit">Update preferences</app-button>
      </form>
    </app-card>
  </app-screen-modal>
</template>

<style scoped></style>
