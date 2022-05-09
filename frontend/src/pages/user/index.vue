<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue';
import { AppGalleryItemType } from '../../@types/commons';

import usePublicUserStore from '../../store/publicUserStore';
import useRecipeStore from '../../store/recipeStore';
import { useRouter } from 'vue-router';
import { computed } from '@vue/reactivity';

const publicUserStore = usePublicUserStore();
const recipeStore = useRecipeStore();
const router = useRouter();

const onGalleryItemClick = (payload: AppGalleryItemType) => {
  router.push({
    path: `/recipe/${payload.$id}`,
  });
};

const hasSocialMediaUrls = computed<boolean>(() => {
  const profile = publicUserStore._publicUserProfile;
  return (
    !!profile.facebook_url || !!profile.instagram_url || !!profile.pinterest_url
  );
});

onMounted(async () => {
  const userId = router.currentRoute.value.params.userId as string;
  await publicUserStore.syncPublicUserById(userId);
  await recipeStore.syncPublicUserRecipes(userId);
});

onUpdated(async () => {
  const userId = router.currentRoute.value.params.userId as string;
  await publicUserStore.syncPublicUserById(userId);
  await recipeStore.syncPublicUserRecipes(userId);
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
            :src="publicUserStore.publicUserProfile.avatar_href || ''"
          ></app-image>

          <h3 class="font-semibold">About me:</h3>
          <p class="mb-4">{{ publicUserStore._publicUserProfile.bio }}</p>

          <div class="mb-4" v-if="hasSocialMediaUrls">
            <h3 class="mb-2 font-semibold">Find me on other platforms:</h3>
            <a
              v-if="publicUserStore._publicUserProfile.facebook_url"
              :href="publicUserStore._publicUserProfile.facebook_url"
              target="_blank"
              class="mx-2 inline-block"
            >
              <i-facebook></i-facebook>
            </a>

            <a
              v-if="publicUserStore._publicUserProfile.instagram_url"
              :href="publicUserStore._publicUserProfile.instagram_url"
              target="_blank"
              class="mx-2 inline-block"
            >
              <i-instagram></i-instagram>
            </a>
            <a
              v-if="publicUserStore._publicUserProfile.pinterest_url"
              :href="publicUserStore._publicUserProfile.pinterest_url"
              target="_blank"
              class="mx-2 inline-block"
            >
              <i-pinterest></i-pinterest>
            </a>
          </div>

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
            :columns="3"
            :items="recipeStore.publicUserRecipesForGallery"
            @click="onGalleryItemClick"
          ></app-gallery>
        </app-card>
      </template>
    </app-grid>
  </div>
</template>
