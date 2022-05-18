<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { DietEntry, DietDayQuery, DietDayTime } from '@/@types';
import { ONE_WEEK } from '@/constants/calender';
import Week from '@/classes/calender/Week';

const props = defineProps<{ items: DietEntry[] }>();
const emit = defineEmits<{
  (event: 'click-day', payload: DietDayQuery): void;
  (event: 'click-delete', payload: string): void;
}>();

const dietDayTimes: DietDayTime[] = ['breakfast', 'lunch', 'dinner'];

const week = ref(new Week({ diets: props.items }));
const weekTimestamp = ref(week.value.getFirstDay().getMidnight());

const dietLength = computed(() => props.items.length);
const currentWeekDays = computed(() => week.value.daysWithDiet);

const incremenetWeek = () => (weekTimestamp.value += ONE_WEEK);
const decrementWeek = () => (weekTimestamp.value -= ONE_WEEK);
const setToCurrentWeek = () =>
  (weekTimestamp.value = new Week().getFirstDay().getMidnight());

watch(dietLength, () => {
  week.value = new Week({ diets: props.items, timestamp: weekTimestamp.value });
});
watch(weekTimestamp, () => {
  week.value = new Week({ diets: props.items, timestamp: weekTimestamp.value });
});
</script>

<template>
  <div>
    <h2>My diet plan for week #{{ week.calenderWeek }}</h2>
    <div class="mb-2 flex w-full justify-between">
      <app-button size="small" @click="decrementWeek">Previous week</app-button>
      <app-button variant="link" size="small" @click="setToCurrentWeek"
        >This week</app-button
      >
      <app-button size="small" @click="incremenetWeek">Next week</app-button>
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
