<script setup lang="ts">
import { DietDayTime, DayWithDiet, AppDietEntity } from '@/@types';
import { computed } from 'vue';

const props = defineProps<{
  dietDayTime: DietDayTime;
  currentWeek: DayWithDiet[];
}>();

const getDiets = (dietEntries: AppDietEntity[]) => {
  return dietEntries.filter((d) => d.diet_time === props.dietDayTime);
};

const dietTime = computed(() => {
  return props.dietDayTime === 'breakfast'
    ? 'Breakfast'
    : props.dietDayTime === 'lunch'
    ? 'Lunch'
    : props.dietDayTime === 'dinner'
    ? 'Dinner'
    : 'Snacks';
});
</script>

<template>
  <tr>
    <td
      v-for="day in currentWeek"
      class="border-b border-gray-300 p-2 align-top dark:border-gray-700"
      :key="day.localTimeMidnightUnix"
      :class="{
        'bg-green-300 dark:bg-gray-700': day.isToday,
      }"
    >
      <!-- TODO: Abstract this link into a separate component -->
      <div v-if="getDiets(day.diets).length > 0">
        <router-link
          class="rounded border-b p-2 text-xs"
          :class="{
            'border-blue-800 bg-blue-600': dietDayTime === 'breakfast',
            'border-fuchsia-800 bg-fuchsia-600': dietDayTime === 'lunch',
            'border-red-800 bg-red-600': dietDayTime === 'lunch',
          }"
          v-for="diet in getDiets(day.diets)"
          :key="diet.$id"
          :to="`/recipe/${diet.recipe?.$id}`"
        >
          {{ diet.recipe?.name }}
          <i-close class="mb-1 inline h-4 w-4"></i-close>
        </router-link>
      </div>

      <h4 v-else class="mb-2 text-sm">{{ dietTime }}</h4>
    </td>
  </tr>
</template>

<style scoped></style>
