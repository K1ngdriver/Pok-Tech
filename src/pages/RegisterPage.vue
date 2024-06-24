<template>
  <div>
    <q-input v-model="userData.userNickName" label="Nickname do usuário" />
    <q-input v-model="authData.email" label="E-mail" />
    <q-input v-model="authData.password" label="Senha" />
    <q-btn @click="onSubmit">Cadastrar</q-btn>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { db } from "../../firebase.js";
import { collection, addDoc } from "firebase/firestore";

export default {
  name: "RegisterPage",
  data() {
    return {
      authData: {
        email: "",
        password: "",
      },
      userData: {
        userNickName: "",
        nicknamePokemon: "",
        pokemonId: null,
        countHearts: 0,
      },
    };
  },
  methods: {
    ...mapActions("auth", ["register"]),
    async onSubmit() {
      const response = await this.register(this.authData);
      if (response) {
        try {
          const docRef = await addDoc(collection(db, "users"), {
            ...this.userData,
            email: this.authData.email,
          });
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    },
  },
};
</script>
