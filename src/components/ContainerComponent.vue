<template>
  <div class="container q-ma-md">
    <div class="container-header q-pa-md">
      <span class="title">{{ title }}</span>
      <q-btn
        v-if="hasSearch"
        icon="search"
        size="lg"
        class="search-btn"
        @click="openFilters"
      />
    </div>
    <div class="container-content">
      <slot></slot>
    </div>
    <div class="container-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import "./css/Container.scss";

const props = defineProps({
  title: {
    type: String,
    default: "Pokédex",
  },
  hasSearch: {
    type: Boolean,
    default: false,
  },
  openFilters: {
    type: Function,
    default: () => {},
  },
});
</script>
