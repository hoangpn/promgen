<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from './stores';
import AppLayout from './components/layout/AppLayout.vue';

const authStore = useAuthStore();

onMounted(async () => {
  // Initialize auth state
  try {
    await authStore.fetchCurrentUser();
  } catch (error) {
    console.error('Failed to fetch current user:', error);
  }
});
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

<style scoped>
/* App-level styles */
</style>

