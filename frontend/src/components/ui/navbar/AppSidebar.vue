<script lang="ts" setup>
import { toRefs } from 'vue';
import AppNavbarItem from './AppNavbarItem.vue';
import useSessionStore from '../../../store/sessionStore';
const { isUserLoggedIn } = toRefs(useSessionStore());

defineProps<{
	show: boolean;
}>();
</script>

<template>
	<Transition name="sidebar">
		<aside
			v-if="show"
			class="fixed top-0 left-0 w-screen h-screen z-10 px-4 pt-20 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-50"
		>
			<!-- Primary navigation -->
			<app-navbar-item
				v-if="isUserLoggedIn"
				direction="vertical"
				text="My Recipes"
				to="/my-recipes"
			></app-navbar-item>
			<app-navbar-item
				v-if="isUserLoggedIn"
				direction="vertical"
				text="My follows"
				to="/my-follows"
			></app-navbar-item>

			<!-- Secondary navigation -->
			<app-navbar-item
				v-if="isUserLoggedIn"
				direction="vertical"
				text="Profile"
				to="/profile"
			></app-navbar-item>
			<app-navbar-item
				v-if="!isUserLoggedIn"
				direction="vertical"
				text="Login"
				to="/login"
			></app-navbar-item>
			<app-navbar-item
				v-if="!isUserLoggedIn"
				direction="vertical"
				text="Signup"
				to="/signup"
			></app-navbar-item>
		</aside>
	</Transition>
</template>

<style scoped></style>
