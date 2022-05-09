<script setup lang="ts">
import { computed } from '@vue/reactivity';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt({ html: true });

const props = defineProps<{ text: string }>();

const parsedText = computed(() => parser.render(props.text));
</script>

<template>
  <div v-html="parsedText"></div>
</template>

<style scoped></style>
