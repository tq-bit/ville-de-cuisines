<script setup lang="ts">
import { AppPublicUser, AppUploadPayload } from '@/@types';
import { ref } from 'vue';
import useActiveUserStore from '@/store/activeUserStore';

defineProps<{
  publicUser: AppPublicUser;
  editable: boolean;
}>();

const editAvatar = ref(false);
const onDrop = async (filePayload: AppUploadPayload) => {
  const activeUserStore = useActiveUserStore();
  await activeUserStore.handleAvatarUpload(filePayload.fileData);
  await activeUserStore.fetchActiveUserAvatar();
  editAvatar.value = false;
};

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
</script>

<template>
  <section class="grid min-h-full grid-cols-12 gap-x-8">
    <div class="col-span-12 md:col-span-3 lg:col-span-2">
      <app-file-input v-if="editAvatar && editable" class="mb-4" @drop="onDrop">
      </app-file-input>
      <app-image
        v-if="!editAvatar && editable"
        class="cursor-pointer bg-white transition-opacity hover:opacity-75"
        title="Upload a new avatar"
        size="small"
        :scale="false"
        :src="publicUser.avatar_href"
        @click="editAvatar = !editAvatar"
      ></app-image>

      <app-image
        v-if="!editable"
        size="small"
        :scale="false"
        :src="publicUser.avatar_href"
      ></app-image>
    </div>

    <div
      class="relative col-span-12 text-center md:col-span-6 md:text-left lg:col-span-7"
    >
      <h1>{{ publicUser.name }}</h1>
      <p>{{ publicUser.bio }}</p>
      <app-social-bar
        class="md:absolute md:bottom-0 md:left-0 md:right-0"
        :public-user="publicUser"
      ></app-social-bar>
    </div>

    <div
      v-if="editable"
      class="relative col-span-12 hidden md:col-span-3 md:block lg:col-span-3"
    >
      <div class="absolute bottom-0 right-0">
        <app-router-link
          class="ml-auto block"
          v-for="(link, index) in navigation"
          :to="link.to"
          :key="index"
          >{{ link.name }}</app-router-link
        >
      </div>
    </div>
  </section>
</template>

<style scoped></style>
