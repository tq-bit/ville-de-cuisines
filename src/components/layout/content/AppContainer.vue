<script setup lang="ts">
import { h, ref, Component } from 'vue';

interface AppContainerProps {
  tag?: keyof HTMLElementTagNameMap;
  flex?: boolean;
  page?: boolean;
  center?: boolean;
  cols?: number;
}

const props = withDefaults(defineProps<AppContainerProps>(), {
  tag: 'div',
  flex: false,
  page: false,
  center: false,
  cols: 12,
});

const flexClasses = ['flex', 'justify-between'];
const pageClasses = ['min-h-screen'];
const centerClasses = ['flex', 'flex-col', 'items-center', 'justify-center'];

const isFlexBetween = ref<boolean>(props.flex && !props.center);
const isFlexCentered = ref<boolean>(props.center && !props.flex);
const isPage = ref<boolean>(props.page);

let classes = [
  'container',
  'mx-auto',
  'px-4',
  'w-12/12',
  'md:px-0',
  `md:w-${props.cols}/12`,
  'max-w-screen-lg',
];

if (isFlexBetween.value) {
  classes = [...classes, ...flexClasses];
}
if (isFlexCentered.value) {
  classes = [...classes, ...centerClasses];
}
if (isPage.value) {
  classes = [...classes, ...pageClasses];
}

const AppContainer: Component = (_, { slots, attrs }) => {
  return h(props.tag, attrs, slots);
};
</script>

<template>
  <app-container :class="classes">
    <slot />
  </app-container>
</template>
