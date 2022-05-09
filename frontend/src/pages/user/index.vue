<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue';
import { AppGalleryItemType, AppFollowEntityPayload } from '../../@types';

import usePublicUserStore from '../../store/publicUserStore';
import useRecipeStore from '../../store/recipeStore';
import useFollowsStore from '../../store/followsStore';
import { useRouter } from 'vue-router';
import { computed } from '@vue/reactivity';

const publicUserStore = usePublicUserStore();
const recipeStore = useRecipeStore();
const followsStore = useFollowsStore();
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

const activeUserIsFollowingThisUser = computed<boolean>(() => {
  return followsStore.activeUserFollows?.some((user) => {
    return user.entity_id === publicUserStore._publicUserProfile.$id;
  });
});

const onClickFollowButton = async () => {
  const payload: AppFollowEntityPayload = {
    entity_id: publicUserStore._publicUserProfile.$id,
    entity_type: 'user',
  };
  if (activeUserIsFollowingThisUser.value) {
    const [response, error] = await followsStore.deleteFollow(
      payload.entity_id,
    );
    if (error) {
      console.error(error);
    }
  } else {
    const [response, error] = await followsStore.createFollow(payload);
    if (error) {
      console.error(error);
    }
  }

  await syncPublicUser();
};

const syncPublicUser = async () => {
  const userId = router.currentRoute.value.params.userId as string;
  await publicUserStore.syncPublicUserById(userId);
  await followsStore.syncActiveUserFollows();
  await recipeStore.syncPublicUserRecipes(userId);
};

onMounted(async () => {
  await syncPublicUser();
});

onUpdated(async () => {
  await syncPublicUser();
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

          <app-button class="mb-4" block @click="onClickFollowButton">
            {{ activeUserIsFollowingThisUser ? 'Unfollow' : 'Follow' }}
            {{ publicUserStore.publicUserProfileFirstName }}</app-button
          >
        </app-card>
      </template>

      <template v-slot:default>
        <h1 class="mb-4 text-3xl">
          {{ publicUserStore.publicUserProfileFirstName }}'s Recipes
        </h1>

        <app-gallery
          :columns="3"
          :items="recipeStore.publicUserRecipesForGallery"
          @click="onGalleryItemClick"
        ></app-gallery>
      </template>
    </app-grid>
  </div>
</template>
