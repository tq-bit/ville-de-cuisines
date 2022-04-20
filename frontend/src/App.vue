<script setup lang="ts">
import { onMounted } from 'vue';
import AppNavigation from './components/ui/navbar/index.vue';
import AppAlert from './components/ui/AppAlert.vue';

import useSessionStore from './store/sessionStore';
import useGlobalAlert from './use/globalAlert';

const { message, showGlobalAlert, variant } = useGlobalAlert();

const { syncLocalSessionIdWithCookie, fetchUserAccount } = useSessionStore();

onMounted(async () => {
	syncLocalSessionIdWithCookie();
	await fetchUserAccount();
});
</script>

<template>
	<main>
		<Transition name="fade-from-bottom">
			<app-alert
				v-if="showGlobalAlert && message"
				:variant="variant"
				class="absolute z-50 bottom-12 right-4 left-4 w-64 max-w-xs text-center block mx-auto"
			>
				{{ message }}
			</app-alert>
		</Transition>
		<app-navigation></app-navigation>
		<router-view v-slot="{ Component }">
			<transition mode="out-in" name="fade">
				<component :is="Component" />
			</transition>
		</router-view>
	</main>
</template>
