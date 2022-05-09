<script setup lang="ts">
const emit = defineEmits(['clickGetStarted', 'clickLearnMore']);
</script>

<template>
  <app-grid variant="equal">
    <template v-slot:left>
      <section>
        <svg-cooking-hero></svg-cooking-hero>
      </section>
    </template>

    <template v-slot:default>
      <section
        class="mt-12 flex h-full w-full items-center justify-center md:mt-0"
      >
        <div class="text-center">
          <h1 class="mb-4 text-3xl md:text-4xl">Ville de cuisines</h1>
          <h2 class="mb-4 text-lg md:text-xl">
            Create culinary masterpieces. <br />
            Then share them with the world.
          </h2>
          <app-button @click="emit('clickGetStarted')">Signup now</app-button>
          <app-button class="ml-4" @click="emit('clickLearnMore')"
            >Learn more</app-button
          >
        </div>
      </section>
    </template>
  </app-grid>
</template>

<style scoped></style>
