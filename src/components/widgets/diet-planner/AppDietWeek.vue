<script setup lang="ts">
import { ref, Ref, computed, watch } from 'vue';
import { DietEntry, DietDayQuery, DietDayTime } from '@/@types';
import Week from '@/classes/calender/Week';

const props = defineProps<{ week: Week }>();
const emit = defineEmits<{
  (event: 'click-day', payload: DietDayQuery): void;
  (event: 'click-delete', payload: string): void;
  (event: 'click-increment'): void;
  (event: 'click-decrement'): void;
  (event: 'click-current-week'): void;
}>();

const dietDayTimes: DietDayTime[] = ['breakfast', 'lunch', 'dinner'];

const currentWeekDays = computed(() => props.week.daysWithDiet);
</script>

<template>
  <div>
    <h2>My diet plan for week #{{ week.calenderWeek }}</h2>
    <div class="mb-2 flex w-full justify-between">
      <app-button size="small" @click="emit('click-decrement')"
        >Previous week</app-button
      >
      <app-button
        variant="link"
        size="small"
        @click="emit('click-current-week')"
        >This week</app-button
      >
      <app-button size="small" @click="emit('click-increment')"
        >Next week</app-button
      >
    </div>
    <div class="max-w-full overflow-x-auto rounded">
      <table class="min-w-full whitespace-nowrap">
        <thead class="border-b-2 border-green-800 text-center font-semibold">
          <tr>
            <td>Day time</td>
            <td v-for="day in currentWeekDays" :key="day.localTimeMidnightUnix">
              {{ day.dayName }} <span v-if="day.isToday">(today)</span>
            </td>
          </tr>
        </thead>
        <tbody>
          <app-diet-row
            v-for="dietDayTime in dietDayTimes"
            :key="dietDayTime"
            :diet-day-time="dietDayTime"
            :currentWeek="currentWeekDays"
            @click-day="(payload) => emit('click-day', payload)"
            @click-delete="(id) => emit('click-delete', id)"
          ></app-diet-row>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
td {
  @apply p-2 align-baseline;
}
</style>
