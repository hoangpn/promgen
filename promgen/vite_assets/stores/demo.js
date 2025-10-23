import { ref } from "vue";
import { defineStore } from "pinia";

export const useDemoStore = defineStore("demo", () => {
  const fruits = ref(["apple", "pear", "melon", "orange"]);

  return { fruits };
});
