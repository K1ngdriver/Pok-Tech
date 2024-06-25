<template>
  <q-page class="flex flex-center">
    <ContainerComponent title="Cadastro">
      <div class="full-width q-pa-md register-page-container">
        <div class="full-width">
          <span class="register-page-label">
            <q-icon name="person" />
            User's Nickname
          </span>
          <q-input
            outlined
            v-model="userData.userNickName"
            class="full-width register-page-input"
          />
        </div>

        <div class="full-width">
          <span class="register-page-label">
            <q-icon name="email" />
            E-mail
          </span>
          <q-input
            outlined
            v-model="authData.email"
            class="full-width register-page-input"
          />
        </div>

        <div class="full-width">
          <span class="register-page-label">
            <q-icon name="lock" />
            Password
          </span>
          <q-input
            v-model="authData.password"
            outlined
            :type="isPwd ? 'password' : 'text'"
            class="full-width register-page-input"
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
        <q-btn @click="onSubmit" color="primary" style="width: 50%">
          Register
        </q-btn>
      </div>
      <template v-slot:footer>
        <p
          @click="() => this.$router.push('/')"
          style="
            color: #1976d2;
            cursor: pointer;
            text-align: center;
            text-decoration: underline;
          "
        >
          Already have an account? Log in!
        </p>
      </template>
    </ContainerComponent>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import { db } from "../../firebase.js";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "vue-router";
import ContainerComponent from "src/components/ContainerComponent.vue";
import "./css/RegisterPage.scss";

const router = useRouter();

export default {
  name: "RegisterPage",
  components: {
    ContainerComponent,
  },
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
      isPwd: true,
    };
  },
  methods: {
    ...mapActions("auth", ["register"]),
    togglePwdVisibility() {
      this.isPwd = !this.isPwd;
    },
    async onSubmit() {
      const response = await this.register(this.authData);
      if (response) {
        try {
          const docRef = await addDoc(collection(db, "users"), {
            ...this.userData,
            email: this.authData.email,
          });

          router.push("/menu");
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    },
  },
};
</script>
