<template>
  <div>
    <q-input v-model="objectData.userNickName" label="Nome do Usuário" />
    <q-btn @click="fetchObject">Fetch Object</q-btn>
    <div v-if="fetchedObject">
      <p><strong>Obj:</strong> {{ fetchedObject }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default {
  setup() {
    const objectData = ref({
      userNickName: "",
    });
    const fetchedObject = ref(null);

    const fetchObject = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("userNickName", "==", objectData.value.userNickName)
        );
        const querySnapshot = await getDocs(q);

        let result = null;
        querySnapshot.forEach((doc) => {
          result = {
            ...doc.data(),
          };
        });

        fetchedObject.value = result; // Atribui o resultado à variável fetchedObject
      } catch (error) {
        console.error("Error getting object by nickname: ", error);
        throw error;
      }
    };

    return {
      objectData,
      fetchedObject,
      fetchObject,
    };
  },
};
</script>
