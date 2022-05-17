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
        @click="emit('click-navbar-item')"
        v-if="isUserLoggedIn"
        direction="vertical"
        to="/my-cuisine"
        >My Cuisine</app-navbar-item
      >
      <app-navbar-item
        @click="emit('click-navbar-item')"
        v-if="isUserLoggedIn"
        direction="vertical"
        to="/my-follows"
        >Following</app-navbar-item
      >

      <app-navbar-item
        @click="emit('click-navbar-item')"
        v-if="isUserLoggedIn"
        direction="vertical"
        to="/discover/users"
        >Chefs</app-navbar-item
      >
      <app-navbar-item
        @click="emit('click-navbar-item')"
        v-if="isUserLoggedIn"
        direction="vertical"
        to="/discover/categories"
        >Categories</app-navbar-item
      >

      <!-- Secondary navigation -->
      <app-navbar-item
        @click="emit('click-navbar-item')"
        v-if="isUserLoggedIn"
        direction="vertical"
        to="/profile"
        >Profile</app-navbar-item
      >
      <app-navbar-item
        @click="emit('click-navbar-item')"
        v-if="!isUserLoggedIn"
        direction="vertical"
        to="/login"
      >
        <i-login class="mb-1 mr-1 inline h-4 w-4"></i-login
        >Login</app-navbar-item
      >
      <app-navbar-item
        @click="emit('click-navbar-item')"
        v-if="!isUserLoggedIn"
        direction="vertical"
        to="/signup"
        ><i-user class="mb-1 mr-1 inline h-4 w-4"></i-user
        >Signup</app-navbar-item
      >
    </aside>
  </Transition>
</template>

<style scoped></style>
