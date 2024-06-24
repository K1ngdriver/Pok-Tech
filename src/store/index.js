import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import auth from "./modules/auth";
import users from "./modules/users";

export default store(function () {
  const Store = createStore({
    modules: {
      auth,
      users,
    },

    strict: process.env.DEBUGGING,
  });

  return Store;
});
