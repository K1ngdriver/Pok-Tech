<template>
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
          <q-select outlined v-model="type" :options="types" label="Tipagem" />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn label="Pesquisar" color="secondary" @click="fetchPokemons" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="areYouSureDialogOpen">
    <q-card style="width: 90vw" class="dialog">
      <q-card-section>
        <div class="dialog-title">Você escolhe este Pokémon?</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Não" v-close-popup />
        <q-btn
          label="Sim"
          color="secondary"
          @click="selectCompanion(dialogPokemon)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
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
          <q-select outlined v-model="type" :options="types" label="Tipagem" />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn label="Pesquisar" color="secondary" @click="fetchPokemons" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="areYouSureDialogOpen">
    <q-card style="width: 90vw" class="dialog">
      <q-card-section>
        <div class="dialog-title">Você escolhe este Pokémon?</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Não" v-close-popup />
        <q-btn
          label="Sim"
          color="secondary"
          @click="selectCompanion(dialogPokemon)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div class="flex flex-center index-page">
    <ContainerComponent
      title="Selecionar Companheiro"
      :hasSearch="true"
      :openFilters="openFilters"
    >
      <div>
        <div class="pokemon-description">
          <div class="pokemon-description-container">
            <p class="pokemon-description-text">
              {{ labelChoicePokemon }}
            </p>
          </div>
        </div>

        <div class="pokemon-list q-pa-md">
          <div
            v-for="pokemon in pokemons"
            :key="pokemon?.id"
            class="pokemon-item"
            @click="openAreYouSureDialog(pokemon?.id)"
          >
            <img :src="pokemon?.image" :alt="pokemon?.name" width="100px" />
            <div>{{ capitalize(pokemon?.name) }}</div>
          </div>
        </div>
      </div>
      <template #footer>
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
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { capitalize } from "src/utils/capitilize";
import ContainerComponent from "src/components/ContainerComponent.vue";
import "./css/ChoiceCompanionPage.scss";

defineOptions({
  name: "PokedexPage",
});

const router = useRouter();

const pokemons = ref([]);
const searchTerm = ref("");
const region = ref(null);
const type = ref(null);
const offset = ref(0);
const limit = 50;
const loading = ref(false);
const error = ref(null);
const isDialogOpen = ref(false);
const spinner = ref(null);
const labelChoicePokemon = ref(
  "Você pode escolher um pokémon jovem para ser seu amigo"
);
const areYouSureDialogOpen = ref(false);
const dialogPokemon = ref("");

const openAreYouSureDialog = (pokemonId) => {
  dialogPokemon.value = pokemonId;
  areYouSureDialogOpen.value = true;
};

const closeAreYouSureDialog = () => {
  areYouSureDialogOpen.value = false;
};

function openFilters() {
  isDialogOpen.value = true;
}

function areYouSureDialog() {
  areYouSureDialogOpen.value = true;
}

function selectCompanion(dialogPokemon) {
  router.push(`/nickname-companion/${dialogPokemon}`);

  console.log({ dialogPokemon });
}

async function fetchPokemons() {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset.value}&limit=${limit}`
    );

    const promises = response.data.results.map(async (pokemon) => {
      const response2 = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`
      );
      const pokeSpecies = response2.data;
      console.log({ pokeSpecies });
      console.log({ species: pokeSpecies.evolves_from_species });
      return {
        ...pokemon,
        pokeSpecies,
      };
    });

    const results = await Promise.all(promises);
    const filteredResults = results.filter(
      ({ pokeSpecies }) =>
        pokeSpecies.evolves_from_species === null &&
        pokeSpecies.is_legendary === false &&
        pokeSpecies.is_mythical === false
    );

    const firstEvolutions = await axios.all(
      filteredResults.map(async (pokemon) => {
        const details = await axios.get(pokemon.url);

        return {
          id: details.data.id,
          name: details.data.name,
          image: details.data.sprites.other["official-artwork"].front_default,
        };
      })
    );
    console.log({ firstEvolutions });
    pokemons.value = [...pokemons.value, ...firstEvolutions];
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
