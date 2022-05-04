<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Recipe } from '../../@types/commons';
import AppContainer from '../../components/layout/content/AppContainer.vue';
import AppGrid from '../../components/layout/content/AppGrid.vue';
import AppImage from '../../components/ui/AppImage.vue';
import useRecipeStore from '../../store/recipeStore';
import useActiveUserStore from '../../store/activeUserStore';

// Router logic
const router = useRouter();
const recipeId = router.currentRoute.value.params.recipeId as string;

// User logic
const activeUserStore = useActiveUserStore();
const activeUserIsSubmitter = computed(() => {
  return activeUserStore.user.$id === localRecipe.value?.user_id;
});
const submittedBy = computed(() => {
  return activeUserIsSubmitter.value ? 'you' : localRecipe.value?.username;
});

// Recipe Logic
const recipeStore = useRecipeStore();
const localRecipe = ref<Recipe>();
const setLocalRecipe = async () => {
  const [response, error] = await recipeStore.fetchRecipeById(recipeId);
  if (error) {
    console.error(error);
  }
  localRecipe.value = response as Recipe;
};
onMounted(async () => await setLocalRecipe());
</script>

<template>
  <app-container>
    <app-grid class="mt-4" variant="sidebar-left">
      <template v-slot:left>
        <app-image
          cover="medium"
          :src="(localRecipe?.primary_image_href as string)"
        ></app-image>
      </template>

      <template v-slot:default>
        <h1 class="mb-4 text-3xl">{{ localRecipe?.name }}</h1>
        <p>
          Submitted by
          <router-link
            class="font-semibold"
            :to="`/user/${localRecipe?.user_id}`"
            >{{ submittedBy }}</router-link
          >
        </p>
      </template>
    </app-grid>
    <p>local recipe {{ localRecipe?.user_id }}</p>
    <p>active user {{ activeUserStore.user }}</p>
  </app-container>
</template>

<style scoped></style>
