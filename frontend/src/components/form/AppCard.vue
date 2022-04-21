<script setup lang="ts">
defineProps<{ center?: boolean; title?: string; block: boolean }>();
</script>

<template>
	<div
		class="p-4 w-full h-auto mx-auto border border-green-600 rounded bg-white shadow-md"
		:class="{ 'text-center': center, 'max-w-md': !block }"
	>
		<div class="flex w-full items-center justify-center"></div>
		<h3 class="text-3xl text-center mb-4">{{ title }}</h3>
		<slot name="default" />
	</div>
</template>
