<script setup lang="ts">
import { AppUploadPayload, AppGalleryItemType } from '../../@types';
import ingredientsFallback from '/ingredients-fallback.webp';
import recipeFallback from '/recipe-fallback.webp';
import { ref, onMounted } from 'vue';

import { useRouter } from 'vue-router';
import useSessionStore from '../../store/sessionStore';
import useActiveUserStore from '../../store/activeUserStore';
import useGlobalAlert from '../../use/globalAlert';

const editAvatar = ref(false);
const { destroyServerSession } = useSessionStore();
const activeUserStore = useActiveUserStore();
const { triggerGlobalAlert } = useGlobalAlert();
const router = useRouter();

const mockFeed: AppGalleryItemType[] = [
  {
    $id: '1',
    alt: 'New public ingredient',
    type: 'ingredient',
    title: 'New public ingredient',
    src: ingredientsFallback,
    text: 'John Doe created a new ingredient: Chicken Breast',
  },
  {
    $id: '2',
    alt: 'New public recipe',
    type: 'recipe',
    title: 'New public recipe',
    src: recipeFallback,
    text: 'Jane Doe created a new recipe: Chicken Breast',
  },
  {
    $id: '3',
    alt: 'New recipe variant',
    type: 'recipe',
    title: 'New recipe variant',
    src: recipeFallback,
    text: 'John Smith created a new recipe variant: Garlic bread with tomato sauce',
  },
];

const logout = async () => {
  await destroyServerSession();
  triggerGlobalAlert({
    message: 'You have been logged out',
    variant: 'success',
  });
  router.push({ path: '/' });
};

const openAccountModal = () => router.push({ path: '/profile/account' });
const openPreferencesModal = () =>
  router.push({ path: '/profile/preferences' });

const onDrop = async (filePayload: AppUploadPayload) => {
  await activeUserStore.handleAvatarUpload(filePayload.fileData);
  await activeUserStore.fetchActiveUserAvatar();
  editAvatar.value = false;
};

onMounted(async () => {
  await activeUserStore.syncActiveUserAccount();
  await activeUserStore.fetchActiveUserAvatar();
});
</script>

<template>
  <div class="mt-4">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>

    <app-grid variant="sidebar-left">
      <template v-slot:left>
        <app-card title="Your profile" block>
          <app-file-input v-if="editAvatar" class="mb-4" @drop="onDrop">
          </app-file-input>
          <app-image
            v-if="!editAvatar"
            @click="editAvatar = !editAvatar"
            class="mb-4 cursor-pointer bg-white transition-opacity hover:opacity-75"
            :rounded="true"
            title="Upload a new avatar"
            size="xsmall"
            :src="activeUserStore.avatar"
          ></app-image>
          <h4 class="mb-0 font-semibold">Name:</h4>
          <p class="mb-2">{{ activeUserStore.account.name }}</p>

          <h4 class="mb-0 font-semibold">Email:</h4>
          <p class="mb-2">{{ activeUserStore.account.email }}</p>

          <h4 class="mb-0 font-semibold">Location:</h4>
          <p class="mb-2">{{ activeUserStore.location.country }}</p>

          <h4 class="mb-0 font-semibold">Bio:</h4>
          <p class="mb-2">{{ activeUserStore.user.bio }}</p>

          <app-button
            size="small"
            class="mb-4 mt-4"
            @click="openAccountModal"
            block
            >Edit account settings</app-button
          >

          <app-button
            size="small"
            class="mb-4"
            @click="openPreferencesModal"
            block
            >Edit preferences</app-button
          >

          <hr class="mb-4" />
          <app-button size="small" class="mb-4" @click="logout" block
            >Log out</app-button
          >
        </app-card>
      </template>

      <template v-slot:default
        ><app-card class="mb-4" title="Feed" block>
          <app-feed :items="mockFeed"></app-feed>
        </app-card>
      </template>
    </app-grid>
  </div>
</template>
