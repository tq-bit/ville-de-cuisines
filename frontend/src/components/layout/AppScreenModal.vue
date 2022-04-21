<script setup lang="ts">
const emit = defineEmits(['click-blend'])
</script>

<template>
	<section
		@click.self="emit('click-blend')"
		class="absolute top-0 left-0 h-full w-screen bg-black bg-opacity-25 z-50 px-6"
	>
		<div class="relative">
			<div
				class="absolute top-24 left-0 right-0 max-w-xl mx-auto"
			>
				<slot />
			</div>
		</div>
	</section>
</template>
