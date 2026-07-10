import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { exportersAPI } from "../api";

export const useExportersStore = defineStore("exporters", () => {
  // State
  const exporters = ref([]);
  const currentExporter = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  // Getters
  const exportersCount = computed(() => exporters.value.length);

  const getExporterById = computed(() => {
    return (id) => exporters.value.find((e) => e.id === id);
  });

  const first = computed(() => (pagination.value.page - 1) * pagination.value.pageSize);

  // Actions
  async function fetchExporters(params = {}) {
    loading.value = true;
    error.value = null;

    try {
      const response = await exportersAPI.list({
        page_number: pagination.value.page,
        page_size: pagination.value.pageSize,
        ...params,
      });

      // Handle DRF paginated response
      if (response.data.results !== undefined) {
        exporters.value = response.data.results;
        pagination.value.total = response.data.count || 0;
      } else {
        // Non-paginated response
        exporters.value = response.data;
        pagination.value.total = response.data.length;
      }

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error fetching exporters:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchExporter(id) {
    loading.value = true;
    error.value = null;

    try {
      const response = await exportersAPI.get(id);
      currentExporter.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error fetching exporter:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateExporter(id, data) {
    loading.value = true;
    error.value = null;

    try {
      const response = await exportersAPI.update(id, data);
      const index = exporters.value.findIndex((e) => e.id === id);
      if (index !== -1) {
        exporters.value[index] = response.data;
      }
      if (currentExporter.value?.id === id) {
        currentExporter.value = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error updating exporter:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteExporter(id) {
    loading.value = true;
    error.value = null;

    try {
      await exportersAPI.delete(id);
      const index = exporters.value.findIndex((e) => e.id === id);
      if (index !== -1) {
        exporters.value.splice(index, 1);
      }
      if (currentExporter.value?.id === id) {
        currentExporter.value = null;
      }
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error deleting exporter:", err);
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
    exporters,
    currentExporter,
    loading,
    error,
    pagination,

    // Getters
    exportersCount,
    getExporterById,
    first,

    // Actions
    fetchExporters,
    fetchExporter,
    updateExporter,
    deleteExporter,
    setPage,
    setPageSize,
  };
});
