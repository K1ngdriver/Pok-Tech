// src/pages/SaveObjectPage.vue
<template>
  <div>
    <q-input v-model="objectData.countHearts" label="corações" />
    <q-input v-model="objectData.nicknamePokemon" label="NickName Pokemon" />
    <q-input
      v-model="objectData.pokemonId"
      label="index do pokemon"
      type="number"
    />
    <q-input v-model="objectData.userNickName" label="nickname do usuário" />
    <q-btn @click="saveObject">Save Object</q-btn>
  </div>
</template>

<script>
import { ref } from "vue";
import { db } from "../../firebase.js";
import { collection, addDoc } from "firebase/firestore";

export default {
  setup() {
    const objectData = ref({
      countHearts: 0,
      nicknamePokemon: "",
      pokemonId: null,
      userNickName: "",
    });

    const saveObject = async () => {
      try {
        const docRef = await addDoc(collection(db, "users"), objectData.value);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };

    return {
      objectData,
      saveObject,
    };
  },
};
</script>
