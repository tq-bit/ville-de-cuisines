<script lang="ts" setup>
import { ref } from 'vue';
import AppNavbarMain from './AppNavbarMain.vue';
import AppNavbarSecondary from './AppNavbarSecondary.vue';

withDefaults(defineProps<{ show: boolean }>(), {
	show: false,
});

const isUserLoggedIn = ref<boolean>(true);
</script>

<template>
	<Transition name="sidebar">
		<aside
			v-if="show"
			class="fixed top-0 left-0 w-screen h-screen z-10 px-4 pt-20 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-50"
		>
			<section class="md:hidden block">
				<app-navbar-main direction="vertical" :is-user-logged-in="isUserLoggedIn"></app-navbar-main>
			</section>
			<section class="md:hidden block">
				<app-navbar-secondary
					direction="vertical"
					:is-user-logged-in="isUserLoggedIn"
				></app-navbar-secondary>
			</section>
		</aside>
	</Transition>
</template>

<style scoped></style>
