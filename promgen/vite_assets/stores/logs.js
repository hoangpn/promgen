import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { logsAPI } from "../api";

export const useLogsStore = defineStore("logs", () => {
  // State
  const logs = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  // Getters
  const logsCount = computed(() => logs.value.length);

  const first = computed(() => (pagination.value.page - 1) * pagination.value.pageSize);

  // Actions
  async function fetchLogs(params = {}) {
    loading.value = true;
    error.value = null;

    try {
      const response = await logsAPI.list({
        page_number: pagination.value.page,
        page_size: pagination.value.pageSize,
        ...params,
      });

      // Handle DRF paginated response
      if (response.data.results !== undefined) {
        logs.value = response.data.results;
        pagination.value.total = response.data.count || 0;
      } else {
        // Non-paginated response
        logs.value = response.data;
        pagination.value.total = response.data.length;
      }

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error fetching logs:", err);
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
    logs,
    loading,
    error,
    pagination,

    // Getters
    logsCount,
    first,

    // Actions
    fetchLogs,
    setPage,
    setPageSize,
  };
});
