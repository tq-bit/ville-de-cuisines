<script setup lang="ts"></script>

<template>
  <app-container class="mt-8" center>
    <div class="max-w-2xl">
      <h1>About this project</h1>
      <p class="mb-4 text-lg">
        Ville de Cuisines is my submission to the Dev.to Hackerthon of
        <a
          class="font-semibold text-green-400 dark:text-green-600"
          href="https://dev.to/devteam/announcing-the-appwrite-hackathon-on-dev-1oc0"
        >
          AppWrite. </a
        ><br />
        It started as the idea of a diet planner and grew into a social network
        for chefs to share their culinary masterpieces.
      </p>
      <hr class="mb-4 w-12 border border-green-600" />
      <p class="mb-4">
        There are plenty of cooking platforms on the internet. Each of which
        holds an uncounted number of recipes. And there are even more apps to
        track your calorie intake. Ville de Cuisines aims to bring together the
        best of both into a single, social platform.
      </p>

      <p class="mb-4">
        First and foremost however, it was designed to be <b>public</b>. All
        content, except for the recipes, is meant to be curatable by its
        members.
      </p>

      <p class="mb-4">
        You can learn more about the app on its
        <a
          class="text-green-400 dark:text-green-600"
          href="https://github.com/tq-bit/ville-de-cuisines"
          target="_blank"
          >Github repos</a
        >. Or by
        <router-link class="text-green-400 dark:text-green-600" to="/signup"
          >just trying it out</router-link
        >
      </p>

      <p class="mb-4 mt-8 rounded border py-2 text-center">
        Finally, thank you
        <a
          class="font-semibold text-green-400 dark:text-green-600"
          href="https://www.linkedin.com/in/tsvetomira-dichevska/"
          >@Tsvetomira Dichevska</a
        ><br />
        for the logo and the inspirational talks.
      </p>

      <h2 class="mb-2 text-2xl">Attributions</h2>
      <a
        class="text-green-400 dark:text-green-600"
        href="https://www.flaticon.com/free-icons/grocery"
        title="grocery icons"
        >Grocery icons created by ultimatearm - Flaticon</a
      >
    </div>
  </app-container>
</template>

<style scoped></style>
