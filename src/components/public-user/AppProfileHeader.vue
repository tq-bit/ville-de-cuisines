<script setup lang="ts">
import {
  AppPublicUser,
  AppUploadPayload,
  AppFollowEntityPayload,
} from '@/@types';
import { ref, computed, onMounted } from 'vue';

import useActiveUserStore from '@/store/activeUserStore';
import usePublicUserStore from '@/store/publicUserStore';
import useFollowsStore from '@/store/followsStore';

import useGlobalAlert from '@/use/globalAlert';
import followsApi from '@/api/follows.api';

const { triggerGlobalAlert } = useGlobalAlert();

const props = defineProps<{
  publicUser: AppPublicUser;
  editable: boolean;
}>();

const navigation = [
  {
    to: '/my-cuisine/account',
    name: 'Manage account',
  },
  {
    to: '/my-cuisine/preferences',
    name: 'Manage preferences',
  },
];

// Public user display & update logic
const activeUserStore = useActiveUserStore();
const publicUserStore = usePublicUserStore();

const editAvatar = ref(false);
const onDrop = async (filePayload: AppUploadPayload) => {
  await activeUserStore.handleAvatarUpload(filePayload.fileData);
  await activeUserStore.fetchActiveUserAvatar();
  editAvatar.value = false;
};

// Social section logic
const followsStore = useFollowsStore();
const activeUserIsFollowingThisUser = computed<boolean>(() => {
  return followsStore.activeUserFollows?.some((user) => {
    return user.entity_id === props.publicUser.$id;
  });
});
const onClickFollowButton = async () => {
  const payload: AppFollowEntityPayload = {
    entity_id: publicUserStore._publicUserProfile.$id,
    entity_type: 'user',
    followed_by: activeUserStore.account.$id,
  };

  async function handleEntityDeletion() {
    const [response, error] = await followsApi.deleteFollowEntity(
      payload.entity_id,
    );
    if (error) {
      console.error(error);
    } else {
      triggerGlobalAlert({
        message: `You stopped following ${publicUserStore.publicUserProfile.name}`,
        variant: 'info',
      });
    }
  }
  async function handleEntityCreation() {
    const [response, error] = await followsApi.createFollowEntity(payload);
    if (error) {
      console.error(error);
    } else {
      triggerGlobalAlert({
        message: `You're now following ${publicUserStore.publicUserProfile.name}`,
        variant: 'success',
      });
    }
  }

  if (activeUserIsFollowingThisUser.value) {
    await handleEntityDeletion();
  } else {
    await handleEntityCreation();
  }
  await followsStore.syncActiveUserFollows();
};
onMounted(async () => {
  await followsStore.syncActiveUserFollows();
});
</script>

<template>
  <section class="grid min-h-full grid-cols-12 gap-x-4">
    <!-- Display section -->
    <div class="col-span-12 md:col-span-3 lg:col-span-2">
      <app-file-input v-if="editAvatar && editable" @drop="onDrop">
      </app-file-input>
      <app-image
        v-if="!editAvatar && editable"
        class="cursor-pointer bg-white transition-opacity hover:opacity-75"
        title="Upload a new avatar"
        size="small"
        :src="publicUser.avatar_href"
        @click="editAvatar = !editAvatar"
      ></app-image>

      <app-image
        v-if="!editable"
        size="small"
        :src="publicUser.avatar_href"
      ></app-image>
    </div>

    <!-- Social section -->
    <div
      class="relative col-span-12 text-center md:col-span-6 md:text-left lg:col-span-7"
    >
      <h1>{{ publicUser.name }}</h1>
      <p>{{ publicUser.bio }}</p>
      <app-social-bar :public-user="publicUser"></app-social-bar>

      <app-button
        block
        v-if="!editable"
        class="mt-4 md:hidden"
        @click="onClickFollowButton"
      >
        {{ activeUserIsFollowingThisUser ? 'Unfollow' : 'Follow' }}</app-button
      >
    </div>

    <!-- Follow or account section -->
    <div
      class="relative col-span-12 hidden md:col-span-3 md:block lg:col-span-3"
    >
      <div class="absolute bottom-0 right-0">
        <div v-if="editable">
          <app-router-link
            class="ml-auto block"
            v-for="(link, index) in navigation"
            :to="link.to"
            :key="index"
            >{{ link.name }}</app-router-link
          >
        </div>
        <app-button
          block
          v-else
          class="mx-auto mt-4 hidden md:block"
          @click="onClickFollowButton"
        >
          {{
            activeUserIsFollowingThisUser ? 'Unfollow' : 'Follow'
          }}</app-button
        >
      </div>
    </div>
  </section>
</template>

<style scoped></style>
