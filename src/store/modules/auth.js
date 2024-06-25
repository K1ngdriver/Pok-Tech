import { auth } from "app/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default {
  state: {
    userEmail: null,
  },
  mutations: {
    SET_USER_EMAIL(state, email) {
      state.userEmail = email;
    },
    CLEAR_USER_EMAIL(state) {
      state.userEmail = null;
    },
  },
  getters: {
    userEmail: (state) => state.userEmail,
  },
  actions: {
    async register({ commit }, payload) {
      // Passando `commit` no contexto
      return createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      )
        .then((userCredential) => {
          commit("SET_USER_EMAIL", userCredential.user.email); // Usando `commit` corretamente
          return true;
        })
        .catch((error) => {
          console.log("error", error.message);
          return false;
        });
    },
    async login({ commit }, payload) {
      // Passando `commit` no contexto
      return signInWithEmailAndPassword(auth, payload.email, payload.password)
        .then((userCredential) => {
          commit("SET_USER_EMAIL", userCredential.user.email); // Usando `commit` corretamente
          return true;
        })
        .catch((error) => {
          console.log("error", error.message);
          return false;
        });
    },
    logout({ commit }) {
      auth
        .signOut()
        .then(() => {
          commit("CLEAR_USER_EMAIL");
          console.log("User signed out");
        })
        .catch((error) => {
          console.log("error", error.message);
        });
    },
  },
  namespaced: true,
};
