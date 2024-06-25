<template>
  <q-dialog v-model="isDialogOpen">
    <q-card style="width: 90vw" class="dialog">
      <q-card-section>
        <div class="dialog-title">Search filters</div>
      </q-card-section>

      <q-card-section>
        <q-form>
          <q-input
            class="q-mb-md"
            outlined
            v-model="searchTerm"
            label="Name or number"
          />
          <q-select
            class="q-mb-md"
            outlined
            v-model="generation"
            :options="generationOptions"
            label="Generation"
          />
          <q-select
            outlined
            v-model="type"
            :options="typeOptions"
            label="Types"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          label="Clean"
          v-if="hasFilters"
          color="secondary"
          @click="
            async () => {
              searchTerm = '';
              generation = null;
              type = null;
            }
          "
        />
        <q-btn
          :label="loading ? 'Loading...' : 'Search'"
          color="primary"
          v-bind:disable="loading"
          @click="
            async () => {
              if (hasFilters) {
                await fetchPokemonsByFilters();
              } else {
                pokemons = [];
                offset = 0;
                await fetchPokemons();
              }
              isDialogOpen = false;
            }
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div class="flex flex-center index-page">
    <ContainerComponent
      title="Pokédex"
      :hasSearch="true"
      :openFilters="openFilters"
    >
      <div v-if="loading || pokemons.length" class="pokemon-list q-pa-md">
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
      <div v-else class="full-width flex justify-center q-py-md" ref="spinner">
        <span class="text-bold">No Pokémon found </span>
      </div>

      <template v-slot:footer>
        <div class="full-width flex justify-center q-py-md" ref="spinner">
          <q-spinner
            v-if="pokemons.length !== 0 && loading"
            size="lg"
            color="primary"
          />
        </div>
      </template>
    </ContainerComponent>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { capitalize } from "src/utils/capitilize";
import { generationOptions, typeOptions } from "src/utils/defaults";
import ContainerComponent from "src/components/ContainerComponent.vue";
import "./css/PokedexPage.scss";

defineOptions({
  name: "PokedexPage",
});

const router = useRouter();

const pokemons = ref([]);
const offset = ref(0);
const limit = 30;
const searchTerm = ref("");
const type = ref(null);
const generation = ref(null);
const hasFilters = computed(() =>
  Boolean(searchTerm.value || type.value || generation.value)
);

const loading = ref(false);
const error = ref(null);
const isDialogOpen = ref(false);
const spinner = ref(null);

function openFilters() {
  isDialogOpen.value = true;
}

function goToPokemonDetail(pokemonName) {
  router.push(`/pokedex/${pokemonName}`);
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
        types: details.data.types.map((type) => type.type.name),
        generation: Math.ceil(details.data.id / 151),
      };
    });
    const newPokemons = await axios.all(promises);

    const filteredPokemons = newPokemons.filter((pokemon) => {
      const isGenerationMatch = generation.value
        ? pokemon.generation === generation.value
        : true;
      const isTypeMatch = type.value
        ? pokemon.types.includes(type.value)
        : true;

      return isGenerationMatch && isTypeMatch;
    });

    pokemons.value = [...pokemons.value, ...filteredPokemons];
    offset.value += limit;
  } catch (err) {
    error.value = "Failed to load pokemons";
  } finally {
    loading.value = false;
  }
}

async function fetchPokemonsByFilters() {
  loading.value = true;
  pokemons.value = [];
  offset.value = 0;
  try {
    const filterFunctions = [];
    let searchPokemonId = null;
    const typePokemonIds = new Set();
    const generationPokemonIds = new Set();

    if (searchTerm.value) {
      try {
        const searchResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${searchTerm.value.toLowerCase()}`
        );
        searchPokemonId = searchResponse.data.id;
        filterFunctions.push((pokemonId) => pokemonId === searchPokemonId);
      } catch (searchError) {
        error.value = "No Pokémon found with the specified name or ID.";
        loading.value = false;
        return;
      }
    }

    if (type.value) {
      const typeResponse = await axios.get(
        `https://pokeapi.co/api/v2/type/${type.value.value}`
      );
      typeResponse.data.pokemon.forEach((p) =>
        typePokemonIds.add(p.pokemon.url.split("/").slice(-2)[0])
      );
      filterFunctions.push((pokemonId) => typePokemonIds.has(pokemonId));
    }

    if (generation.value) {
      const generationResponse = await axios.get(
        `https://pokeapi.co/api/v2/generation/${generation.value.value}`
      );
      generationResponse.data.pokemon_species.forEach((p) =>
        generationPokemonIds.add(p.url.split("/").slice(-2)[0])
      );
      filterFunctions.push((pokemonId) => generationPokemonIds.has(pokemonId));
    }

    let filteredPokemonNames = [];
    if (filterFunctions.length > 0) {
      filteredPokemonNames = Array.from(
        new Set([...typePokemonIds, ...generationPokemonIds])
      );
      filteredPokemonNames = filteredPokemonNames.filter((pokemonId) =>
        filterFunctions.every((filterFunction) => filterFunction(pokemonId))
      );
    }

    const detailedPokemonPromises = filteredPokemonNames.map(
      async (pokemonId) => {
        const detailsResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
        );
        return {
          name: detailsResponse.data.name,
          image:
            detailsResponse.data.sprites.other["official-artwork"]
              .front_default,
          types: detailsResponse.data.types.map((t) => t.type.name),
        };
      }
    );

    pokemons.value = await Promise.all(detailedPokemonPromises);
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
      if (entries[0].isIntersecting && !loading.value && !hasFilters.value) {
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
