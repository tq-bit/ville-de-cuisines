<script setup lang="ts">
import AppGrid from '../components/layout/AppGrid.vue';
import AppButton from '../components/form/AppButton.vue';
import AppImage from '../components/ui/AppImage.vue';
import AppCard from '../components/form/AppCard.vue';

import { useRouter } from 'vue-router';
import useSessionStore from '../store/sessionStore';
import useGlobalAlert from '../use/globalAlert';

const { account, sessionId, isUserLoggedIn, destroyServerSession } = useSessionStore();
const { triggerGlobalAlert } = useGlobalAlert();
const router = useRouter();

const logout = async () => {
	await destroyServerSession();
	triggerGlobalAlert({
		message: 'You have been logged out',
		variant: 'success',
	});
	router.push({ path: '/' });
};
</script>

<template>
	<app-grid class="mt-4">
		<template v-slot:left>
			<app-card title="Your profile" block>
				<app-image class="mb-4" :rounded="true" size="xsmall" :src="account.avatar"></app-image>

				<app-button class="mb-4" @click="" block>Edit preferences</app-button>
				<app-button class="mb-4" @click="logout" block>Log out</app-button>
			</app-card>
		</template>

		<template v-slot:right
			><app-card class="mb-4" title="Feed" block> </app-card>

			<app-card class="mb-4" title="First item" block>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit consequatur culpa tempore
				vero perspiciatis omnis quod quam ullam quibusdam alias dolor illum consequuntur laboriosam,
				cum necessitatibus, nulla rem officia impedit!
			</app-card>

			<app-card class="mb-4" title="Second item" block>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit consequatur culpa tempore
				vero perspiciatis omnis quod quam ullam quibusdam alias dolor illum consequuntur laboriosam,
				cum necessitatibus, nulla rem officia impedit!
			</app-card>
		</template>
	</app-grid>
</template>
