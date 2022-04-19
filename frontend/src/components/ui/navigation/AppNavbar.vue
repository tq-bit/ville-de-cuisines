<script setup lang="ts">
import { ref } from 'vue';
import iMenu from '../../icons/iMenu.vue';
import AppThemeButton from '../../form/AppThemeButton.vue';
import AppContainer from '../../layout/AppContainer.vue';
import AppNavbarMain from './AppNavbarMain.vue';
import AppNavbarSecondary from './AppNavbarSecondary.vue';

const isUserLoggedIn = ref<boolean>(true);

defineEmits(['toggleSidebar']);
</script>

<template>
	<header
		class="absolute z-50 top-0 left-0 w-full h-16 bg-gradient-to-bl from-green-400 to-green-500 dark:from-green-600 dark:to-green-700 text-gray-50"
	>
		<app-container>
			<div class="grid grid-cols-9 h-16">
				<div class="col-span-4 flex items-center justify-start">
					<button class="md:hidden flex flex-row" @click="$emit('toggleSidebar')">
						<i-menu></i-menu>
					</button>
					<section class="hidden md:block">
						<app-navbar-main
							direction="horizontal"
							:is-user-logged-in="isUserLoggedIn"
						></app-navbar-main>
					</section>
				</div>

				<div class="col-span-1 flex items-center justify-center text-lg font-semibold"></div>

				<div class="col-span-4 flex items-center justify-end">
					<section class="hidden md:block">
						<app-navbar-secondary
							direction="horizontal"
							:is-user-logged-in="isUserLoggedIn"
						></app-navbar-secondary>
					</section>
				</div>
			</div>
		</app-container>
	</header>
</template>
