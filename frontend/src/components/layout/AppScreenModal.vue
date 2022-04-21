<script setup lang="ts">
const emit = defineEmits(['click-blend'])
</script>

<template>
	<section
		@click.self="emit('click-blend')"
		class="absolute top-0 left-0 h-screen w-screen bg-black bg-opacity-25 z-50"
	>
		<div class="relative">
			<div
				class="absolute top-24 left-6 right-6 md:left-24 md:right-24 lg:left-36 lg:right-36 xl:left-48 xl:right-48"
			>
				<slot />
			</div>
		</div>
	</section>
</template>

<style scoped></style>
