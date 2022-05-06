<script setup lang="ts">
import { ref, onMounted } from 'vue';

import usePublicUserStore from '../../store/publicUserStore';
import useRecipeStore from '../../store/recipeStore';
import { useRouter } from 'vue-router';
import { AppGalleryItemType } from '../../@types/commons';

const publicUserStore = usePublicUserStore();
const router = useRouter();

const onClickUserItem = (payload: AppGalleryItemType) => {
  router.push({ path: `/user/${payload.$id}` });
};

onMounted(async () => {
  await publicUserStore.syncPublicUsers();
});
</script>

<template>
  <app-container tag="main" class="mt-4">
    <h1 class="mb-4 text-3xl">
      Browse through
      {{ publicUserStore.publicUserFeedItems.length }} users
    </h1>
    <app-feed
      size="small"
      @click="onClickUserItem"
      :items="publicUserStore.publicUserFeedItems"
    ></app-feed>
  </app-container>
</template>
