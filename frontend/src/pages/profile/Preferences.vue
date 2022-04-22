<script setup lang="ts">
import { ref } from 'vue';
import AppScreenModal from '../../components/layout/AppScreenModal.vue';
import AppCard from '../../components/form/AppCard.vue';
import AppAlert from '../../components/ui/AppAlert.vue';
import AppSelect from '../../components/form/AppSelect.vue';
import AppButton from '../../components/form/AppButton.vue';

import { useRouter } from 'vue-router';

const router = useRouter();

const closePreferencesModal = () => {
	router.push({ path: '/profile' });
};

const onSubmitPreferences = async () => {
	console.log('Submitting');
};
const option = ref('Option 0');
const options = ['Option 1', 'Option 2'];
</script>

<template>
	<app-screen-modal @keydown.esc="closePreferencesModal" @click-blend="closePreferencesModal">
		<app-card block :closable="true" @close="closePreferencesModal" title="Account settings">
			<form @submit.prevent="onSubmitPreferences">
				<app-select
					class="mb-4"
					name="usertheme"
					v-model="option"
					label-prefix="Select your preferred "
					label="App theme"
					:options="options"
				></app-select>
				<app-button type="submit">Update preferences</app-button>
			</form>
		</app-card>
	</app-screen-modal>
</template>

<style scoped></style>
