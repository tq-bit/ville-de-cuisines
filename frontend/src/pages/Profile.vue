<script setup lang="ts">
import AppButton from '../components/form/AppButton.vue';
import useSessionStore from '../store/sessionStore';
import { useRouter } from 'vue-router';
import useGlobalAlert from '../use/globalAlert';

const { account, sessionId, isUserLoggedIn, destroyServerSession } = useSessionStore();
const { triggerGlobalAlert } = useGlobalAlert();
const router = useRouter();

const logout = async () => {
	await destroyServerSession();
	triggerGlobalAlert({
		message: 'You have been logged out',
		variant: 'success',
	});
	router.push({ path: '/' });
};
</script>

<template>
	<div>
		<h1>Profile</h1>
		<p>Login Status: {{ isUserLoggedIn }}</p>
		<p>Account details: {{ account }}</p>
		<p>Session details: {{ sessionId }}</p>
		<app-button @click="logout">Log out</app-button>
	</div>
</template>
