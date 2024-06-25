<template>
  <q-page class="flex flex-center q-mx-md">
    <ContainerComponent title="My Companion">
      <div v-if="loading" class="flex justify-center full-width q-py-xl">
        <q-spinner size="50px" color="black" />
      </div>
      <div v-else>
        <div class="pokemon-info">
          <span class="pokemon-title"> {{ pokeNickName }}</span>
        </div>
        <div class="pokemon-image">
          <div class="pokemon-image-background">
            <img
              :src="pokemon.image"
              :alt="pokemon.name"
              class="pokemon-image-artwork"
            />
          </div>
        </div>
        <div class="pokemon-info" style="margin-bottom: 20px">
          <span class="pokemon-title">
            <img
              v-for="(heartImg, index) in hearts"
              :key="index"
              :src="heartImg"
              :alt="pokemon.name"
              class="pokemon-image-artwork"
              style="width: 40px; margin-right: 10px"
            />
            <q-tooltip style="width: 70vw">
              Guess the Pokémon, to earn hearts and evolve your companion
            </q-tooltip>
          </span>
        </div>

        <ButtonComponent
          title="Guess the Pokémon"
          class="my-companion-button"
          :click="() => goToGuessPokemon()"
        />
        <ButtonComponent
          title="Change nickname"
          class="my-companion-button"
          :click="() => goToNickName()"
        />
        <ButtonComponent
          title="Change companion"
          class="my-companion-button"
          :click="() => goToChoiceCompanion()"
        />
      </div>
    </ContainerComponent>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import ContainerComponent from "src/components/ContainerComponent.vue";
import "./css/NicknameCompanion.scss";
import "./css/MyCompanionPage.scss";
import heart from "src/assets/heart.png";
import heartTransparent from "src/assets/heart_transparent.png";
import { useStore } from "vuex";

const store = useStore();
const userEmail = computed(() => store.getters["auth/userEmail"]);

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase"; // Ajuste o caminho para o seu arquivo de configuração do Firebase
import ButtonComponent from "src/components/ButtonComponent.vue";

const router = useRouter();
const loading = ref(true);
const pokemon = ref({});
const user = ref({});
const pokeNickName = ref("");
const hearts = ref([]);
const idEvolution = ref(null);

function goToGuessPokemon() {
  router.push("/guess-pokemon");
}
function goToNickName() {
  router.push(`/nickname-companion/${user.value.pokemonId}`);
}
function goToChoiceCompanion() {
  router.push("/choice-companion");
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

const updatePokemonId = async (idEvolution) => {
  try {
    const userRef = doc(db, "users", user.value.id);
    await updateDoc(userRef, {
      pokemonId: idEvolution,
    });

    user.value.pokemonId = idEvolution;
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  try {
    await fetchUser();

    if (user.value && user.value.pokemonId) {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${user.value.pokemonId}`
      );
      const speciesResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${user.value.pokemonId}`
      );

      pokemon.value = {
        name: response.data.name,
        image: response.data.sprites.other["official-artwork"].front_default,
        number: response.data.id,
        types: response.data.types.map((typeInfo) => typeInfo.type.name),
        description: speciesResponse.data.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        ).flavor_text,
      };

      pokeNickName.value = user.value.nicknamePokemon;

      hearts.value = Array(5).fill(heartTransparent);
      for (let i = 0; i < user.value.countHearts; i++) {
        hearts.value[i] = heart;
      }

      if (user.value.countHearts === 3) {
        if (speciesResponse.data.evolution_chain) {
          const evolutionChain = await axios.get(
            speciesResponse.data.evolution_chain.url
          );

          const evolutionData = evolutionChain.data.chain.evolves_to[0];
          if (evolutionData) {
            const parts = evolutionData.species.url.split("/");
            idEvolution.value = parts[parts.length - 2];
            if (idEvolution.value !== pokemon.value.number) {
              await updatePokemonId(idEvolution.value);
            }
          }
        }
      }

      if (user.value.countHearts === 5) {
        if (speciesResponse.data.evolution_chain) {
          const evolutionChain = await axios.get(
            speciesResponse.data.evolution_chain.url
          );

          const evolutionData =
            evolutionChain.data.chain.evolves_to[0]?.evolves_to[0];
          if (evolutionData) {
            const parts = evolutionData.species.url.split("/");
            idEvolution.value = parts[parts.length - 2];
            if (idEvolution.value !== pokemon.value.number) {
              await updatePokemonId(idEvolution.value);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Failed to load pokemon details:", error);
  } finally {
    loading.value = false;
  }
});
</script>
