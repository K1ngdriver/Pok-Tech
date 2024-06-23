<template>
  <q-page class="flex flex-center q-mx-md">
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
          :click="() => goToPokedex()"
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

const route = useRouter();

function goToPokedex() {
  route.push("/pokedex");
}

function goToGuessPokemon() {
  route.push("/guess-pokemon");
}
</script>
