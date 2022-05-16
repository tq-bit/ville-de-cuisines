<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { AppDietEntity, DietDayQuery } from '@/@types';
import Week from '@/classes/calender/Week';

const props = defineProps<{ items: AppDietEntity[] }>();
const emit = defineEmits<{
  (event: 'click-day', payload: DietDayQuery): void;
}>();

const week = ref(new Week({ diets: props.items }));
const dietLength = computed(() => props.items.length);
const currentWeek = computed(() => week.value.daysWithDiet);

watch(dietLength, () => {
  week.value = new Week({ diets: props.items });
});
</script>

<template>
  <div class="max-w-full overflow-x-scroll">
    <table class="whitespace-nowrap">
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
          diet-day-time="breakfast"
          @click-day="(payload) => emit('click-day', payload)"
          :current-week="currentWeek"
        ></app-diet-row>

        <app-diet-row
          diet-day-time="lunch"
          @click-day="(payload) => emit('click-day', payload)"
          :current-week="currentWeek"
        ></app-diet-row>

        <app-diet-row
          diet-day-time="dinner"
          @click-day="(payload) => emit('click-day', payload)"
          :current-week="currentWeek"
        ></app-diet-row>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
td {
  @apply p-2 align-baseline;
}
</style>
