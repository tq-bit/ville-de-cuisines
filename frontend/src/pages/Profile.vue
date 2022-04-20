<script setup lang="ts">
import useUserStore from '../store/userStore';

const { userAccount, userSessionData, isUserLoggedIn } = useUserStore();
</script>

<template>
	<div>
		<h1>Profile</h1>
		<p>Login Status: {{ isUserLoggedIn }}</p>
		<p>Account details: {{ userAccount }}</p>
		<p>Session details: {{userSessionData}} </p>
	</div>
</template>

<style scoped></style>
