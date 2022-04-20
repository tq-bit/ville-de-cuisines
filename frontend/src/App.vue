<script setup lang="ts">
import AppThemeButton from './components/form/AppThemeButton.vue';
import AppNavigation from './components/ui/navigation/index.vue';
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
