<template>
  <div class="loading-overlay">
    <q-spinner size="50px" color="white" />
  </div>
</template>

<script setup>
import { QSpinner } from "quasar";
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
