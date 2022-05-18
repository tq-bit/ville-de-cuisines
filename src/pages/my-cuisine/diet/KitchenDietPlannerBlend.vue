<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AppGalleryItemType } from '@/@types';
import useDietStore from '@/store/dietStore';
import useDietForm from '@/use/form/dietForm';
import useRecipeStore from '@/store/recipeStore';
import useLazyRecipeSearch from '@/use/search/useLazyRecipeSearch';
import useBusy from '@/use/useBusy';
import recipesApi from '@/api/recipes.api';

// Busy logic
const busyIndicator = useBusy('diet-planner');

// Router logic
const router = useRouter();

// Diet logic
const dietStore = useDietStore();
const {
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
  if (!hasFormErrors.value && !httpError.value) {
    dietStore.syncActiveUserDietsThisWeek();
    router.go(-1);
  }
  busyIndicator.toggleLocalStatus();
};
onMounted(() => dietStore.syncActiveUserDietsThisWeek());

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

onMounted(() => {
  const { query: routerQuery } = router.currentRoute.value;
  diet_time.value = routerQuery.time as string;
  localDate.value = routerQuery.date as string;
  query.value = routerQuery.name as string;
});
</script>

<template>
  <app-screen-modal @keydown.esc="router.go(-1)" @click-blend="router.go(-1)">
    <app-card
      block
      :closable="true"
      @close="router.go(-1)"
      title="Create a diet entry"
    >
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
          focus
          label="Search for recipes"
          size="small"
          v-model="query"
          @click-item="onClickSearchItem"
          :hide-text="true"
          :loading="loading"
          :options="recipeStore.publicRecipeSearchResultsForGallery"
        ></app-search>

        <transition name="grow-top">
          <app-feed-item v-if="localRecipe" :item="localRecipe"></app-feed-item>
        </transition>

        <app-input
          v-model="localDate"
          type="date"
          label="Enter a date"
        ></app-input>

        <app-select
          label="Choose a dining time"
          v-model="diet_time"
          :options="dietStore.dietDayTimeOptions"
        ></app-select>

        <app-button block type="submit">Add {{ diet_time }} </app-button>
        <app-button
          block
          class="mt-2"
          variant="warning"
          type="button"
          @click="router.go(-1)"
          >Cancel
        </app-button>
      </form>
    </app-card>
  </app-screen-modal>
</template>
