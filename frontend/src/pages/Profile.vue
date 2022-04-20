<script setup lang="ts">
import useUserStore from '../store/userStore';

const { account, sessionId, isUserLoggedIn } = useUserStore();
</script>

<template>
	<div>
		<h1>Profile</h1>
		<p>Login Status: {{ isUserLoggedIn }}</p>
		<p>Account details: {{ account }}</p>
		<p>Session details: {{ sessionId }}</p>
	</div>
</template>

<style scoped></style>
