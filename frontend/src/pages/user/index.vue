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
const recipeStore = useRecipeStore();
const router = useRouter();

onMounted(async () => {
  const userId = router.currentRoute.value.params.userId as string;
  await publicUserStore.fetchPublicUserById(userId);
  await publicUserStore.fetchPublicUserAvatar();
  await recipeStore.fetchPublicUserRecipes(userId);
});
</script>

<template>
  <div class="mt-4">
    <app-grid variant="sidebar-left">
      <template v-slot:left>
        <app-card :title="publicUserStore._publicUserProfile.name" block>
          <app-image
            class="mb-4"
            :rounded="true"
            size="xsmall"
            :src="publicUserStore.publicUserProfileAvatar"
          ></app-image>

          <h4 class="font-semibold">Bio:</h4>
          <p class="mb-4">{{ publicUserStore._publicUserProfile.bio }}</p>

          <app-button class="mb-4" block
            >Follow {{ publicUserStore.publicUserProfileFirstName }}</app-button
          >
        </app-card>
      </template>

      <template v-slot:default
        ><app-card
          class="mb-4"
          :title="`${publicUserStore.publicUserProfileFirstName}'s Recipes`"
          block
        >
          <app-gallery
            :gallery-items="recipeStore.publicUserRecipesForGallery"
          ></app-gallery>
        </app-card>
      </template>
    </app-grid>
  </div>
</template>
