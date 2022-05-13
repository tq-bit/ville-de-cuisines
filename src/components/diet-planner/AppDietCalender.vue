<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { AppDietEntity } from '@/@types';
import Week from '@/classes/calender/Week';

const props = defineProps<{
  items: AppDietEntity[];
}>();

const week = ref(new Week({ diets: props.items }));
const dietLength = computed(() => props.items.length);
const currentWeek = computed(() => week.value.daysWithDiet);

const getBreakfasts = (dietEntries: AppDietEntity[]) => {
  return dietEntries.filter((d) => d.diet_time === 'breakfast');
};

const getLunches = (dietEntries: AppDietEntity[]) => {
  return dietEntries.filter((d) => d.diet_time === 'lunch');
};

const getDinners = (dietEntries: AppDietEntity[]) => {
  return dietEntries.filter((d) => d.diet_time === 'dinner');
};

watch(dietLength, () => {
  week.value = new Week({ diets: props.items });
});
</script>

<template>
  <table class="w-full overflow-auto">
    <thead class="bg-green-500 text-center font-semibold">
      <tr>
        <td v-for="day in currentWeek" :key="day.localTimeMidnightUnix">
          {{ day.dayName }}
        </td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td v-for="day in currentWeek" :key="day.localTimeMidnightUnix">
          Breakfast:
          <span
            v-for="breakfast in getBreakfasts(day.diets)"
            :key="breakfast.$id"
          >
            {{ breakfast.recipe?.name }}
          </span>
        </td>
      </tr>
      <tr>
        <td v-for="day in currentWeek" :key="day.localTimeMidnightUnix">
          Lunch:

          <span v-for="lunch in getLunches(day.diets)" :key="lunch.$id">
            {{ lunch.recipe?.name }}
          </span>
        </td>
      </tr>

      <tr>
        <td v-for="day in currentWeek" :key="day.localTimeMidnightUnix">
          Lunch:

          <span v-for="dinner in getDinners(day.diets)" :key="dinner.$id">
            {{ dinner.recipe?.name }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
td {
  @apply p-2;
}
</style>
