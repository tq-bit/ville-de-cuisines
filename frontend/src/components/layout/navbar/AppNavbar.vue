<script setup lang="ts">
import { toRefs } from 'vue';
import Logo from '/iCuisine-logo.png';

import useSessionStore from '../../../store/sessionStore';
const { isUserLoggedIn } = toRefs(useSessionStore());

defineEmits(['toggleSidebar']);
</script>

<template>
  <header class="pb-16 md:pb-32">
    <nav
      class="absolute top-0 left-0 z-50 h-16 w-full border-b-2 bg-gray-50 px-4 dark:border-gray-600 dark:bg-gray-800 md:h-32 md:pb-32"
    >
      <button
        class="my-3 block h-10 w-10 md:hidden"
        @click="$emit('toggleSidebar')"
      >
        <i-menu></i-menu>
      </button>

      <section class="mx-auto w-full max-w-screen-xl">
        <!-- Icon or its placeholder -->
        <div class="mt-4 hidden h-16 w-3/12 md:inline-block xl:w-2/12">
          <img class="hidden md:inline-block" :src="Logo" alt="iCuisine logo" />
        </div>

        <!-- Applicationwide search -->
        <div class="mt-4 hidden h-16 w-6/12 md:inline-block xl:w-8/12">
          <app-navbar-search></app-navbar-search>
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

        <div
          class="hidden h-10 w-full items-center justify-center text-center md:flex"
        >
          <app-navbar-item v-if="isUserLoggedIn" to="/my-kitchen">
            My kitchen</app-navbar-item
          >
          <app-navbar-item v-if="isUserLoggedIn" to="/my-follows"
            >Following</app-navbar-item
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
