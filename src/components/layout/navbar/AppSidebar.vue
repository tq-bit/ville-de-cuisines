<script lang="ts" setup>
import { toRefs } from 'vue';
import AppNavbarItem from './AppNavbarItem.vue';
import useSessionStore from '../../../store/sessionStore';
const { isUserLoggedIn } = toRefs(useSessionStore());

defineProps<{
  show: boolean;
}>();
</script>

<template>
  <Transition name="sidebar">
    <aside
      v-if="show"
      class="fixed top-0 left-0 z-10 h-screen w-screen bg-gray-50 px-4 pt-20 text-gray-800 dark:bg-gray-800 dark:text-gray-50"
    >
      <!-- Primary navigation -->
      <app-navbar-item
        v-if="isUserLoggedIn"
        direction="vertical"
        to="/my-kitchen"
        >My kitchen</app-navbar-item
      >
      <app-navbar-item
        v-if="isUserLoggedIn"
        direction="vertical"
        to="/my-follows"
        >Following</app-navbar-item
      >

      <!-- Secondary navigation -->
      <app-navbar-item v-if="isUserLoggedIn" direction="vertical" to="/profile"
        >Profile</app-navbar-item
      >
      <app-navbar-item v-if="!isUserLoggedIn" direction="vertical" to="/login"
        >Login</app-navbar-item
      >
      <app-navbar-item v-if="!isUserLoggedIn" direction="vertical" to="/signup"
        >Signup</app-navbar-item
      >
    </aside>
  </Transition>
</template>

<style scoped></style>
