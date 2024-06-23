<template>
  <div class="container-button" :style="containerStyle">
    <button class="button" :style="style" @click="click">
      {{ title }}
    </button>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import "./css/Button.scss";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  style: {
    type: String,
  },
  containerStyle: {
    type: String,
  },
  click: {
    type: Function,
    default: () => {},
  },
});
</script>
