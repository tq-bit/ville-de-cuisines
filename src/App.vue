<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

import useSessionStore from './store/sessionStore';
import useGlobalAlert from './use/globalAlert';
import useActiveUserStore from './store/activeUserStore';
import useAppTheme from './use/appTheme';

const { message, showGlobalAlert, variant } = useGlobalAlert();
const sessionStore = useSessionStore();
const { syncActiveUserAccount } = useActiveUserStore();
const { userTheme, setTheme } = useAppTheme();

const showSidebar = ref<boolean>(false);

const onToggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

onMounted(async () => {
  setTheme(userTheme.value);
  sessionStore.syncLocalSessionIdWithCookie();
  await syncActiveUserAccount();
});

watch(userTheme, (newTheme) => setTheme(newTheme));
</script>

<template>
  <main>
    <Transition name="fade-from-bottom">
      <app-alert
        v-if="showGlobalAlert && message"
        :variant="variant"
        class="fixed bottom-12 right-4 left-4 z-50 mx-auto block w-64 max-w-xs text-center"
      >
        {{ message }}
      </app-alert>
    </Transition>
    <app-navbar
      :is-user-logged-in="sessionStore.isUserLoggedIn"
      @toggle-sidebar="onToggleSidebar"
    ></app-navbar>

    <app-sidebar @click-navbar-item="onToggleSidebar" :show="showSidebar"> </app-sidebar>
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>
