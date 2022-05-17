<script setup lang="ts">
import { onMounted } from 'vue';
import { AppGalleryItemType } from '@/@types';
import { useRouter } from 'vue-router';

import usePublicUserStore from '@/store/publicUserStore';
import useRecipeStore from '@/store/recipeStore';

const publicUserStore = usePublicUserStore();
const recipeStore = useRecipeStore();
const router = useRouter();

const onGalleryItemClick = (payload: AppGalleryItemType) => {
  router.push({
    path: `/recipe/${payload.$id}`,
  });
};

const syncPublicUser = async () => {
  const userId = router.currentRoute.value.params.userId as string;
  await publicUserStore.syncPublicUserById(userId);
  await recipeStore.syncPublicUserRecipes(userId);
};

onMounted(async () => {
  await syncPublicUser();
});
</script>

<template>
  <div>
    <div class="bg-gray-800 py-6">
      <app-container>
        <app-profile-header
          :public-user="publicUserStore.publicUserProfile"
          :editable="false"
        ></app-profile-header>
      </app-container>
    </div>
    <app-container class="mt-4">
      <h2>
        Check out {{ publicUserStore.publicUserProfileFirstName }}'s recipes
      </h2>
      <app-gallery
        variant="recipe"
        :columns="3"
        :items="recipeStore.publicUserRecipesForGallery"
        @click="onGalleryItemClick"
      ></app-gallery>
    </app-container>
  </div>
</template>
