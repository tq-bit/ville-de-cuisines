<script setup lang="ts">
defineProps<{
  options: any[];
  hideLabel?: boolean;
  labelPrefix?: string;
  label?: string;
  placeholder?: string;
  modelValue?: string | number;
  error?: string;
  required?: boolean;
  requiredSign?: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
}>();

const onChange = (ev: Event) => {
  emit('update:modelValue', (ev.target as HTMLInputElement).value);
};
</script>

<template>
  <label
    v-if="label && !hideLabel"
    class="mb-1 block font-semibold text-green-600"
  >
    {{ label }}
  </label>
  <select
    class="input h-12"
    v-bind="{
      ...$attrs,
      onChange,
    }"
    :placeholder="labelPrefix ? labelPrefix + label?.toLowerCase() : label"
    :aria-label="label"
    :aria-required="required"
  >
    <option disabled aria-disabled>
      {{ labelPrefix ? labelPrefix + label?.toLowerCase() : label }}
    </option>
    <option
      v-for="option in options"
      :value="option.key ? option.key : option"
      :key="option.key ? option.key : option"
      :selected="option.key ? option.key === modelValue : option === modelValue"
      :aria-selected="
        option.text ? option.text : option.value ? option.value : option
      "
      :disabled="option.disabled"
      :aria-disabled="option.disabled"
    >
      {{ option.text ? option.text : option.value ? option.value : option }}
    </option>
  </select>
</template>

<style scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
}
</style>
