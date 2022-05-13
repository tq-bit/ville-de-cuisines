<script setup lang="ts">
import { ref, computed } from 'vue';
import { AppDietEntity } from '@/@types';
import useDietStore from '@/store/dietStore';
import useDietForm from '@/use/form/dietForm';

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

// Local Date logic
const localDate = ref('');
const localDateUnix = computed(() => {
  const date = new Date(localDate.value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
});

// Local recipe logic

const onSubmit = () => {
  date_unix.value = localDateUnix.value;
  console.log(date_unix);
};
</script>

<template>
  <app-container>
    <form @submit.prevent="onSubmit">
      {{ diet_time }}
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
    <app-diet-calender :items="[]"></app-diet-calender>
  </app-container>
</template>

<style scoped></style>
