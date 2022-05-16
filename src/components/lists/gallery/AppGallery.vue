<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { AppGalleryRecipeItem } from '../../../@types/commons';
import AppGalleryItem from './AppGalleryItem.vue';
import AppGalleryRecipeCard from './AppGalleryRecipeCard.vue';
const props = withDefaults(
  defineProps<{
    columns?: 1 | 2 | 3;
    items: AppGalleryRecipeItem[];
    variant?: 'item' | 'recipe';
  }>(),
  {
    columns: 2,
    variant: 'item',
  },
);

const emit = defineEmits<{
  (event: 'click', item: AppGalleryRecipeItem): void;
  (event: 'click-create'): void;
}>();

const activeComponent = computed(() => {
  return props.variant === 'item' ? AppGalleryItem : AppGalleryRecipeCard;
});
</script>

<template>
  <ul v-if="items.length > 0" class="grid grid-cols-12 gap-8">
    <component
      :is="activeComponent"
      @click="emit('click', item)"
      class="col-span-12 sm:col-span-12"
      :class="{
        'md:col-span-12 lg:col-span-12': columns === 1,
        'md:col-span-6 lg:col-span-6': columns === 2,
        'md:col-span-4 lg:col-span-4': columns === 3,
      }"
      v-for="item in items"
      :key="item.title"
      :item="item"
    ></component>
  </ul>
  <div v-else class="text-center">
    <h2 class="mb-4 text-xl font-semibold">
      <svg-loader></svg-loader>
    </h2>
  </div>
</template>

<style scoped></style>
