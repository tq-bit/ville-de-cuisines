<script setup lang="ts">
import AppGrid from '../../components/layout/content/AppGrid.vue';
import AppScreenModal from '../../components/layout/AppScreenModal.vue';
import AppCard from '../../components/form/AppCard.vue';
import AppAlert from '../../components/ui/AppAlert.vue';
import AppInput from '../../components/form/AppInput.vue';
import AppButton from '../../components/form/AppButton.vue';

import { useRouter } from 'vue-router';
import useUserProfileForm from '../../use/form/userProfileForm';

const router = useRouter();
const {
  username,
  email,
  password,
  oldPassword,
  newPassword,
  httpError,
  validationErrors,
  hasFormErrors,
  handleUpdateUsernameSubmit,
  handleUpdateEmailSubmit,
  handleUpdatePasswordSubmit,
} = useUserProfileForm();

const closeAccountModal = () => {
  router.push({ path: '/profile' });
};

const onSubmitUsername = async () => {
  await handleUpdateUsernameSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    closeAccountModal();
  }
};

const onSubmitEmail = async () => {
  await handleUpdateEmailSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    closeAccountModal();
  }
};

const onSubmitPassword = async () => {
  await handleUpdatePasswordSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    closeAccountModal();
  }
};
</script>

<template>
  <app-screen-modal
    @keydown.esc="closeAccountModal"
    @click-blend="closeAccountModal"
  >
    <app-card
      block
      :closable="true"
      @close="closeAccountModal"
      title="Account settings"
    >
      <app-alert class="mb-6" v-if="hasFormErrors" variant="error">
        <ul>
          <li>{{ httpError?.message }}</li>
          <li v-for="(error, idx) in validationErrors" :key="idx">
            {{ error }}
          </li>
        </ul>
      </app-alert>

      <h4 class="text-xl my-2 text-green-600">Update your username</h4>
      <form @submit.prevent="onSubmitUsername">
        <app-input
          name="username"
          v-model="username"
          hide-label
          label-prefix="Enter your "
          label="Username"
        ></app-input>
        <app-button type="submit">Update username</app-button>
      </form>

      <hr class="my-4" />

      <form @submit.prevent="onSubmitEmail">
        <h4 class="text-xl my-2 text-green-600">Update your email address</h4>
        <app-input
          name="email"
          v-model="email"
          hide-label
          label-prefix="Enter your "
          label="Email address"
        ></app-input>
        <app-input
          type="password"
          name="password"
          v-model="password"
          hide-label
          label-prefix="Confirm by entering your "
          label="Password"
        ></app-input>
        <app-button type="submit">Update email address</app-button>
      </form>

      <hr class="my-4" />

      <form @submit.prevent="onSubmitPassword">
        <h4 class="text-xl my-2 text-green-600">Update your password</h4>

        <app-grid variant="equal">
          <template v-slot:left>
            <app-input
              type="password"
              name="oldPassword"
              v-model="oldPassword"
              label-prefix="Enter your "
              label="Old password"
            ></app-input>
          </template>

          <template v-slot:default>
            <app-input
              type="password"
              name="newPassword"
              v-model="newPassword"
              label-prefix="Enter your "
              label="New password"
            ></app-input>
          </template>
        </app-grid>
        <app-button type="submit">Update password</app-button>
      </form>
    </app-card>
  </app-screen-modal>
</template>

<style scoped></style>
