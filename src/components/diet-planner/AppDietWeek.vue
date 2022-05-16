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

watch(dietLength, () => {
  week.value = new Week({ diets: props.items });
});
</script>

<template>
  <table class="w-full min-w-full break-after-avoid overflow-auto">
    <thead
      class="bg-gradient-to-bl from-green-400 to-green-500 align-text-top font-semibold text-gray-50 dark:bg-green-600 dark:from-green-600 dark:to-green-700"
    >
      <tr>
        <td v-for="day in currentWeek" :key="day.localTimeMidnightUnix">
          {{ day.dayName }}
        </td>
      </tr>
    </thead>
    <tbody>
      <app-diet-row
        :current-week="currentWeek"
        diet-day-time="breakfast"
      ></app-diet-row>

      <app-diet-row
        :current-week="currentWeek"
        diet-day-time="lunch"
      ></app-diet-row>

      <app-diet-row
        :current-week="currentWeek"
        diet-day-time="dinner"
      ></app-diet-row>
    </tbody>
  </table>
</template>

<style scoped>
td {
  @apply p-2 align-baseline;
}
</style>
