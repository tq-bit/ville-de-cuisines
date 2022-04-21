<script setup lang="ts">
import { onMounted } from 'vue';
import AppGrid from '../../components/layout/AppGrid.vue';
import AppButton from '../../components/form/AppButton.vue';
import AppImage from '../../components/ui/AppImage.vue';
import AppCard from '../../components/form/AppCard.vue';

import { useRouter } from 'vue-router';
import useSessionStore from '../../store/sessionStore';
import useactiveUserStore from '../../store/activeUserStore';
import useGlobalAlert from '../../use/globalAlert';

const { destroyServerSession } = useSessionStore();
const activeUserStore = useactiveUserStore();
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

const openPreferenceModal = () => {
	router.push({ path: '/profile/preferences' });
};

onMounted(async () => await activeUserStore.fetchUserAccount());
</script>

<template>
	<div class="mt-4">
		<router-view v-slot="{ Component }">
			<transition name="fade">
				<component :is="Component" />
			</transition>
		</router-view>

		<app-grid>
			<template v-slot:left>
				<app-card title="Your profile" block>
					<app-image class="mb-4" :rounded="true" size="xsmall" :src="activeUserStore.account.avatar"></app-image>

					<app-button class="mb-4" @click="openPreferenceModal" block>Edit preferences</app-button>
					<app-button class="mb-4" @click="logout" block>Log out</app-button>
				</app-card>
			</template>

			<template v-slot:right
				><app-card class="mb-4" title="Feed" block> </app-card>

				<app-card class="mb-4" title="First item" block>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit consequatur culpa tempore
					vero perspiciatis omnis quod quam ullam quibusdam alias dolor illum consequuntur
					laboriosam, cum necessitatibus, nulla rem officia impedit!
				</app-card>

				<app-card class="mb-4" title="Second item" block>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit consequatur culpa tempore
					vero perspiciatis omnis quod quam ullam quibusdam alias dolor illum consequuntur
					laboriosam, cum necessitatibus, nulla rem officia impedit!
				</app-card>
			</template>
		</app-grid>
	</div>
</template>
