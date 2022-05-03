<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppContainer from '../../components/layout/content/AppContainer.vue';
import AppFeedList from '../../components/lists/feed/AppFeedList.vue';

import usePublicUserStore from '../../store/publicUserStore';
import useRecipeStore from '../../store/recipeStore';
import { useRouter } from 'vue-router';

const publicUserStore = usePublicUserStore();

onMounted(async () => {
  await publicUserStore.fetchPublicUsers();
});
</script>

<template>
  <app-container tag="main">
    <app-feed-list :items="publicUserStore.publicUserFeedItems"></app-feed-list>
  </app-container>
</template>
