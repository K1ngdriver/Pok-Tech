<template>
  <q-page class="flex flex-center">
    <ContainerComponent title="Login">
      <div class="full-width q-pa-md">
        <q-input v-model="objectData.email" label="E-mail" />
        <q-input v-model="objectData.password" label="Senha" />
        <q-btn @click="onSubmit">Entrar</q-btn>
      </div>
    </ContainerComponent>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import ContainerComponent from "src/components/ContainerComponent.vue";

export default {
  name: "LoginPage",
  components: {
    ContainerComponent,
  },
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
      this.$router.push("/menu");
    },
  },
};
</script>
