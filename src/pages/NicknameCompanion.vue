<template>
  <q-page class="flex flex-center">
    <ContainerComponent title="Companion">
      <div v-if="loading" class="flex justify-center full-width q-py-xl">
        <q-spinner size="50px" color="black" />
      </div>
      <div v-else>
        <div class="pokemon-info">
          <span class="pokemon-title"
            >Você escolheu {{ capitalize(pokemon.name) }}</span
          >
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
          <span class="pokemon-title"> Quer dar um apelido a ele?</span>
        </div>
      </div>
      <template v-slot:footer>
        <div class="pokemon-description">
          <div class="pokemon-description-container">
            <q-input
              class="q-mb-md"
              style="margin-bottom: 0px; width: 320px"
              outlined
              counter
              maxlength="20"
              v-model="newNickName"
              label="Digite um apelido ..."
            />
          </div>
          <q-card-actions align="center">
            <q-btn
              style="background-color: #000; color: white"
              flat
              label="Cancelar"
              @click="returnToMenu"
            />
            <q-btn
              label="Confirmar"
              style="background-color: #ff3131; color: white"
              @click="changeName"
            />
          </q-card-actions>
        </div>
      </template>
    </ContainerComponent>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { capitalize } from "src/utils/capitilize";
import ContainerComponent from "src/components/ContainerComponent.vue";
import "./css/NicknameCompanion.scss";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase"; // Ajuste o caminho para o seu arquivo de configuração do Firebase

import { computed } from "vue";
import { useStore } from "vuex";

// Obtenha a instância da store Vuex
const store = useStore();

// Crie uma propriedade computada para acessar o getter
const userEmail = computed(() => store.getters["auth/userEmail"]);

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const pokemon = ref({});
const newNickName = ref("");
const newPokemonId = ref("");
const user = ref(null);
function returnToMenu() {
  router.push("/menu");
}

async function changeName() {
  console.log({ nickname: newNickName.value });
  const pokemonData = {
    pokemonId: newPokemonId.value,
    nicknamePokemon: newNickName.value,
  };

  try {
    await fetchUser(); // Aguardar a execução do fetchUser
  } catch (e) {
    console.error(e);
  }

  console.log({ user: user.value });
  updateUserName();
  console.log({ pokemonData });

  router.push(`/my-companion`);
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

const updateUserName = async () => {
  console.log({ user: user.value });
  try {
    const userRef = doc(db, "users", user.value.id);
    await updateDoc(userRef, {
      nicknamePokemon: newNickName.value,
      pokemonId: newPokemonId.value,
    });
    console.log("User name updated successfully!");

    // Atualiza o objeto localmente após a atualização
    user.value.name = newNickName.value;
  } catch (error) {
    console.error("Error updating user name:", error);
  }
};

onMounted(async () => {
  const pokemonId = route.params.pokemonId;
  newPokemonId.value = pokemonId;
  console.log({ newPokemonId: newPokemonId.value });

  try {
    await fetchUser();
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${newPokemonId.value}`
    );
    const speciesResponse = await axios.get(
      `https://pokeapi.co/api/v2/pokemon-species/${newPokemonId.value}`
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
    if (user.value.nicknamePokemon) {
      newNickName.value = user.value.nicknamePokemon;
    } else {
      newNickName.value = response.data.name;
    }
  } catch (error) {
    console.error("Failed to load pokemon details:", error);
  } finally {
    loading.value = false;
  }
});
</script>
