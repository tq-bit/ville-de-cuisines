<template>
	<label v-if="label && !hideLabel" class="font-semibold block mb-1 text-green-600">
		{{ label }}
	</label>
	<select
		class="outline-none rounded-full text-gray-900 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 px-6 py-3 w-full transition-all border-2 border-green-600 focus:bg-white focus:dark:bg-gray-200 focus:dark:text-gray-800"
		v-bind="{
			...$attrs,
			onChange,
		}"
		:placeholder="labelPrefix ? labelPrefix + label.toLowerCase() : label"
		:aria-label="label"
		:aria-required="required"
	>
		<option selected disabled aria-disabled>
			{{ labelPrefix ? labelPrefix + label.toLowerCase() : label }}
		</option>
		<option
			v-for="option in options"
			:value="option.value ? option.value : option"
			:key="option.key ? option.key : option"
			:selected="option === modelValue"
			:aria-selected="option.text ? option.text : option.value ? option.value : option"
			:disabled="option.disabled"
			:aria-disabled="option.disabled"
		>
			{{ option.text ? option.text : option.value ? option.value : option }}
		</option>
	</select>
</template>

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

const emit = defineEmits<{ (event: 'update:modelValue', payload: string): void }>();

const onChange = (ev: Event) => emit('update:modelValue', (ev.target as HTMLInputElement).value);
</script>
