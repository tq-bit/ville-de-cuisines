<script setup lang="ts">
import { ref } from 'vue';
import { AlertVariant } from '../@types/index';

import { useRouter } from 'vue-router';
import handleUserAuthForm from '../use/form/userAuthForm';

const {
  email,
  username,
  password,
  handleUserSubmit,
  hasFormErrors,
  httpError,
  validationErrors,
} = handleUserAuthForm('signup');
const router = useRouter();

const signupForm = ref<HTMLFormElement | null>(null);
const alertVariant = ref<AlertVariant>(
  !!validationErrors ? 'error' : 'success',
);

const onSubmit = async (): Promise<void> => {
  await handleUserSubmit();
  if (!hasFormErrors.value && !httpError.value) {
    signupForm.value?.reset();
    router.push({ path: '/profile' });
  }
};

let passwordFieldType = ref<'text' | 'password'>('password');
const togglePasswordInputType = () => {
  passwordFieldType.value =
    passwordFieldType.value === 'text' ? 'password' : 'text';
};
</script>

<template>
  <app-container page>
    <app-card title="Sign up" class="mt-12">
      <app-alert class="mb-6" v-if="hasFormErrors" :variant="alertVariant">
        <ul>
          <li>{{ httpError?.message }} {{ httpError?.code }}</li>
          <li>{{ validationErrors?.email }}</li>
          <li>{{ validationErrors?.password }}</li>
        </ul>
      </app-alert>

      <form @submit.prevent="onSubmit">
        <app-input
          v-model="username"
          type="text"
          label-prefix="Please choose a "
          label="Username"
        >
          <template v-slot:icon>
            <i-user></i-user>
          </template>
        </app-input>

        <app-input
          v-model="email"
          type="email"
          label-prefix="Please enter your "
          label="Email address"
        >
          <template v-slot:icon>
            <i-mail></i-mail>
          </template>
        </app-input>

        <app-input
          v-model="password"
          :type="passwordFieldType"
          label-prefix="Choose a strong "
          label="Password"
          @click-icon="togglePasswordInputType"
        >
          <template v-slot:icon>
            <i-lock class="cursor-pointer"></i-lock>
          </template>
        </app-input>

        <app-button block outline class="mb-2" type="submit"
          >Sign up!</app-button
        >

        <app-button
          block
          type="button"
          variant="link"
          @click="router.push({ path: '/login' })"
          >Already have an account? Login</app-button
        >
      </form>
    </app-card>
  </app-container>
</template>
