<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { DietEntry } from '@/@types';
import Month from '@/classes/calender/Month';

const props = defineProps<{ items: DietEntry[] }>();
const emit = defineEmits<{
  (event: 'click-week', calenderWeek: number): void;
}>();
const dietLength = computed(() => props.items.length);

const month = ref(new Month({ diets: props.items }));

watch(dietLength, () => {
  month.value = new Month({ diets: props.items });
});
</script>

<template>
  <div class="max-w-full overflow-x-auto">
    <h2>My diet plan for {{ month.name }}</h2>

    <div class="max-w-full overflow-x-auto rounded">
      <table class="min-w-full whitespace-nowrap">
        <thead class="border-b-2 border-green-800 text-center font-semibold">
          <tr>
            <td>#</td>
            <td v-for="day in month.getDayNames()" :key="day">
              {{ day }}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            class="cursor-pointer transition-colors hover:bg-gray-50 hover:dark:bg-gray-800"
            v-for="week in month.weeks"
            :key="week.calenderWeek"
            @click="emit('click-week', week.calenderWeek)"
          >
            <td
              class="border-r-green-800 bg-gray-50 text-center align-middle dark:bg-gray-800"
            >
              <b> # {{ week.calenderWeek }}</b>
            </td>
            <td
              v-for="day in week.daysWithDiet"
              class="h-24 rounded"
              :key="day.localDateString"
              :class="{
                'bg-green-600': day.isToday,
              }"
            >
              <b> {{ day.dayOfMonth }}. </b>
              <p class="mt-2">{{ day.diets.length }} / 3 diets</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--
    {{  }} -->
  </div>
</template>

<style scoped>
td {
  @apply p-2;
}
</style>
