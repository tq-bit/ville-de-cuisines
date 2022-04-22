<script setup lang="ts">
import { ref } from 'vue';
import { AlertVariant } from '../@types/commons';

import AppContainer from '../components/layout/content/AppContainer.vue';
import AppCard from '../components/form/AppCard.vue';
import AppInput from '../components/form/AppInput.vue';
import AppButton from '../components/form/AppButton.vue';
import AppAlert from '../components/ui/AppAlert.vue';

import iUser from '../components/icons/iUser.vue';
import iLock from '../components/icons/iLock.vue';
import iMail from '../components/icons/iMail.vue';

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
    <app-card title="Sign up to iCuisine" class="mt-12">
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

        <app-button block outline type="submit">Sign up!</app-button>

        <router-link
          to="/login"
          class="w-full mx-auto block mt-2 text-center text-green-600"
          >Already have an account? Login</router-link
        >
      </form>
    </app-card>
  </app-container>
</template>
