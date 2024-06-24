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
    async register({}, payload) {
      return createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      )
        .then((userCredential) => {
          // eslint-disable-next-line no-console
          console.log("userCredential", userCredential);
          commit("SET_USER_EMAIL", userCredential.email);
          return true;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log("error", error.message);
          return false;
        });
    },
    async login({}, payload) {
      return signInWithEmailAndPassword(auth, payload.email, payload.password)
        .then((userCredential) => {
          // eslint-disable-next-line no-console
          console.log("userCredential", userCredential);
          commit("SET_USER_EMAIL", userCredential.email);
          return true;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log("error", error.message);
          return false;
        });
    },
    logout({ commit }) {
      auth
        .signOut()
        .then(() => {
          commit("CLEAR_USER_EMAIL");
          // eslint-disable-next-line no-console
          console.log("User signed out");
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log("error", error.message);
        });
    },
  },
  namespaced: true,
};
