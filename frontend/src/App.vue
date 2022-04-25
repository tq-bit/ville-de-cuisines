<script setup lang="ts">
import { onMounted, watch } from 'vue';
import AppNavigation from './components/layout/navbar/index.vue';
import AppAlert from './components/ui/AppAlert.vue';

import useSessionStore from './store/sessionStore';
import useIngredientStore from './store/ingredientsStore';
import useGlobalAlert from './use/globalAlert';
import useAppTheme from './use/appTheme';

const { message, showGlobalAlert, variant } = useGlobalAlert();
const { fetchIngredients } = useIngredientStore();
const { syncLocalSessionIdWithCookie } = useSessionStore();
const { userTheme, setTheme } = useAppTheme();

onMounted(async () => {
  setTheme(userTheme.value);
  syncLocalSessionIdWithCookie();
  await fetchIngredients();
});

watch(userTheme, (newTheme) => setTheme(newTheme));
</script>

<template>
  <main>
    <Transition name="fade-from-bottom">
      <app-alert
        v-if="showGlobalAlert && message"
        :variant="variant"
        class="absolute z-50 bottom-12 right-4 left-4 w-64 max-w-xs text-center block mx-auto"
      >
        {{ message }}
      </app-alert>
    </Transition>
    <app-navigation></app-navigation>
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>
