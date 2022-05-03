<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppGrid from '../../components/layout/content/AppGrid.vue';
import AppButton from '../../components/form/AppButton.vue';
import AppImage from '../../components/ui/AppImage.vue';
import AppGallery from '../../components/lists/gallery/AppGallery.vue';
import AppCard from '../../components/form/AppCard.vue';

import usePublicUserStore from '../../store/publicUserStore';
import useRecipeStore from '../../store/recipeStore';
import { useRouter } from 'vue-router';

const publicUserStore = usePublicUserStore();

onMounted(async () => {
  await publicUserStore.fetchPublicUsers();
});
</script>

<template>
  <div class="mt-4">
    <app-card
      v-for="user in publicUserStore.publicUsers"
      :title="user.name"
      :key="user.$id"
    >
    </app-card>
  </div>
</template>
