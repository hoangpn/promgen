<script setup>
import { useAuthStore } from "../../stores";
import AppNavbar from "./AppNavbar.vue";
import Breadcrumb from "../Breadcrumb.vue";

const authStore = useAuthStore();
</script>

<template>
  <div class="app-layout">
    <AppNavbar :user="authStore.user" />

    <main class="app-content">
      <div class="container-fluid">
        <Breadcrumb />
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f6fa;
}

.app-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f5f6fa;
}

.app-content::-webkit-scrollbar {
  width: 8px;
}

.app-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.app-content::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.app-content::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.container-fluid {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .container-fluid {
    padding: 0.75rem;
  }
}

@media (min-width: 1600px) {
  .container-fluid {
    max-width: 1600px;
  }
}
</style>
