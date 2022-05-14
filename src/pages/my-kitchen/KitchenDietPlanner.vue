<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { AppDietEntity, AppGalleryItemType } from '@/@types';
import useDietStore from '@/store/dietStore';
import useDietForm from '@/use/form/dietForm';
import useRecipeStore from '@/store/recipeStore';
import useLazyRecipeSearch from '@/use/search/useLazyRecipeSearch';
import useBusy from '@/use/useBusy';

// Busy logic
const busyIndicator = useBusy('diet-planner');

// Diet logic
const dietStore = useDietStore();
const {
  $id,
  date_unix,
  diet_time,
  recipe_id,
  handleDietSubmit,
  hasFormErrors,
  httpError,
  validationErrors,
} = useDietForm();
const onSubmit = async () => {
  busyIndicator.toggleLocalStatus();
  date_unix.value = localDateUnix.value;
  await handleDietSubmit();
  busyIndicator.toggleLocalStatus();
  dietStore.syncActiveUserDiets();
};
onMounted(() => dietStore.syncActiveUserDiets());
// Local Date logic
const localDate = ref('');
const localDateUnix = computed(() => {
  const date = new Date(localDate.value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
});

// Local recipe logic
const recipeStore = useRecipeStore();
const query = ref('');
const localRecipe = ref<AppGalleryItemType | null>(null);
const { handleSearch, loading } = useLazyRecipeSearch(query);
const onClickSearchItem = (clickedItem: AppGalleryItemType) => {
  localRecipe.value = clickedItem;
  recipe_id.value = clickedItem.$id;
};

watch(query, (value) => {
  handleSearch(value);
});
</script>

<template>
  <app-container>
    <app-alert class="mb-6" v-if="hasFormErrors" variant="error">
      <ul>
        <li>{{ httpError?.message }}</li>
        <li v-for="(error, idx) in validationErrors" :key="idx">
          {{ error }}
        </li>
      </ul>
    </app-alert>
    <form @submit.prevent="onSubmit">
      <app-search
        @click-item="onClickSearchItem"
        :loading="loading"
        size="small"
        v-model="query"
        :options="recipeStore.publicRecipeSearchResultsForGallery"
        label="Search for recipes"
      ></app-search>

      <transition name="grow-top">
        <app-feed-item v-if="localRecipe" :item="localRecipe"></app-feed-item>
      </transition>

      <app-input
        v-model="localDate"
        type="date"
        label="Plan diet for"
      ></app-input>

      <app-select
        label="Select a dining time"
        v-model="diet_time"
        :options="dietStore.dietTimeOptions"
      ></app-select>
      <app-button type="submit">Submit</app-button>
    </form>
    <app-diet-week :items="dietStore.activeUserDiets"></app-diet-week>
  </app-container>
</template>
