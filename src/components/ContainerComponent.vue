<template>
  <div class="container full-width">
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
    <slot></slot>
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
