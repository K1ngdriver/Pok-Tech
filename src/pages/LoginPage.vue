<template>
  <div>
    <q-input v-model="objectData.email" label="E-mail" />
    <q-input v-model="objectData.password" label="Senha" />
    <q-btn @click="onSubmit">Entrar</q-btn>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginPage",
  data() {
    return {
      objectData: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    async onSubmit() {
      await this.login(this.objectData);
    },
  },
};
</script>
