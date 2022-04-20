<script setup lang="ts">
defineProps<{
	to: string;
	direction?: 'horizontal' | 'vertical';
}>();
</script>

<template>
	<router-link
		class="mx-2 font-semibold"
		:class="{
			'block mx-auto text-center my-2': direction === 'vertical',
		}"
		:to="to"
	>
		<slot />
	</router-link>
</template>

<style scoped></style>
