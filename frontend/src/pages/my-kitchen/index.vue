<script setup lang="ts">
import { onMounted } from 'vue';
import AppGrid from '../../components/layout/content/AppGrid.vue';
import AppButton from '../../components/form/AppButton.vue';
import AppCard from '../../components/form/AppCard.vue';
import AppGallery from '../../components/lists/gallery/AppGallery.vue';
import useRecipeStore from '../../store/recipeStore';
import useActiveUserStore from '../../store/activeUserStore';

import imgCookingManagement from '../../components/img/imgCookingManagement.vue';

import { useRouter } from 'vue-router';
import { AppGalleryItemType } from '../../@types/commons';

const router = useRouter();
const recipeStore = useRecipeStore();
const activeUserStore = useActiveUserStore();

const onGalleryItemClick = (payload: AppGalleryItemType) => {
  router.push({
    path: `/my-kitchen/recipe/${payload.$id}/edit`,
  });
};

const openRecipeModal = () => {
  router.push({ path: '/my-kitchen/recipe' });
};

const openIngredientModal = () => {
  router.push({ path: '/my-kitchen/ingredient' });
};

onMounted(
  async () =>
    await recipeStore.fetchActiveUserRecipes(activeUserStore.account.$id),
);
</script>

<template>
  <app-grid class="mt-4" variant="sidebar-left-and-right">
    <template v-slot:left>
      <app-card block title="My kitchen">
        <img-cooking-management class="mb-4"></img-cooking-management>
        <hr class="mb-4" />
        <app-button @click="openRecipeModal" class="mb-4" block>
          Add new recipe</app-button
        >
        <app-button @click="openIngredientModal" class="mb-4" block>
          Add public ingredients</app-button
        >
      </app-card>
    </template>

    <template v-slot:default>
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>

      <app-card block title="My recipes">
        <app-gallery
          :gallery-items="recipeStore.activeUserRecipesForGallery"
          @click="onGalleryItemClick"
        ></app-gallery>
      </app-card>
    </template>

    <template v-slot:right>
      <app-card block title="Schedule"></app-card>
    </template>
  </app-grid>
</template>

<style scoped></style>
