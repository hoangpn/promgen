import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { usersAPI } from '../api';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const isAuthenticated = computed(() => user.value !== null);
  const username = computed(() => user.value?.username);
  const email = computed(() => user.value?.email);
  const isSuperuser = computed(() => user.value?.is_superuser || false);

  // Actions
  async function fetchCurrentUser() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await usersAPI.me.get();
      user.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error('Error fetching current user:', err);
      
      // If 401, user is not authenticated
      if (err.response?.status === 401) {
        user.value = null;
      }
      
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    // Redirect to logout URL
    window.location.href = '/logout/';
  }

  return {
    // State
    user,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    username,
    email,
    isSuperuser,
    
    // Actions
    fetchCurrentUser,
    logout,
  };
});

