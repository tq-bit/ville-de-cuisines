<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import Month from '@/classes/calender/Month';

import useDietStore from '@/store/dietStore';
import dietApi from '@/api/diet.api';
import { DietDayQuery } from '@/@types';

const router = useRouter();

const dietStore = useDietStore();
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
</script>

<template>
  <app-container class="mt-4">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
    <h2>Your weekly diet plan</h2>
    <app-diet-month
      :items="dietStore.activeUserDietsThisMonth"
    ></app-diet-month>
    <app-diet-week
      class="mb-4"
      @click-day="onClickDay"
      @click-delete="onClickDelete"
      :items="dietStore.activeUserDietsThisWeek"
    ></app-diet-week>
  </app-container>
</template>
