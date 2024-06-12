<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="title"> Teste App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <div class="pokemon-list">
        <div
          v-for="pokemon in pokemons"
          :key="pokemon.name"
          class="pokemon-item"
          @click="getPokemon(pokemon)"
        >
          <img :src="pokemon.image" :alt="pokemon.name" />
          <div>{{ pokemon.name }}</div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import "./MainLayout.scss";

defineOptions({
  name: "MainLayout",
});

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function getPokemon(pokemon) {
  console.log(pokemon);
}

const pokemons = ref([]);
const offset = ref(0);
const limit = 50;
const loading = ref(false);
const error = ref(null);

async function fetchPokemons() {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset.value}&limit=${limit}`
    );
    const promises = response.data.results.map(async (pokemon) => {
      const details = await axios.get(pokemon.url);

      return {
        name: pokemon.name,
        image: details.data.sprites.front_default,
      };
    });
    const newPokemons = await Promise.all(promises);

    pokemons.value = [...pokemons.value, ...newPokemons];
    offset.value += limit;
  } catch (err) {
    error.value = "Failed to load pokemons";
  } finally {
    loading.value = false;
  }
}

function handleScroll() {
  const bottomOfWindow =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 10;
  if (bottomOfWindow && !loading.value) {
    fetchPokemons();
  }
}

onMounted(() => {
  fetchPokemons;
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
