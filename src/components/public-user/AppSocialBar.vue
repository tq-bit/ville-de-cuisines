<script setup lang="ts">
import { AppPublicUser } from '@/@types';
defineProps<{
  publicUser: AppPublicUser;
}>();
</script>

<template>
  <div>
    <a
      v-if="publicUser.facebook_url"
      :href="publicUser.facebook_url"
      target="_blank"
      class="mx-2 inline-block"
    >
      <i-facebook></i-facebook>
    </a>

    <a
      v-if="publicUser.instagram_url"
      :href="publicUser.instagram_url"
      target="_blank"
      class="mx-2 inline-block"
    >
      <i-instagram></i-instagram>
    </a>
    <a
      v-if="publicUser.pinterest_url"
      :href="publicUser.pinterest_url"
      target="_blank"
      class="mx-2 inline-block"
    >
      <i-pinterest></i-pinterest>
    </a>
  </div>
</template>

<style scoped></style>
