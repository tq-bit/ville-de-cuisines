<script setup lang="ts">
import { ref } from 'vue';
import AppContainer from '../components/layout/content/AppContainer.vue';
import AppInput from '../components/form/AppInput.vue';
import iUser from '../components/icons/iUser.vue';
import iLock from '../components/icons/iLock.vue';

let passwordFieldType = ref<'text' | 'password'>('password');

const togglePasswordInputType = () => {
  passwordFieldType.value =
    passwordFieldType.value === 'text' ? 'password' : 'text';
};
</script>

<template>
  <app-container page>
    <app-input label="Please ne">
      <template v-slot:icon>
        <i-user></i-user>
      </template>
    </app-input>
    <app-input
      :type="passwordFieldType"
      label-prefix="Please enter your "
      label="Password"
      @click-icon="togglePasswordInputType"
    >
      <template v-slot:icon>
        <i-lock class="cursor-pointer"></i-lock>
      </template>
    </app-input>
  </app-container>
</template>

<style scoped></style>
