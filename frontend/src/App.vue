<script setup lang="ts">
import AppNavigation from './components/ui/navigation/index.vue';
</script>

<template>
	<app-navigation></app-navigation>
	<main>
		<router-view v-slot="{ Component }">
			<transition mode="out-in" name="fade">
				<component :is="Component" />
			</transition>
		</router-view>
	</main>
</template>
