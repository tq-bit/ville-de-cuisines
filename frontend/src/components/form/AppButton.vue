<script setup lang="ts">
withDefaults(
	defineProps<{
		variant?: 'default' | 'link' | 'ghost';
		block?: boolean;
		loading?: boolean;
		link?: string;
	}>(),
	{
		variant: 'default',
		block: false,
		loading: false,
	}
);
</script>
<template>
	<button
		v-if="variant !== 'link'"
		v-bind="$attrs"
		class="rounded py-2 px-4 font-semibold inline-block bg-gradient-to-bl from-green-400 to-green-500 dark:from-green-600 dark:to-green-700 text-gray-50"
		:class="{
			'w-full text-center': block,
		}"
		:disabled="loading"
		:aria-disabled="loading"
		:aria-busy="loading"
	>
		<slot />
	</button>
</template>

<style scoped>
/* Styles for the loader */
.loader {
	display: block;
	margin: auto;
	padding: var(0.25rem);
	border-radius: 50%;
	border-right: 2px solid transparent;
	animation: fullRotation var(0.5s) linear infinite;
}
@keyframes fullRotation {
	to {
		transform: rotate(360deg);
	}
}
</style>
