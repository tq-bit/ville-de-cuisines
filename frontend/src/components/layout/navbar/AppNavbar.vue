<script setup lang="ts">
import { toRefs } from 'vue';

import useSessionStore from '../../../store/sessionStore';
const { isUserLoggedIn } = toRefs(useSessionStore());

defineEmits(['toggleSidebar']);
</script>

<template>
  <header class="pb-16 md:pb-32">
    <nav
      class="absolute top-0 left-0 z-50 h-16 w-full bg-gradient-to-bl from-green-400 to-green-500 px-4 text-gray-50 dark:from-green-600 dark:to-green-700 md:h-32 md:pb-32"
    >
      <button
        class="my-3 block h-10 w-10 md:hidden"
        @click="$emit('toggleSidebar')"
      >
        <i-menu></i-menu>
      </button>

      <section class="mx-auto w-full max-w-screen-xl">
        <!-- Icon or its placeholder -->
        <div class="mt-4 hidden h-16 w-1/12 md:inline-block xl:w-2/12">
          <span class="hidden md:block"> Icon </span>
        </div>

        <!-- Applicationwide search -->
        <div class="mt-4 hidden h-16 w-8/12 md:inline-block">
          <app-search :options="[]"></app-search>
        </div>

        <!-- User profile navigation -->
        <div
          class="mt-4 hidden h-16 w-3/12 text-right md:inline-block xl:w-2/12"
        >
          <app-navbar-item v-if="isUserLoggedIn" to="/profile">
            <i-user class="mb-1 mr-1 inline h-4 w-4"></i-user>Profile
          </app-navbar-item>

          <app-navbar-item v-if="!isUserLoggedIn" to="/login">
            <i-login class="mb-1 mr-1 inline h-4 w-4"></i-login>Login
          </app-navbar-item>

          <app-navbar-item v-if="!isUserLoggedIn" to="/signup">
            <i-user class="mb-1 mr-1 inline h-4 w-4"></i-user>Signup
          </app-navbar-item>
        </div>

        <div class="hidden h-8 w-full text-center md:block">
          <app-navbar-item v-if="isUserLoggedIn" to="/my-kitchen">
            My kitchen</app-navbar-item
          >
          <app-navbar-item v-if="isUserLoggedIn" to="/my-follows"
            >My follows</app-navbar-item
          >
          <app-navbar-item to="/discover/users">Chefs</app-navbar-item>
          <app-navbar-item to="/discover/categories"
            >Categories</app-navbar-item
          >
        </div>
      </section>
    </nav>
  </header>
</template>

<style scoped></style>
