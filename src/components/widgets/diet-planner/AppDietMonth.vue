<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { DietEntry } from '@/@types';
import Month from '@/classes/calender/Month';

const props = defineProps<{ items: DietEntry[] }>();
const dietLength = computed(() => props.items.length);

const month = ref(new Month({ diets: props.items }));
watch(dietLength, () => {
  month.value = new Month({ diets: props.items });
});
</script>

<template>
  <div class="max-w-full overflow-x-auto rounded">
    <h1>Months</h1>
  </div>
</template>

<style scoped>
td {
  @apply p-2 align-baseline;
}
</style>
