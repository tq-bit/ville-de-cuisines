<script lang="ts" setup>
import { AlertVariant } from '../../@types/commons';

export interface AlertProps {
  variant: AlertVariant;
}
withDefaults(defineProps<AlertProps>(), {
  variant: 'info',
});
</script>

<template>
  <div
    class="w-full rounded border p-2 text-gray-100"
    :class="{
      'border-blue-300 bg-blue-500': variant === 'info',
      'border-amber-300 bg-amber-500': variant === 'error',
      'border-green-300 bg-green-500': variant === 'success',
    }"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped></style>
