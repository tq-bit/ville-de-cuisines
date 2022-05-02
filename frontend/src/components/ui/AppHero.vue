<script setup lang="ts">
import AppGrid from '../layout/content/AppGrid.vue';
import ImgCookingHero from '../img/imgCookingHero.vue';
import AppButton from '../form/AppButton.vue';

const emit = defineEmits(['clickGetStarted']);
</script>

<template>
  <app-grid variant="equal">
    <template v-slot:left>
      <section>
        <img-cooking-hero></img-cooking-hero>
      </section>
    </template>

    <template v-slot:default>
      <section
        class="mt-12 flex h-full w-full items-center justify-center md:mt-0"
      >
        <div class="text-center">
          <h1 class="mb-4 text-2xl md:text-4xl">
            iCuisine - Your kitchen's digital twin
          </h1>
          <p class="text-md mb-4 md:text-lg">
            Create and manage your favorite recipes - then share them with the
            world.
          </p>
          <app-button @click="emit('clickGetStarted')">Get started</app-button>
        </div>
      </section>
    </template>
  </app-grid>
</template>

<style scoped></style>
