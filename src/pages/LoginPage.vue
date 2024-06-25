<template>
  <q-page class="flex flex-center">
    <ContainerComponent title="Login">
      <div class="full-width q-pa-md login-page-container">
        <div class="full-width">
          <span class="login-page-label">
            <q-icon name="email" />
            E-mail
          </span>
          <q-input
            outlined
            v-model="objectData.email"
            class="full-width login-page-input"
          />
        </div>

        <div class="full-width">
          <span class="login-page-label">
            <q-icon name="lock" />
            Password
          </span>
          <q-input
            v-model="objectData.password"
            outlined
            :type="isPwd ? 'password' : 'text'"
            class="full-width login-page-input"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="togglePwdVisibility"
              />
            </template>
          </q-input>
        </div>
        <q-btn
          @click="onSubmit"
          color="primary"
          style="width: 50%"
          v-bind:disable="!objectData.email || !objectData.password"
          v-bind:loading="loading"
          >Log in</q-btn
        >
      </div>
      <template v-slot:footer>
        <p
          @click="() => this.$router.push('/register')"
          style="
            color: #1976d2;
            cursor: pointer;
            text-align: center;
            text-decoration: underline;
          "
        >
          Not have an account yet? Register!
        </p>
      </template>
    </ContainerComponent>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import ContainerComponent from "src/components/ContainerComponent.vue";
import "./css/LoginPage.scss";

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
      loading: false,
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    togglePwdVisibility() {
      this.isPwd = !this.isPwd;
    },
    async onSubmit() {
      this.loading = true;
      await this.login(this.objectData);
      this.loading = false;
      this.$router.push("/menu");
    },
  },
};
</script>
