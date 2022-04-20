<script setup lang="ts">
import { onMounted } from 'vue';
import AppNavigation from './components/ui/navigation/index.vue';

import useSessionStore from './store/sessionStore';

const { syncLocalSessionIdWithCookie, fetchUserAccount } = useSessionStore();

onMounted(async () => {
	syncLocalSessionIdWithCookie();
	await fetchUserAccount();
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
