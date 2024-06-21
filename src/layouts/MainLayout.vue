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

const router = useRouter();

defineOptions({
  name: "MainLayout",
});

function goToHome() {
  router.push("/");
}
</script>
