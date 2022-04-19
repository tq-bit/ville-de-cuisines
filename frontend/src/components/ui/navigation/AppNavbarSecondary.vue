<script setup lang="ts">
import iUser from '../../icons/iUser.vue';
import iLogin from '../../icons/iLogin.vue';
import iNewUser from '../../icons/iNewUser.vue';

defineProps<{
	direction: 'horizontal' | 'vertical';
	isUserLoggedIn: boolean;
}>();
</script>

<template>
	<ul
		class="flex"
		:class="{ 'flex-col': direction === 'vertical', 'flex-row': direction === 'horizontal' }"
	>
		<router-link class="navbar__item" v-if="isUserLoggedIn" to="/profile">
			<div class="h-6 w-6 mr-1"><i-user></i-user></div>
			Profile
		</router-link>

		<router-link class="navbar__item" v-if="!isUserLoggedIn" to="/signup">
			<div class="h-6 w-6 mr-1"><i-new-user></i-new-user></div>
			Signup
		</router-link>
		<router-link class="navbar__item" v-if="!isUserLoggedIn" to="/login">
			<div class="h-6 w-6 mr-1"><i-login></i-login></div>
			Login
		</router-link>
	</ul>
</template>

<style scoped></style>
