<template>
  <q-page class="flex flex-center">
    <ContainerComponent title="Login">
      <div class="full-width q-pa-md" style="margin-bottom: 10px">
        <q-input filled v-model="objectData.email" label="E-mail" />
        <q-input
          v-model="objectData.password"
          filled
          :type="isPwd ? 'password' : 'text'"
          label="Senha"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="togglePwdVisibility"
            />
          </template>
        </q-input>
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
      isPwd: true,
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    togglePwdVisibility() {
      this.isPwd = !this.isPwd;
    },
    async onSubmit() {
      console.log("Logging in with:", this.objectData);
      await this.login(this.objectData);
      this.$router.push("/menu");
    },
  },
};
</script>
