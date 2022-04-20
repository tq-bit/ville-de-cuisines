<script setup lang="ts">
import AppButton from '../components/form/AppButton.vue';
import useUserStore from '../store/userStore';
import { useRouter } from 'vue-router';

const { account, sessionId, isUserLoggedIn, destroyServerSession } = useUserStore();
const router = useRouter();

const logout = async () => {
	await destroyServerSession();
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

<style scoped></style>
