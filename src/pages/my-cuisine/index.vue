<script setup lang="ts">
import { onMounted } from 'vue';
import { AppGalleryItemType, DietDayQuery } from '../../@types';
import useRecipeStore from '../../store/recipeStore';
import useActiveUserStore from '../../store/activeUserStore';
import useDietStore from '@/store/dietStore';
import dietApi from '@/api/diet.api';

import { useRouter } from 'vue-router';

const router = useRouter();
const recipeStore = useRecipeStore();
const activeUserStore = useActiveUserStore();
const dietStore = useDietStore();

const onGalleryItemClick = (payload: AppGalleryItemType) => {
  router.push({
    path: `/recipe/${payload.$id}`,
  });
};

const onClickDay = (payload: DietDayQuery) => {
  router.push({
    path: '/my-cuisine/diet/create',
    query: {
      date: payload.date,
      time: payload.time,
    },
  });
};

const onClickDelete = async (id: string) => {
  const deletionConfirmed = window.confirm(
    'Are you sure you want to delete this entry?',
  );
  if (deletionConfirmed) {
    await dietApi.deleteDiet(id);
    await dietStore.syncActiveUserDiets();
  }
};

const navToRecipeCreation = () => {
  router.push({ path: '/my-cuisine/recipe' });
};

const navToIngredientCreation = () => {
  router.push({ path: '/my-cuisine/ingredient' });
};

const navToRecipeCategoryCreation = () => {
  router.push({ path: '/my-cuisine/recipe-category' });
};

onMounted(
  async () =>
    await Promise.all([
      recipeStore.syncActiveUserRecipes(activeUserStore.account.$id),
      dietStore.syncActiveUserDiets(),
    ]),
);
</script>

<template>
  <app-grid class="mt-4" variant="sidebar-left">
    <template v-slot:left>
      <app-card class="hidden md:block" block>
        <svg-cooking-management
          class="mx-auto mb-4 w-10/12"
        ></svg-cooking-management>
        <hr class="mb-4" />
        <app-button
          size="small"
          class="mb-4"
          block
          @click="navToRecipeCreation"
        >
          Add new recipe</app-button
        >
        <app-button
          size="small"
          class="mb-4"
          block
          @click="navToRecipeCategoryCreation"
        >
          Add recipe category</app-button
        >
        <app-button
          size="small"
          class="mb-4"
          block
          @click="navToIngredientCreation"
        >
          Manage ingredients</app-button
        >
      </app-card>
    </template>

    <template v-slot:default>
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>

      <h2>This week's diet plan</h2>
      <app-diet-week
        @click-day="onClickDay"
        @click-delete="onClickDelete"
        class="mb-4"
        :items="dietStore.activeUserDiets"
      ></app-diet-week>

      <h2>Your recipes</h2>
      <app-gallery
        variant="recipe"
        :columns="3"
        :items="recipeStore.activeUserPublicRecipesForGallery"
        @click="onGalleryItemClick"
        @click-create="router.push({ path: '/my-cuisine/recipe' })"
      ></app-gallery>

      <app-toolbar class="md:hidden">
        <app-button size="small" @click="navToRecipeCreation">
          New recipe</app-button
        >
        <app-button size="small" @click="navToRecipeCategoryCreation">
          New category</app-button
        >
        <app-button size="small" @click="navToIngredientCreation">
          Ingredients</app-button
        >
      </app-toolbar>
    </template>
  </app-grid>
</template>

<style scoped></style>
