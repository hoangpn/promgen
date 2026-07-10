import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { farmsAPI } from "../api";

export const useFarmsStore = defineStore("farms", () => {
  // State
  const farms = ref([]);
  const currentFarm = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  // Getters
  const farmsCount = computed(() => farms.value.length);

  const getFarmById = computed(() => {
    return (id) => farms.value.find((f) => f.id === id);
  });

  const first = computed(() => (pagination.value.page - 1) * pagination.value.pageSize);

  // Actions
  async function fetchFarms(params = {}) {
    loading.value = true;
    error.value = null;

    try {
      const response = await farmsAPI.list({
        page_number: pagination.value.page,
        page_size: pagination.value.pageSize,
        ...params,
      });

      // Handle DRF paginated response
      if (response.data.results !== undefined) {
        farms.value = response.data.results;
        pagination.value.total = response.data.count || 0;
      } else {
        // Non-paginated response
        farms.value = response.data;
        pagination.value.total = response.data.length;
      }

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error fetching farms:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchFarm(id) {
    loading.value = true;
    error.value = null;

    try {
      const response = await farmsAPI.get(id);
      currentFarm.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error fetching farm:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchFarmHosts(id, params = {}) {
    loading.value = true;
    error.value = null;

    try {
      const response = await farmsAPI.hosts.list(id, params);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error fetching farm hosts:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateFarm(id, data) {
    loading.value = true;
    error.value = null;

    try {
      const response = await farmsAPI.update(id, data);
      const index = farms.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        farms.value[index] = response.data;
      }
      if (currentFarm.value?.id === id) {
        currentFarm.value = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error updating farm:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteFarm(id) {
    loading.value = true;
    error.value = null;

    try {
      await farmsAPI.delete(id);
      const index = farms.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        farms.value.splice(index, 1);
      }
      if (currentFarm.value?.id === id) {
        currentFarm.value = null;
      }
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error deleting farm:", err);
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
    farms,
    currentFarm,
    loading,
    error,
    pagination,

    // Getters
    farmsCount,
    getFarmById,
    first,

    // Actions
    fetchFarms,
    fetchFarm,
    fetchFarmHosts,
    updateFarm,
    deleteFarm,
    setPage,
    setPageSize,
  };
});
