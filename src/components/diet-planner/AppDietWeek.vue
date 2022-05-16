<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { DietEntry, DietDayQuery, DietDayTime } from '@/@types';
import Week from '@/classes/calender/Week';

const props = defineProps<{ items: DietEntry[] }>();
const emit = defineEmits<{
  (event: 'click-day', payload: DietDayQuery): void;
  (event: 'click-delete', payload: string): void;
}>();

const dietDayTimes: DietDayTime[] = ['breakfast', 'lunch', 'dinner'];
const week = ref(new Week({ diets: props.items }));
const dietLength = computed(() => props.items.length);
const currentWeek = computed(() => week.value.daysWithDiet);

watch(dietLength, () => {
  week.value = new Week({ diets: props.items });
});
</script>

<template>
  <div class="max-w-full overflow-x-auto rounded">
    <table class="min-w-full whitespace-nowrap">
      <thead
        class="bg-gradient-to-b from-green-400 to-green-600 text-center align-text-top font-semibold text-gray-50 dark:from-green-500 dark:to-green-800"
      >
        <tr>
          <td>Day time</td>
          <td v-for="day in currentWeek" :key="day.localTimeMidnightUnix">
            {{ day.dayName }} <span v-if="day.isToday">(today)</span>
          </td>
        </tr>
      </thead>
      <tbody>
        <app-diet-row
          v-for="dietDayTime in dietDayTimes"
          :key="dietDayTime"
          :diet-day-time="dietDayTime"
          :currentWeek="currentWeek"
          @click-day="(payload) => emit('click-day', payload)"
          @click-delete="(id) => emit('click-delete', id)"
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
