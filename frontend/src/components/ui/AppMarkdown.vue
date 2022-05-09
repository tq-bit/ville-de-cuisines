<script setup lang="ts">
import { computed } from '@vue/reactivity';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt({ html: true });

const props = defineProps<{ text: string }>();

const parsedText = computed(() => parser.render(props.text));
</script>

<template>
  <article class="markdown" v-html="parsedText"></article>
</template>

<style>
.markdown ul {
  @apply ml-6 list-disc;
}

.markdown ol {
  @apply ml-6 list-decimal;
}

.markdown blockquote {
  @apply border-l-4 border-green-400 pl-6 dark:border-green-600;
}
</style>
