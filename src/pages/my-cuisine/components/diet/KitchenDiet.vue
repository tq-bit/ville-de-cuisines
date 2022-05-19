<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import { ONE_WEEK } from '@/constants/calender';

import useDietStore from '@/store/dietStore';
import dietApi from '@/api/diet.api';
import { DietDayQuery } from '@/@types';
import Week from '@/classes/calender/Week';

const router = useRouter();

const dietStore = useDietStore();
const dietLength = computed(() => dietStore.activeUserDietsThisWeek.length);
const onClickDay = (payload: DietDayQuery) => {
  router.push({
    path: '/my-cuisine/diet/create',
    query: {
      date: payload.date,
      time: payload.time,
    },
  });
};

const onClickDelete = async (id: string) => {
  const deletionConfirmed = window.confirm(
    'Are you sure you want to delete this entry?',
  );
  if (deletionConfirmed) {
    await dietApi.deleteDiet(id);
    await dietStore.syncActiveUserDietsThisWeek();
  }
};

onMounted(async () => {
  await Promise.all([
    dietStore.syncActiveUserDietsThisWeek(),
    dietStore.syncActiveUserDietsThisMonth(),
  ]);
});

// Calender week logic
const week = ref(new Week({ diets: dietStore.activeUserDietsThisWeek }));
const weekTimestamp = computed(() => week.value.getFirstDay().getMidnight());

const setWeek = (payload: Week) => (week.value = payload);
const incremenetWeek = () => {
  const nextWeek = new Week({
    diets: dietStore.activeUserDietsThisWeek,
    timestamp: weekTimestamp.value + ONE_WEEK,
  });
  setWeek(nextWeek);
};
const decrementWeek = () => {
  const nextWeek = new Week({
    diets: dietStore.activeUserDietsThisWeek,
    timestamp: weekTimestamp.value - ONE_WEEK,
  });
  setWeek(nextWeek);
};
const setToCurrentWeek = () => {
  const currentWeek = new Week({
    diets: dietStore.activeUserDietsThisWeek,
    timestamp: new Week().getFirstDay().getMidnight(),
  });
  setWeek(currentWeek);
};
watch(dietLength, () => {
  week.value = new Week({
    diets: dietStore.activeUserDietsThisWeek,
    timestamp: weekTimestamp.value,
  });
});
</script>

<template>
  <app-container class="mt-4">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>

    <app-diet-week
      class="mb-4"
      @click-day="onClickDay"
      @click-delete="onClickDelete"
      @click-current-week="setToCurrentWeek"
      @click-increment="incremenetWeek"
      @click-decrement="decrementWeek"
      :week="(week as Week)"
    ></app-diet-week>

    <app-diet-month
      @click-week="setWeek"
      :items="dietStore.activeUserDietsThisMonth"
    ></app-diet-month>
  </app-container>
</template>
