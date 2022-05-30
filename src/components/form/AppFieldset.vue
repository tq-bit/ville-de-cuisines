<script setup lang="ts">
defineProps<{
  legend: string;
}>();
</script>

<template>
  <fieldset class="border-green-600">
    <legend class="font-semibold text-green-600 underline">
      {{ legend }}
    </legend>
    <slot />
  </fieldset>
</template>

<style scoped></style>
