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
        <div class="pokemon-info">
          <span class="pokemon-title">
            <img
              :src="heart"
              :alt="pokemon.name"
              class="pokemon-image-artwork"
              style="width: 40px; margin-right: 10px"
            />
            <img
              :src="heart"
              :alt="pokemon.name"
              class="pokemon-image-artwork"
              style="width: 40px; margin-right: 10px"
            />
            <img
              :src="heart"
              :alt="pokemon.name"
              class="pokemon-image-artwork"
              style="width: 40px; margin-right: 10px"
            />
            <img
              :src="heart"
              :alt="pokemon.name"
              class="pokemon-image-artwork"
              style="width: 40px; margin-right: 10px"
            />
            <img
              :src="heart"
              :alt="pokemon.name"
              class="pokemon-image-artwork"
              style="width: 40px"
            />
          </span>
        </div>
        <div class="pokemon-description">
          <ButtonComponent
            title="Guess the Pokémon"
            class="menu-page-button"
            :click="() => goToGuessPokemon()"
          />
          <ButtonComponent
            title="Trocar apelido"
            class="menu-page-button"
            :click="() => goToNickName()"
          />
          <ButtonComponent
            title="Trocar companheiro"
            class="menu-page-button"
            :click="() => goToChoiceCompanion()"
          />
        </div>
      </div>
    </ContainerComponent>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import ContainerComponent from "src/components/ContainerComponent.vue";
import "./css/NicknameCompanion.scss";
import heart from "src/assets/heart.png";
import { computed } from "vue";
import { useStore } from "vuex";

// Obtenha a instância da store Vuex
const store = useStore();

// Crie uma propriedade computada para acessar o getter
const userEmail = computed(() => store.getters["auth/userEmail"]);

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Ajuste o caminho para o seu arquivo de configuração do Firebase
import ButtonComponent from "src/components/ButtonComponent.vue";

const router = useRouter();
const loading = ref(true);
const pokemon = ref({});
const user = ref({});
const pokeNickName = ref("");

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
  console.log({ email: userEmail.value });
  try {
    const q = query(
      collection(db, "users"),
      where("email", "==", userEmail.value)
    );
    const querySnapshot = await getDocs(q);
    console.log({ querySnapshot });
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        user.value = {
          id: doc.id,
          ...doc.data(),
        };
      });
      console.log("User found:", user.value);
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

onMounted(async () => {
  try {
    await fetchUser();

    console.log({ userValue: user.value });
    if (user.value && user.value.pokemonId) {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${user.value.pokemonId}`
      );
      const speciesResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${user.value.pokemonId}`
      );

      console.log({ response: response.data });
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
    }
  } catch (error) {
    console.error("Failed to load pokemon details:", error);
  } finally {
    loading.value = false;
  }
});
</script>
