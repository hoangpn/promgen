<script setup>
import { onBeforeMount } from "vue";
import { RouterView } from "vue-router";
import { useServicesStore } from "./stores/services.js";

const servicesStore = useServicesStore();

onBeforeMount(() => {
  servicesStore.init();
});
</script>

<template>
  <div class="layout-container">
    <RouterView />
  </div>
</template>
