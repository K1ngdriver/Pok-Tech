<template>
  <q-page class="flex flex-center">
    <ContainerComponent title="Guess the Pokémon">
      <div
        v-if="loading"
        class="flex justify-center full-width q-py-xl full-height"
      >
        <q-spinner size="50px" color="black" />
      </div>
      <div v-else class="guess-pokemon-page">
        <span class="guess-pokemon-page-title">Tips</span>
        <div class="guess-pokemon-page-buttons-container">
          <div v-for="tip in revealedTips" :key="tip.id">
            <span>
              {{ tip.title }}
            </span>
            <ButtonComponent
              :title="currentTip >= tip.id ? tip.value : '?'"
              :class="
                tip.guessed
                  ? 'guess-pokemon-page-button-guessed'
                  : 'guess-pokemon-page-button'
              "
            />
          </div>
        </div>
        <div v-if="revealedPokemon" class="guess-pokemon-page-image">
          <span class="q-mt-lg text-bold">
            {{
              userRight
                ? `You're right 🎉 Congratulations!`
                : `You missed 😢 Try again!`
            }}
          </span>
          <div class="guess-pokemon-page-image-background">
            <img
              :src="drawnPokemon.image"
              :alt="drawnPokemon.name"
              class="guess-pokemon-page-image-artwork"
            />
          </div>
          <span>{{ capitalize(drawnPokemon.name) }}</span>
        </div>
      </div>
      <template v-slot:footer>
        <div class="flex q-pa-md justify-center">
          <q-input
            label="Name"
            class="guess-pokemon-page-input q-mr-md"
            outlined
            v-model="response"
          />
          <q-btn
            :icon="revealedPokemon ? 'replay' : 'arrow_upward'"
            class="guess-pokemon-page-submit-button"
            color="primary"
            @click="revealedPokemon ? replay() : submitResponse()"
            v-bind:disable="loading"
          />
        </div>
      </template>
    </ContainerComponent>
  </q-page>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import ContainerComponent from "src/components/ContainerComponent.vue";
import ButtonComponent from "src/components/ButtonComponent.vue";
import "./css/GuessPokemonPage.scss";
import { capitalize } from "src/utils/capitilize";

defineOptions({
  name: "GuessPokemonPage",
});

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const userEmail = computed(() => store.getters["auth/userEmail"]);

const response = ref("");
const loading = ref(false);
const error = ref(null);

const drawnPokemon = ref(null);
const revealedPokemon = ref(false);
const userRight = ref(false);
const currentTip = ref(1);
const tips = ref([]);
const user = ref(null);
const revealedTips = ref(
  Array.from({ length: 4 }, (_, index) => ({
    id: index + 1,
    title: `Tip ${index + 1}`,
    value: "",
    guessed: false,
  }))
);

const mappedGeneration = {
  i: "First",
  ii: "Second",
  iii: "Third",
  iv: "Fourth",
  v: "Fifth",
  vi: "Sixth",
  vii: "Seventh",
  viii: "Eighth",
  ix: "Nine",
};

async function fetchPokemonTips() {
  loading.value = true;
  error.value = null;

  try {
    const randomPokemonId = Math.floor(Math.random() * 1025) + 1;

    const pokemon = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`
    );
    const pokemonDetails = await axios.get(pokemon.data.species.url);

    const pokemonName = pokemon.data.name;
    const pokemonImage =
      pokemon.data.sprites.other["official-artwork"].front_default;

    const pokemonType = pokemon.data.types[0].type.name;
    const pokemonGeneration = pokemonDetails.data.generation.name;
    const pokemonColor = pokemonDetails.data.color.name;
    const pokemonHabitat = pokemonDetails.data.habitat?.name;
    const pokedexNumber = pokemonDetails.data.pokedex_numbers.find(
      (pokedexNumber) => pokedexNumber.pokedex.name === "national"
    ).entry_number;

    drawnPokemon.value = {
      name: pokemonName,
      image: pokemonImage,
    };
    tips.value = [
      {
        id: 1,
        title: "Type",
        value: pokemonType,
      },
      {
        id: 2,
        title: "Generation",
        value: mappedGeneration[pokemonGeneration.split("-")[1]],
      },
      {
        id: 3,
        title: pokemonHabitat ? "Habitat" : "Color",
        value: pokemonHabitat ? pokemonHabitat : pokemonColor,
      },
      {
        id: 4,
        title: "Pokédex number",
        value: String(pokedexNumber),
      },
    ];
    revealedTips.value = revealedTips.value.map((revealedTip) => {
      if (revealedTip.id === currentTip.value) {
        const tip = tips.value.find((tip) => tip.id === currentTip.value);
        return {
          ...revealedTip,
          value: capitalize(tip.value),
          title: tip.title,
          guessed: true,
        };
      }
      return revealedTip;
    });
  } catch (err) {
    error.value = "Failed to load pokemon tips";
  } finally {
    loading.value = false;
  }
}

const fetchUser = async () => {
  try {
    const q = query(
      collection(db, "users"),
      where("email", "==", userEmail.value)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        user.value = {
          id: doc.id,
          ...doc.data(),
        };
      });
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

const updateCountHearts = async () => {
  try {
    if (user.value.countHearts < 5) {
      const userRef = doc(db, "users", user.value.id);
      await updateDoc(userRef, {
        countHearts: user.value.countHearts + 1,
      });

      user.value.countHearts = user.value.countHearts + 1;
    }
  } catch (error) {
    console.error("Error updating user name:", error);
  }
};

async function submitResponse() {
  const userResponse = response.value.toLowerCase().trim();

  if (userResponse === drawnPokemon.value.name) {
    userRight.value = true;
    revealedPokemon.value = true;

    await fetchUser();
    await updateCountHearts();
  } else {
    if (currentTip.value === 4) {
      revealedPokemon.value = true;
      userRight.value = false;
    } else {
      currentTip.value += 1;
      revealedTips.value = revealedTips.value.map((revealedTip) => {
        if (revealedTip.id === currentTip.value) {
          const nextTip = tips.value.find((tip) => tip.id === currentTip.value);
          return {
            ...revealedTip,
            value: capitalize(nextTip.value),
            title: nextTip.title,
            guessed: true,
          };
        }
        return revealedTip;
      });
    }
  }
}

async function replay() {
  loading.value = true;
  error.value = null;
  response.value = "";
  revealedPokemon.value = false;
  userRight.value = false;
  currentTip.value = 1;
  tips.value = [];
  revealedTips.value = Array.from({ length: 4 }, (_, index) => ({
    id: index + 1,
    title: `Tip ${index + 1}`,
    value: "",
    guessed: false,
  }));
  await fetchPokemonTips();
}

onMounted(async () => {
  await fetchPokemonTips();
});
</script>
