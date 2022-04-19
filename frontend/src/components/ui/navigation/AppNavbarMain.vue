<script setup lang="ts">
import { AppNavigationItem } from '../../../router';

defineProps<{
	direction: 'horizontal' | 'vertical';
	isUserLoggedIn: boolean;
}>();

const navigationItems: AppNavigationItem[] = [
	{
		name: 'Home',
		path: '/',
		requiresLogin: false,
	},
	{
		name: 'Kitchen',
		path: '/my-kitchen',
		requiresLogin: true,
	},
	{
		name: 'Follows',
		path: '/my-follows',
		requiresLogin: true,
	},
];
</script>

<template>
	<nav>
		<ul
			class="flex"
			:class="{ 'flex-col': direction === 'vertical', 'flex-row': direction === 'horizontal' }"
		>
			<li v-for="navigationItem in navigationItems">
				<router-link
					class="navbar__item"
					v-if="navigationItem.requiresLogin === false || navigationItem.requiresLogin === isUserLoggedIn"
					:to="navigationItem.path"
				>
					{{ navigationItem.name }}
				</router-link>
			</li>
		</ul>
	</nav>
</template>

<style scoped></style>
