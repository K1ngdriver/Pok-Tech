<template>
  <q-page class="flex flex-center q-mx-md">
    <ContainerComponent title="Menu central">
      <div class="menu-page">
        <ButtonComponent
          title="Pokédex"
          class="menu-page-button"
          :click="() => goToPokedex()"
        />
        <ButtonComponent
          title="Jogo"
          class="menu-page-button"
          :click="() => goToPokedex()"
        />
        <ButtonComponent
          title="Companheiro"
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
</script>
