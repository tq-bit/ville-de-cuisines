<script setup lang="ts">
import { ref, onMounted } from 'vue';

import usePublicUserStore from '../../store/publicUserStore';
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
    <h1>
      Browse through
      {{ publicUserStore.publicUserFeedItems.length }} users
    </h1>
    <app-feed
      size="medium"
      :items="publicUserStore.publicUserFeedItems"
      @click="onClickUserItem"
    ></app-feed>
  </app-container>
</template>
