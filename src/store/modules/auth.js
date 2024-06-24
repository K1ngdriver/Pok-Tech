import { auth } from "app/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default {
  state: {},
  mutations: {},
  getters: {},
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
          return true;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log("error", error.message);
          return false;
        });
    },
  },
  namespaced: true,
};
