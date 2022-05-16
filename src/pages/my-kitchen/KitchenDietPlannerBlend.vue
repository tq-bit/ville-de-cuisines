<script setup lang="ts"></script>

<template>
  <app-screen-modal
    @keydown.esc="closeAccountModal"
    @click-blend="closeAccountModal"
  >
    <app-card
      block
      :closable="true"
      @close="closeAccountModal"
      title="Account settings"
    >
    </app-card>
  </app-screen-modal>
</template>
