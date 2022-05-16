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
  <table class="w-full min-w-full break-after-avoid overflow-auto">
    <thead class="bg-green-600 text-center align-text-top font-semibold">
      <tr>
        <td v-for="day in currentWeek" :key="day.localTimeMidnightUnix">
          {{ day.dayName }}
        </td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td
          v-for="day in currentWeek"
          :key="day.localTimeMidnightUnix"
          :class="{
            'border-l border-r border-green-600 bg-gray-700': day.isToday,
          }"
        >
          <h4 class="mb-2 text-sm">Breakfast:</h4>
          <!-- TODO: Abstract this link into a separate component -->
          <router-link
            class="rounded border-blue-200 bg-blue-500 p-2 text-sm text-white"
            v-for="breakfast in getBreakfasts(day.diets)"
            :key="breakfast.$id"
            :to="`/recipe/${breakfast.recipe?.$id}`"
          >
            {{ breakfast.recipe?.name }}
            <i-close class="mb-1 inline h-4 w-4"></i-close>
          </router-link>
        </td>
      </tr>
      <tr>
        <td
          v-for="day in currentWeek"
          :key="day.localTimeMidnightUnix"
          :class="{
            'border-l border-r border-green-600 bg-gray-700': day.isToday,
          }"
        >
          <h4 class="mb-2 text-sm">Lunch:</h4>

          <router-link
            v-for="lunch in getLunches(day.diets)"
            class="border-fuchsia-200-200 rounded bg-fuchsia-500 p-2 text-sm text-white"
            :to="`/recipe/${lunch.recipe?.$id}`"
            :key="lunch.$id"
          >
            {{ lunch.recipe?.name }}
          </router-link>
        </td>
      </tr>

      <tr>
        <td
          v-for="day in currentWeek"
          :key="day.localTimeMidnightUnix"
          :class="{
            'border-l border-r border-green-600 bg-gray-700': day.isToday,
          }"
        >
          <h4 class="mb-2 text-sm">Dinner:</h4>

          <router-link
            v-for="dinner in getDinners(day.diets)"
            class="rounded border-orange-200 bg-orange-500 p-2 text-sm text-white"
            :to="`/recipe/${dinner.recipe?.$id}`"
            :key="dinner.$id"
          >
            {{ dinner.recipe?.name }}
          </router-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
td {
  @apply p-2 align-baseline;
}
</style>
