<script setup lang="ts">
import iClose from '../icons/iClose.vue';
defineProps<{ center?: boolean; title?: string; block?: boolean; closable?: boolean }>();
const emit = defineEmits(['close']);
</script>

<template>
	<div
		class="relative p-4 w-full h-auto mx-auto rounded bg-white dark:bg-gray-800 border dark:border-gray-600 shadow-md"
		:class="{ 'text-center': center, 'max-w-md': !block }"
	>
		<span v-if="closable" @click="emit('close')" class="absolute right-4 top-4 cursor-pointer">
			<i-close></i-close>
		</span>
		<h3 class="text-3xl text-center mb-4">{{ title }}</h3>
		<slot name="default" />
	</div>
</template>
