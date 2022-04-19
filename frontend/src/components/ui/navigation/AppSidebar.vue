<script lang="ts" setup>
withDefaults(defineProps<{ show: boolean }>(), {
	show: false,
});
</script>

<template>
	<Transition name="sidebar">
		<aside
			v-if="show"
			class="fixed top-0 left-0 w-screen h-screen z-10 px-4 pt-20 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-50"
		></aside>
	</Transition>
</template>

<style scoped></style>
