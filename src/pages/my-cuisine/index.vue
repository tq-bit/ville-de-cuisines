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

onMounted(
  async () =>
    await Promise.all([
      recipeStore.syncActiveUserRecipes(activeUserStore.account.$id),
      dietStore.syncActiveUserDiets(),
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
          <app-router-link to="/my-cuisine/recipe">
            Create new recipe</app-router-link
          >
          <app-router-link to="/my-cuisine/recipe-category">
            Create new category</app-router-link
          >
          <app-router-link to="/my-cuisine/ingredient">
            Manage ingredients</app-router-link
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
    </app-container>
  </div>
</template>

<style scoped></style>
