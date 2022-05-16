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
    <td
      v-for="day in currentWeek"
      class="border-b border-gray-300 p-2 text-center dark:border-gray-700"
      :key="day.localTimeMidnightUnix"
      :class="{
        'bg-gray-300 dark:bg-gray-700': day.isToday,
      }"
    >
      <!-- TODO: Abstract this link into a separate component -->
      <div v-if="getDiets(day.diets).length > 0">
        <span
          v-for="diet in getDiets(day.diets)"
          :key="diet.$id"
          class="mx-1 rounded border-b p-2 text-xs text-gray-50"
          :class="{
            'border-blue-800 bg-blue-600': dietDayTime === 'breakfast',
            'border-fuchsia-800 bg-fuchsia-600': dietDayTime === 'lunch',
            'border-red-800 bg-red-600': dietDayTime === 'dinner',
          }"
        >
          <router-link :to="`/recipe/${diet.recipe?.$id}`">
            {{ diet.recipe?.name }}
          </router-link>
          <i-close
            @click="emit('click-delete', diet.$id)"
            class="inline"
          ></i-close>
        </span>
      </div>

      <h4
        v-else
        @click="
          emit('click-day', { time: dietDayTime, date: day.localDateString })
        "
        class="mb-0 block cursor-pointer p-2 text-sm"
        :title="`Plan your ${localDietTimeText} on ${day.localDateString}`"
      >
        Add {{ localDietTimeText }}
      </h4>
    </td>
  </tr>
</template>

<style scoped></style>
