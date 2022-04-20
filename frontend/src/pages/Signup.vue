<script setup lang="ts">
import { ref } from 'vue';
import AppContainer from '../components/layout/AppContainer.vue';
import AppInput from '../components/form/AppInput.vue';
import AppButton from '../components/form/AppButton.vue';
import iUser from '../components/icons/iUser.vue';
import iLock from '../components/icons/iLock.vue';
import iMail from '../components/icons/iMail.vue';

import handleUserForm from '../use/userForm';

const { email, username, password, handleUserSubmit } = handleUserForm('signup');

let passwordFieldType = ref<'text' | 'password'>('password');

const togglePasswordInputType = () => {
	passwordFieldType.value = passwordFieldType.value === 'text' ? 'password' : 'text';
};
</script>

<template>
	<h1>Signup</h1>
	<app-container page>
		<form @submit.prevent="handleUserSubmit">
			<app-input v-model="username" type="text" label-prefix="Please choose a " label="Username">
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

			<app-button block outline type="submit">Signup with us</app-button>
		</form>
	</app-container>
</template>

<style scoped></style>
