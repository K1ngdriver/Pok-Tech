<template>
  <q-page class="flex flex-center q-mx-md">
    <ContainerComponent title="Guess the Pokémon">
      <div class="guess-pokemon-page">
        <span class="guess-pokemon-page-title">Dicas</span>
        <div class="guess-pokemon-page-buttons-container">
          <ButtonComponent
            v-for="button in buttonsResponse"
            :key="button.id"
            :title="button.title"
            :class="
              button.guessed
                ? 'guess-pokemon-page-button-guessed'
                : 'guess-pokemon-page-button'
            "
          />
        </div>
      </div>
      <q-input
        label="Name"
        class="q-ma-md guess-pokemon-page-input"
        outlined
        v-model="response"
      />
    </ContainerComponent>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import ContainerComponent from "src/components/ContainerComponent.vue";
import ButtonComponent from "src/components/ButtonComponent.vue";
import "./css/GuessPokemonPage.scss";

defineOptions({
  name: "GuessPokemonPage",
});

const response = ref("");
const buttonsResponse = ref([
  {
    id: 1,
    title: "Eletric",
    guessed: true,
  },
  {
    id: 2,
    title: "?",
    guessed: false,
  },
  {
    id: 3,
    title: "?",
    guessed: false,
  },
  {
    id: 4,
    title: "?",
    guessed: false,
  },
]);
</script>
