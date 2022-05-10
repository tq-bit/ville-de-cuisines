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
        <div>
          <h1 class="mb-2 text-left">Ville de cuisines</h1>

          <hr class="mb-4 w-12 border border-green-600" />
          <ul class="mb-4">
            <li class="mb-2 text-lg">🧑 Create your profile</li>
            <li class="mb-2 text-lg">🥫 Maintain public ingredients</li>
            <li class="mb-2 text-lg">🍲 Save your favorite recipes</li>
            <li class="mb-2 text-lg">
              🌟 Invent and discover culinary masterpieces
            </li>
          </ul>
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
