<template>
  <div class="flex flex-center q-mt-md q-mx-md index-page">
    <ContainerComponent
      title="Pokédex"
      :hasSearch="true"
      :openFilters="openFilters"
    >
      <q-dialog v-model="isDialogOpen">
        <q-card style="width: 90vw" class="dialog">
          <q-card-section>
            <div class="dialog-title">Filtros de pesquisa</div>
          </q-card-section>

          <q-card-section>
            <q-form>
              <q-input
                class="q-mb-md"
                outlined
                v-model="searchTerm"
                label="Nome ou número"
              />
              <q-select
                class="q-mb-md"
                outlined
                v-model="region"
                :options="regions"
                label="Região"
              />
              <q-select
                outlined
                v-model="type"
                :options="types"
                label="Tipagem"
              />
            </q-form>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn label="Pesquisar" color="secondary" @click="fetchPokemons" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <div class="pokemon-list q-pa-md">
        <div
          v-for="pokemon in pokemons"
          :key="pokemon.name"
          class="pokemon-item"
          @click="goToPokemonDetail(pokemon.name)"
        >
          <img :src="pokemon.image" :alt="pokemon.name" width="100px" />
          <div>{{ capitalize(pokemon.name) }}</div>
        </div>
      </div>
      <div class="full-width flex justify-center q-py-md" ref="spinner">
        <q-spinner
          v-if="pokemons.length !== 0 && loading"
          size="lg"
          color="primary"
        />
      </div>
    </ContainerComponent>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { capitalize } from "src/utils/capitilize";
import ContainerComponent from "src/components/ContainerComponent.vue";
import "./css/PokedexPage.scss";

defineOptions({
  name: "PokedexPage",
});

const router = useRouter();

function goToPokemonDetail(pokemonName) {
  router.push(`/pokedex/${pokemonName}`);
}
const pokemons = ref([]);
const searchTerm = ref("");
const region = ref(null);
const type = ref(null);
const offset = ref(0);
const limit = 30;
const loading = ref(false);
const error = ref(null);
const isDialogOpen = ref(false);
const spinner = ref(null);

function openFilters() {
  isDialogOpen.value = true;
}

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
        id: details.data.id,
        name: pokemon.name,
        image: details.data.sprites.other["official-artwork"].front_default,
      };
    });
    const newPokemons = await axios.all(promises);

    pokemons.value = [...pokemons.value, ...newPokemons];
    offset.value += limit;
  } catch (err) {
    error.value = "Failed to load pokemons";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchPokemons();

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loading.value) {
        fetchPokemons();
      }
    },
    {
      rootMargin: "10px",
      threshold: 1.0,
    }
  );

  if (spinner.value) {
    observer.observe(spinner.value);
  }
});

onUnmounted(() => {
  if (spinner.value) {
    observer.unobserve(spinner.value);
  }
});
</script>
