import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { notifiersAPI } from "../api";

export const useNotifiersStore = defineStore("notifiers", () => {
  // State
  const notifiers = ref([]);
  const currentNotifier = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  // Getters
  const notifiersCount = computed(() => notifiers.value.length);

  const getNotifierById = computed(() => {
    return (id) => notifiers.value.find((n) => n.id === id);
  });

  const first = computed(() => (pagination.value.page - 1) * pagination.value.pageSize);

  // Actions
  async function fetchNotifiers(params = {}) {
    loading.value = true;
    error.value = null;

    try {
      const response = await notifiersAPI.list({
        page_number: pagination.value.page,
        page_size: pagination.value.pageSize,
        ...params,
      });

      // Handle DRF paginated response
      if (response.data.results !== undefined) {
        notifiers.value = response.data.results;
        pagination.value.total = response.data.count || 0;
      } else {
        // Non-paginated response
        notifiers.value = response.data;
        pagination.value.total = response.data.length;
      }

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error fetching notifiers:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateNotifier(id, data) {
    loading.value = true;
    error.value = null;

    try {
      const response = await notifiersAPI.update(id, data);
      const index = notifiers.value.findIndex((n) => n.id === id);
      if (index !== -1) {
        notifiers.value[index] = response.data;
      }
      if (currentNotifier.value?.id === id) {
        currentNotifier.value = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error updating notifier:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchNotifier(id) {
    loading.value = true;
    error.value = null;

    try {
      const response = await notifiersAPI.get(id);
      currentNotifier.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error fetching notifier:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createNotifier(contextType, contextId, data) {
    loading.value = true;
    error.value = null;

    try {
      let response;
      // Call the appropriate API based on contextType
      if (contextType === 'service') {
        response = await notifiersAPI.createForService(contextId, data);
      } else if (contextType === 'project') {
        response = await notifiersAPI.createForProject(contextId, data);
      } else if (contextType === 'user') {
        response = await notifiersAPI.createForUser(data);
      } else {
        throw new Error(`Unknown context type: ${contextType}`);
      }
      
      // Add the new notifier to the list if we're on the same page
      if (response.data) {
        notifiers.value.push(response.data);
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error creating notifier:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteNotifier(id) {
    loading.value = true;
    error.value = null;

    try {
      await notifiersAPI.delete(id);
      const index = notifiers.value.findIndex((n) => n.id === id);
      if (index !== -1) {
        notifiers.value.splice(index, 1);
      }
      if (currentNotifier.value?.id === id) {
        currentNotifier.value = null;
      }
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error deleting notifier:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function setPage(page) {
    pagination.value.page = page;
  }

  function setPageSize(size) {
    pagination.value.pageSize = size;
  }

  return {
    // State
    notifiers,
    currentNotifier,
    loading,
    error,
    pagination,

    // Getters
    notifiersCount,
    getNotifierById,
    first,

    // Actions
    fetchNotifiers,
    fetchNotifier,
    createNotifier,
    updateNotifier,
    deleteNotifier,
    setPage,
    setPageSize,
  };
});

