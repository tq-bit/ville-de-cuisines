<script setup lang="ts">
const emit = defineEmits(['clickGetStarted', 'clickLearnMore']);
</script>

<template>
  <app-grid variant="equal">
    <template v-slot:left>
      <section>
        <svg-cooking-hero class="md:w-full w-8/12 mx-auto"></svg-cooking-hero>
      </section>
    </template>

    <template v-slot:default>
      <section
        class="mt-8 flex h-full w-full items-center justify-center md:mt-0"
      >
        <div>
          <h1 class="mb-2 text-center md:text-left">Ville de cuisines</h1>
          <p class="mb-2 text-center  text-lg  md:text-left">Your kitchen's digital twin</p>

          <hr class="mb-4 mx-auto md:mx-0 w-12 border border-green-600 md:block" />
          <ul class="mb-4">
            <li class="mb-2 text-center md:text-left">
              🧑 Create your profile
            </li>
            <li class="mb-2 text-center md:text-left">
              🥫 Maintain public ingredients
            </li>
            <li class="mb-2 text-center md:text-left">
              🍲 Save your favorite recipes
            </li>
            <li class="mb-2 text-center md:text-left">
              🌟 Discover culinary masterpieces
            </li>
          </ul>
          <div class="text-center">

          <app-button class="mx-1 md:mx-0" @click="emit('clickGetStarted')"
            >Signup now</app-button
          >
          <app-button class="mx-1 md:ml-4 md:mx-0" @click="emit('clickLearnMore')"
            >Learn more</app-button
          >
          </div>
        </div>
      </section>
    </template>
  </app-grid>
</template>

<style scoped></style>
