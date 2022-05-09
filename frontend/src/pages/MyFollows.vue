<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AppGalleryItemType } from '../@types';
import useFollowsStore from '../store/followsStore';

const router = useRouter();

const followsStore = useFollowsStore();
const onClickUserItem = (item: AppGalleryItemType) => {
  router.push({ path: `/user/${item.$id}` });
};
const followingUsers = computed(
  () => followsStore.activeUserFollowsUserEntitiesFeedItems?.length,
);

onMounted(async () => await followsStore.syncActiveUserFollows());
</script>

<template>
  <app-container tag="main" class="mt-4">
    <div v-if="followingUsers > 1">
      <h1>
        You're following
        {{ followingUsers }} user{{ followingUsers > 1 ? 's' : '' }}
      </h1>
      <app-feed
        @click="onClickUserItem"
        size="large"
        :items="followsStore.activeUserFollowsUserEntitiesFeedItems"
      ></app-feed>
    </div>
    <div v-else>
      <h1>You're not following anybody yet.</h1>
    </div>
  </app-container>
</template>

<style scoped></style>
