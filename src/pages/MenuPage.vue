<template>
  <q-page class="flex flex-center">
    <ContainerComponent title="Menu">
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

import { computed } from "vue";
import { useStore } from "vuex";

// Obtenha a instância da store Vuex
const store = useStore();

// Crie uma propriedade computada para acessar o getter
const userEmail = computed(() => store.getters["auth/userEmail"]);

console.log({ userEmail: userEmail.value });

const route = useRouter();

function goToPokedex() {
  route.push("/pokedex");
}

function goToGuessPokemon() {
  route.push("/guess-pokemon");
}

function goToCompanion() {
  route.push("/choice-companion");
}
</script>
