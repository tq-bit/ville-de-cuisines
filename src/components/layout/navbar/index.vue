<script setup lang="ts">
import { ref, toRefs } from 'vue';
import AppNavbar from './AppNavbar.vue';
import AppSidebar from './AppSidebar.vue';
import useSessionStore from '../../../store/sessionStore';

const showSidebar = ref<boolean>(false);

const { isUserLoggedIn } = toRefs(useSessionStore());
</script>

<template>
  <app-navbar
    :is-user-logged-in="isUserLoggedIn"
    @toggle-sidebar="showSidebar = !showSidebar"
  >
  </app-navbar>
  <app-sidebar :show="showSidebar"> </app-sidebar>
</template>
