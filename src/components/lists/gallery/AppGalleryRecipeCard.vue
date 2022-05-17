<script setup lang="ts">
import { ref } from 'vue';
import { AppGalleryRecipeItem } from '../../../@types/commons';

defineProps<{
  item: AppGalleryRecipeItem;
}>();
</script>

<template>
  <li class="cursor-pointer">
    <main class="relative">
      <app-image :src="item.src" rounded cover="large"></app-image>
      <section>
        <h3 class="mt-4 text-xl font-bold">{{ item.title }}</h3>

        <app-tag class="mr-2" v-if="item.total_cooking_time">
          <div class="inline-block h-4 w-4">
            <i-clock></i-clock>
          </div>
          <span class="ml-1">{{ item.total_cooking_time }} min.</span>
        </app-tag>

        <app-tag v-if="item.calories_per_portion">
          <div class="inline-block h-4 w-4">
            <i-fire></i-fire>
          </div>
          <span class="ml-1">{{ item.calories_per_portion }} kcal</span>
        </app-tag>
      </section>
    </main>
  </li>
</template>

<style scoped></style>
