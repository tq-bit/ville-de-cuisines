<script setup lang="ts">
import { AppUploadPayload } from '../../@types/commons';
import { ref, onMounted } from 'vue';
import AppGrid from '../../components/layout/content/AppGrid.vue';
import AppButton from '../../components/form/AppButton.vue';
import AppImage from '../../components/ui/AppImage.vue';
import AppFileInput from '../../components/form/AppFileInput.vue';
import AppCard from '../../components/form/AppCard.vue';

import { useRouter } from 'vue-router';
import useSessionStore from '../../store/sessionStore';
import useActiveUserStore from '../../store/activeUserStore';
import useGlobalAlert from '../../use/globalAlert';

const editAvatar = ref(false);
const { destroyServerSession } = useSessionStore();
const activeUserStore = useActiveUserStore();
const { triggerGlobalAlert } = useGlobalAlert();
const router = useRouter();

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
  await activeUserStore.fetchActiveUserAccount();
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
          <h4 class="font-semibold">Name:</h4>
          <p class="mb-2">{{ activeUserStore.user.name }}</p>

          <h4 class="font-semibold">Email:</h4>
          <p class="mb-2">{{ activeUserStore.user.email }}</p>

          <h4 class="font-semibold">Location:</h4>
          <p class="mb-2">{{ activeUserStore.location.country }}</p>

          <h4 class="font-semibold">Bio:</h4>
          <p class="mb-2">{{ activeUserStore.prefs.bio }}</p>

          <app-button class="mb-4 mt-4" @click="openAccountModal" block
            >Edit account settings</app-button
          >

          <app-button class="mb-4" @click="openPreferencesModal" block
            >Edit preferences</app-button
          >

          <hr class="mb-4" />
          <app-button class="mb-4" @click="logout" block>Log out</app-button>
        </app-card>
      </template>

      <template v-slot:default
        ><app-card class="mb-4" title="Feed" block> </app-card>

        <app-card class="mb-4" title="First item" block>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit
          consequatur culpa tempore vero perspiciatis omnis quod quam ullam
          quibusdam alias dolor illum consequuntur laboriosam, cum
          necessitatibus, nulla rem officia impedit!
        </app-card>

        <app-card class="mb-4" title="Second item" block>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit
          consequatur culpa tempore vero perspiciatis omnis quod quam ullam
          quibusdam alias dolor illum consequuntur laboriosam, cum
          necessitatibus, nulla rem officia impedit!
        </app-card>
      </template>
    </app-grid>
  </div>
</template>
