<template>
  <q-layout view="lHh Lpr lFf" class="background">
    <q-header elevated class="row header">
      <div class="col-4 header-circle">
        <div class="q-mx-lg q-my-md header-navCircle" @click="goToHome"></div>
      </div>
      <div class="col-8 flex items-end">
        <span class="header-title q-pa-md">Poketech</span>
      </div>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from "vue-router";
import "./MainLayout.scss";
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const userEmail = computed(() => store.getters["auth/userEmail"]);
const router = useRouter();

defineOptions({
  name: "MainLayout",
});

function goToHome() {
  if (userEmail.value) {
    router.push("/menu");
  } else {
    router.push("/");
  }
}
</script>
