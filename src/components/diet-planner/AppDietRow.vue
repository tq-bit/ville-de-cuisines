<script setup lang="ts">
import { DietDayTime, DayWithDiet, DietEntry, DietDayQuery } from '@/@types';
import { computed } from 'vue';

const props = defineProps<{
  dietDayTime: DietDayTime;
  currentWeek: DayWithDiet[];
}>();

const emit = defineEmits<{
  (event: 'click-day', payload: DietDayQuery): void;
  (event: 'click-delete', payload: string): void;
}>();

const getDiets = (dietEntries: DietEntry[]) => {
  return dietEntries.filter((d) => d.diet_time === props.dietDayTime);
};

const localDietTimeText = computed(() => {
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
    <td class="border-b border-gray-300 p-2 text-center dark:border-gray-700">
      <b>{{ localDietTimeText }}</b>
    </td>

    <td
      v-for="day in currentWeek"
      class="border-b border-gray-300 py-4 px-6 text-center dark:border-gray-700"
      :key="day.localTimeMidnightUnix"
    >
      <div v-if="getDiets(day.diets).length > 0">
        <span
          v-for="diet in getDiets(day.diets)"
          :key="diet.$id"
          class="rounded border-b p-2 text-sm text-gray-50"
          :class="{
            ' border-sky-600 bg-sky-400 dark:border-sky-800 dark:bg-sky-600':
              dietDayTime === 'breakfast',
            ' border-amber-600 bg-amber-400 dark:border-amber-800 dark:bg-amber-600':
              dietDayTime === 'lunch',
            ' border-rose-600 bg-rose-400 dark:border-rose-800 dark:bg-rose-600':
              dietDayTime === 'dinner',
          }"
        >
          <router-link :to="`/recipe/${diet.recipe?.$id}`">
            {{ diet.recipe?.name }}
          </router-link>
          <i-close
            @click="emit('click-delete', diet.$id)"
            class="inline cursor-pointer"
          ></i-close>
        </span>
      </div>

      <button
        class="rounded border px-4 py-1 text-sm font-semibold text-gray-50"
        :class="{
          'border-sky-400 text-sky-400 dark:border-sky-800 dark:text-sky-600':
            dietDayTime === 'breakfast',
          'border-amber-400 text-amber-400 dark:border-amber-800  dark:text-amber-600':
            dietDayTime === 'lunch',
          'border-rose-400 text-rose-400 dark:border-rose-800 dark:text-rose-600':
            dietDayTime === 'dinner',
        }"
        v-else
        @click="
          emit('click-day', { time: dietDayTime, date: day.localDateString })
        "
        :title="`Plan your ${localDietTimeText} on ${day.localDateString}`"
      >
        Add
      </button>
    </td>
  </tr>
</template>
