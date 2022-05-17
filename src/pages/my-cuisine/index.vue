<script setup lang="ts">
import useActiveUserStore from '../../store/activeUserStore';

const activeUserStore = useActiveUserStore();
</script>

<template>
  <div>
    <div class="bg-gray-800 pt-6">
      <app-container>
        <app-profile-header
          :editable="true"
          :public-user="activeUserStore.user"
        ></app-profile-header>
        <nav
          class="overflow-x-auto whitespace-nowrap py-4 text-center md:text-left"
        >
          <app-navbar-item to="/my-cuisine/home"> Home</app-navbar-item>
          <app-navbar-item to="/my-cuisine/diet">
            Diet calender</app-navbar-item
          >
          <app-navbar-item to="/my-cuisine/recipe">
            Create new recipe</app-navbar-item
          >
          <app-navbar-item to="/my-cuisine/recipe-category">
            Create new category</app-navbar-item
          >
          <app-navbar-item to="/my-cuisine/ingredient">
            Manage ingredients</app-navbar-item
          >
        </nav>
      </app-container>
    </div>

    <app-container class="mt-4">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </app-container>
  </div>
</template>

<style scoped></style>
