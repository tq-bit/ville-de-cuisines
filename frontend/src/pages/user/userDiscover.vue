<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppContainer from '../../components/layout/content/AppContainer.vue';
import AppGallery from '../../components/lists/gallery/AppGallery.vue';

import usePublicUserStore from '../../store/publicUserStore';
import useRecipeStore from '../../store/recipeStore';
import { useRouter } from 'vue-router';

const publicUserStore = usePublicUserStore();

onMounted(async () => {
  await publicUserStore.fetchPublicUsers();
});
</script>

<template>
  <app-container tag="main" class="mt-4">
    <app-gallery
      :columns="3"
      :gallery-items="publicUserStore.publicUserFeedItems"
    ></app-gallery>
  </app-container>
</template>
