<script setup lang="ts">
import { onMounted, provide } from 'vue';
import AppNavigation from './components/ui/navigation/index.vue';

import useUserStore from './store/userStore';

const {
	isUserLoggedIn,
	account,
	syncLocalSessionIdWithCookie,
	syncLocalSessionIdWithServerSession,
} = useUserStore();

provide('global:account', account);
provide('global:isUserLoggedIn', isUserLoggedIn);

onMounted(async () => {
	syncLocalSessionIdWithCookie();
	await syncLocalSessionIdWithServerSession();
});
</script>

<template>
	<main>
		<app-navigation></app-navigation>
		<router-view v-slot="{ Component }">
			<transition mode="out-in" name="fade">
				<component :is="Component" />
			</transition>
		</router-view>
	</main>
</template>
