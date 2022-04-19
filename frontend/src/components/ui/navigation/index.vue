<script setup lang="ts">
import { ref } from 'vue';
import AppNavbar from './AppNavbar.vue';
import AppSidebar from './AppSidebar.vue';
import AppSearch from '../AppSearch.vue';
const showSidebar = ref<boolean>(false);
</script>

<template>
	<header class="pb-16">
		<app-navbar @toggle-sidebar="showSidebar = !showSidebar">
			<template v-slot:search>
				<app-search></app-search>
			</template>
		</app-navbar>
	</header>
	<app-sidebar :show="showSidebar" @toggle-sidebar="showSidebar = !showSidebar">
		<template v-slot:search>
			<app-search></app-search>
		</template>
	</app-sidebar>
</template>

<style scoped></style>
