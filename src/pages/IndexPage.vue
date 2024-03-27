<template>
  <q-page padding>
    <button @click="count++">{{ count }}</button>
    <input v-model="message" @keyup.esc="clearMessage" />
    <button @click="clearMessage">Clear</button>
    <h6 v-show="message.length">Tipying...</h6>
    <h5 v-if="message.length">{{ message }}</h5>
    <h6 v-else>No message entered</h6>
    <hr />
    <h6>Uppercase Message: {{ upperCaseMessage }}</h6>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
  data() {
    return {
      message: "First vue application",
      count: 0,
    };
  },
  methods: {
    clearMessage() {
      this.message = "";
    },
    handleKeyup(e) {
      //console.log(e);
      if (e.keycode == 27) this.clearMessage();
    },
  },

  computed: {
    upperCaseMessage() {
      console.log("upperCaseMessage fired");
      return this.message.toUpperCase();
    },
  },
});
</script>
