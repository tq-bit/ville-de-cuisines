<script setup lang="ts">
import { ref, toRefs } from 'vue';
import AppNavbar from './AppNavbar.vue';
import AppSidebar from './AppSidebar.vue';
import AppSearch from '../AppSearch.vue';
import useUserStore from '../../../store/userStore';

const showSidebar = ref<boolean>(false);

const { isUserLoggedIn } = toRefs(useUserStore());
</script>

<template>
	<header class="pb-16">
		<app-navbar :is-user-logged-in="isUserLoggedIn" @toggle-sidebar="showSidebar = !showSidebar">
			<template v-slot:search>
				<app-search></app-search>
			</template>
		</app-navbar>
	</header>
	<app-sidebar
		:is-user-logged-in="isUserLoggedIn"
		:show="showSidebar"
		@toggle-sidebar="showSidebar = !showSidebar"
	>
		<template v-slot:search>
			<app-search></app-search>
		</template>
	</app-sidebar>
</template>

<style scoped></style>
