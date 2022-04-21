<script setup lang="ts">
import AppScreenModal from '../../components/layout/AppScreenModal.vue';
import AppCard from '../../components/form/AppCard.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const closePreferenceModal = () => {
	router.push({ path: '/profile' });
};
</script>

<template>
	<app-screen-modal @click-blend="closePreferenceModal">
		<app-card block title="Settings"> Test </app-card>
	</app-screen-modal>
</template>

<style scoped></style>
