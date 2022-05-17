<script setup lang="ts">
import { onMounted } from 'vue';
import { AppGalleryItemType, DietDayQuery } from '../../@types';
import useRecipeStore from '../../store/recipeStore';
import useActiveUserStore from '../../store/activeUserStore';

import { useRouter } from 'vue-router';

const router = useRouter();
const recipeStore = useRecipeStore();
const activeUserStore = useActiveUserStore();

const onGalleryItemClick = (payload: AppGalleryItemType) => {
  router.push({
    path: `/recipe/${payload.$id}`,
  });
};

onMounted(
  async () =>
    await Promise.all([
      recipeStore.syncActiveUserRecipes(activeUserStore.account.$id),
    ]),
);
</script>

<template>
  <div>
    <div class="bg-gray-800 pt-6">
      <app-container>
        <app-profile-header
          :editable="true"
          :public-user="activeUserStore.user"
        ></app-profile-header>
        <section
          class="overflow-x-auto whitespace-nowrap py-4 text-center md:text-left"
        >
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
        </section>
      </app-container>
    </div>

    <app-container class="mt-4">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>

      <h2>Your recipes</h2>
      <app-gallery
        variant="recipe"
        :columns="3"
        :items="recipeStore.activeUserPublicRecipesForGallery"
        @click="onGalleryItemClick"
        @click-create="router.push({ path: '/my-cuisine/recipe' })"
      ></app-gallery>
    </app-container>
  </div>
</template>

<style scoped></style>
