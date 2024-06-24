<template>
  <q-page class="flex flex-center q-mx-md">
    <ContainerComponent title="Companion">
      <div v-if="loading" class="flex justify-center full-width q-py-xl">
        <q-spinner size="50px" color="black" />
      </div>
      <div v-else>
        <div class="pokemon-image">
          <div class="pokemon-image-background">
            <img
              :src="pokemon.image"
              :alt="pokemon.name"
              class="pokemon-image-artwork"
            />
          </div>
        </div>
        <div class="pokemon-info">
          <span class="pokemon-title"
            >{{ pokemon.number }} - {{ capitalize(pokemon.name) }}</span
          >
          <div class="pokemon-types">
            <q-chip
              v-for="type in pokemon.types"
              :key="type"
              class="pokemon-type"
              :label="capitalize(type)"
              :class="`pokemon-type--${type}`"
              text-color="white"
            />
          </div>
        </div>
        <div class="pokemon-description">
          <div class="pokemon-description-container">
            <p class="pokemon-description-text">
              {{ pokemon.description }}
            </p>
          </div>
        </div>
      </div>
    </ContainerComponent>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { capitalize } from "src/utils/capitilize";
import ContainerComponent from "src/components/ContainerComponent.vue";
import "./css/NicknameCompanion.scss";

const route = useRoute();
const loading = ref(true);
const pokemon = ref({});

onMounted(async () => {
  const pokemonId = route.params.pokemonId;
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    const speciesResponse = await axios.get(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
    );

    // eslint-disable-next-line no-console
    console.log("response.data", response.data);
    // eslint-disable-next-line no-console
    console.log("speciesResponse.data", speciesResponse.data);

    pokemon.value = {
      name: response.data.name,
      image: response.data.sprites.other["official-artwork"].front_default,
      number: response.data.id,
      types: response.data.types.map((typeInfo) => typeInfo.type.name),
      description: speciesResponse.data.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      ).flavor_text,
    };
  } catch (error) {
    console.error("Failed to load pokemon details:", error);
  } finally {
    loading.value = false;
  }
});
</script>
