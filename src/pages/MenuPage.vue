<template>
  <q-page class="flex flex-center">
    <ContainerComponent title="Hub">
      <div class="menu-page">
        <ButtonComponent
          title="Pokédex"
          class="menu-page-button"
          :click="() => goToPokedex()"
        />
        <ButtonComponent
          title="Guess the Pokémon"
          class="menu-page-button"
          :click="() => goToGuessPokemon()"
        />
        <ButtonComponent
          title="Companion"
          class="menu-page-button"
          :click="() => goToCompanion()"
        />
      </div>
    </ContainerComponent>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import ContainerComponent from "src/components/ContainerComponent.vue";
import ButtonComponent from "src/components/ButtonComponent.vue";
import "./css/MenuPage.scss";

import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import { computed } from "vue";
import { useStore } from "vuex";

// Obtenha a instância da store Vuex
const store = useStore();

// Crie uma propriedade computada para acessar o getter
const userEmail = computed(() => store.getters["auth/userEmail"]);

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Ajuste o caminho para o seu arquivo de configuração do Firebase

const user = ref({});

const route = useRouter();

function goToPokedex() {
  route.push("/pokedex");
}

function goToGuessPokemon() {
  route.push("/guess-pokemon");
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

async function goToCompanion() {
  await fetchUser();
  if (user.value && user.value.pokemonId) {
    route.push("/my-companion");
  } else {
    route.push("/choice-companion");
  }
}
</script>
