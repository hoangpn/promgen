import axios from "axios";
import { ref } from "vue";
import { defineStore } from "pinia";

export const useServicesStore = defineStore("services", () => {
  const services = ref([]);
  const initialized = ref(false);

  async function init() {
    const success = await axios
      .get("/rest/service")
      .then((resp) => {
        resp.data.forEach((service) => services.value.push(service));
        initialized.value = true;
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });

    return success;
  }

  return { services, initialized, init };
});
