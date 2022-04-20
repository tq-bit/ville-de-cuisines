<script setup lang="ts">
import { ref } from 'vue';
import { AlertVariant } from '../@types/commons';

import AppContainer from '../components/layout/AppContainer.vue';
import AppFormCard from '../components/form/AppFormCard.vue';
import AppInput from '../components/form/AppInput.vue';
import AppButton from '../components/form/AppButton.vue';
import AppAlert from '../components/ui/AppAlert.vue';
import AppBackgroundImage from '../components/img/AppBackgroundImage.vue';

import iLock from '../components/icons/iLock.vue';
import iMail from '../components/icons/iMail.vue';

import { useRouter } from 'vue-router';
import handleUserForm from '../use/userForm';

const { email, password, handleUserSubmit, hasFormErrors, httpError, validationErrors } =
	handleUserForm('login');
const router = useRouter();

const signupForm = ref<HTMLFormElement | null>(null);
const alertVariant = ref<AlertVariant>(!!validationErrors ? 'error' : 'success');
const onSubmit = async (): Promise<void> => {
	await handleUserSubmit();
	if (!hasFormErrors.value && !httpError.value) {
		signupForm.value?.reset();
		router.push({ path: '/profile' });
	}
};

let passwordFieldType = ref<'text' | 'password'>('password');
const togglePasswordInputType = () => {
	passwordFieldType.value = passwordFieldType.value === 'text' ? 'password' : 'text';
};
</script>

<template>
	<app-container page>
		<app-form-card title="Login to iCuisine" class="mt-12">
			<app-alert class="mb-6" v-if="hasFormErrors" :variant="alertVariant">
				<ul>
					<li>{{ httpError?.message }} {{ httpError?.code }}</li>
					<li>{{ validationErrors?.email }}</li>
					<li>{{ validationErrors?.password }}</li>
				</ul>
			</app-alert>

			<form @submit.prevent="onSubmit">
				<app-input v-model="email" type="email" label-prefix="Enter your " label="Email address">
					<template v-slot:icon>
						<i-mail></i-mail>
					</template>
				</app-input>

				<app-input
					v-model="password"
					:type="passwordFieldType"
					label-prefix="Enter your "
					label="Password"
					@click-icon="togglePasswordInputType"
				>
					<template v-slot:icon>
						<i-lock class="cursor-pointer"></i-lock>
					</template>
				</app-input>

				<app-button block outline type="submit">Log in!</app-button>

				<router-link to="/signup" class="w-full mx-auto block mt-2 text-center text-green-600"
					>Not registered yet? Sign up</router-link
				>
			</form>
		</app-form-card>
	</app-container>
</template>
