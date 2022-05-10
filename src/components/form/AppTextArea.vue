<script setup lang="ts">
withDefaults(
  defineProps<{
    hideLabel?: boolean;
    labelPrefix?: string;
    label?: string;
    placeholder?: string;
    modelValue?: any;
    error?: string;
    required?: boolean;
  }>(),
  {
    hideLabel: false,
    required: false,
  },
);

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
  (event: 'click-icon'): void;
}>();

const onInput = (ev: Event) =>
  emit('update:modelValue', (ev.target as HTMLInputElement).value);
</script>

<template>
  <label
    v-if="label && !hideLabel"
    class="mb-1 block font-semibold text-green-600"
  >
    {{ label }}
  </label>

  <textarea
    class="input mb-4"
    v-bind="$attrs"
    @input="onInput"
    :value="modelValue"
    :required="required"
    :placeholder="labelPrefix ? labelPrefix + label?.toLowerCase() : label || $attrs.placeholder as string"
  />
</template>
