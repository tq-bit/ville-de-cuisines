<script setup lang="ts">
import { toRefs } from 'vue';
import AppNavbarItem from './AppNavbarItem.vue';
import AppSearch from '../../ui/AppSearch.vue';
import iMenu from '../../icons/iMenu.vue';
import iUser from '../../icons/iUser.vue';
import iLogin from '../../icons/iLogin.vue';

import useSessionStore from '../../../store/sessionStore';
const { isUserLoggedIn } = toRefs(useSessionStore());

defineEmits(['toggleSidebar']);
</script>

<template>
  <header class="pb-16 md:pb-32">
    <nav
      class="absolute z-50 top-0 left-0 w-full h-16 md:h-32 md:pb-32 px-4 bg-gradient-to-bl from-green-400 to-green-500 dark:from-green-600 dark:to-green-700 text-gray-50"
    >
      <button
        class="md:hidden block h-10 w-10 my-3"
        @click="$emit('toggleSidebar')"
      >
        <i-menu></i-menu>
      </button>

      <section class="w-full max-w-screen-xl mx-auto">
        <!-- Icon or its placeholder -->
        <div class="w-1/12 xl:w-2/12 h-16 mt-4 hidden md:inline-block">
          <span class="hidden md:block"> Icon </span>
        </div>

        <!-- Applicationwide search -->
        <div class="w-8/12 h-16 mt-4 hidden md:inline-block">
          <app-search></app-search>
        </div>

        <!-- User profile navigation -->
        <div
          class="w-3/12 xl:w-2/12 h-16 mt-4 hidden md:inline-block text-right"
        >
          <app-navbar-item v-if="isUserLoggedIn" to="/profile">
            <i-user class="w-4 h-4 inline mb-1 mr-1"></i-user>Profile
          </app-navbar-item>

          <app-navbar-item v-if="!isUserLoggedIn" to="/login">
            <i-login class="w-4 h-4 inline mb-1 mr-1"></i-login>Login
          </app-navbar-item>

          <app-navbar-item v-if="!isUserLoggedIn" to="/signup">
            <i-user class="w-4 h-4 inline mb-1 mr-1"></i-user>Signup
          </app-navbar-item>
        </div>

        <div class="w-full h-8 text-center hidden md:block">
          <app-navbar-item v-if="isUserLoggedIn" to="/my-kitchen">
            My kitchen</app-navbar-item
          >
          <app-navbar-item v-if="isUserLoggedIn" to="/my-follows"
            >My follows</app-navbar-item
          >
        </div>
      </section>
    </nav>
  </header>
</template>

<style scoped></style>
