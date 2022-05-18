<script setup lang="ts">
import useDietStore from '@/store/dietStore';
import dietApi from '@/api/diet.api';
import { DietDayQuery } from '@/@types';

import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
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
    await dietStore.syncActiveUserDiets();
  }
};

onMounted(() => dietStore.syncActiveUserDiets());
</script>

<template>
  <app-container class="mt-4">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
    <h2>Your weekly diet plan</h2>
    <app-diet-week
      @click-day="onClickDay"
      @click-delete="onClickDelete"
      class="mb-4"
      :items="dietStore.activeUserDiets"
    ></app-diet-week>
  </app-container>
</template>
