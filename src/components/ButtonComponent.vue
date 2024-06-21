<template>
  <button class="button q-py-lg q-px-xl" :style="style" @click="click">
    {{ title }}
  </button>
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
  click: {
    type: Function,
    default: () => {},
  },
});
</script>
