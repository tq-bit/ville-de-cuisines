<script lang="ts" setup>
import { toRefs } from 'vue';
import AppNavbarItem from './AppNavbarItem.vue';
import useSessionStore from '../../../store/sessionStore';
const { isUserLoggedIn } = toRefs(useSessionStore());

defineProps<{
  show: boolean;
}>();
const emit = defineEmits(['click-navbar-item']);
</script>

<template>
  <Transition name="sidebar">
    <aside
      v-if="show"
      class="fixed top-0 left-0 z-20 h-screen w-screen bg-gray-50 px-4 pt-20 text-gray-800 dark:bg-gray-800 dark:text-gray-50"
    >
      <app-navbar-search></app-navbar-search>
      <!-- Primary navigation -->
      <app-navbar-item
        v-if="isUserLoggedIn"
        direction="vertical"
        to="/my-cuisine"
        @click="emit('click-navbar-item')"
        >My Cuisine</app-navbar-item
      >
      <app-navbar-item
        v-if="isUserLoggedIn"
        direction="vertical"
        to="/my-follows"
        @click="emit('click-navbar-item')"
        >Following</app-navbar-item
      >

      <app-navbar-item
        v-if="isUserLoggedIn"
        direction="vertical"
        to="/discover/users"
        @click="emit('click-navbar-item')"
        >Chefs</app-navbar-item
      >
      <app-navbar-item
        v-if="isUserLoggedIn"
        direction="vertical"
        to="/discover/categories"
        @click="emit('click-navbar-item')"
        >Categories</app-navbar-item
      >

      <!-- Secondary navigation -->
      <app-navbar-item
        v-if="!isUserLoggedIn"
        direction="vertical"
        to="/login"
        @click="emit('click-navbar-item')"
      >
        <i-login class="mb-1 mr-1 inline h-4 w-4"></i-login
        >Login</app-navbar-item
      >
      <app-navbar-item
        v-if="!isUserLoggedIn"
        direction="vertical"
        to="/signup"
        @click="emit('click-navbar-item')"
        ><i-user class="mb-1 mr-1 inline h-4 w-4"></i-user
        >Signup</app-navbar-item
      >
    </aside>
  </Transition>
</template>

<style scoped></style>
