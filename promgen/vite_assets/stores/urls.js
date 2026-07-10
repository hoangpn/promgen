import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { urlsAPI } from "../api";

export const useUrlsStore = defineStore("urls", () => {
  // State
  const urls = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  // Getters
  const urlsCount = computed(() => urls.value.length);

  const first = computed(() => (pagination.value.page - 1) * pagination.value.pageSize);

  // Actions
  async function fetchUrls(params = {}) {
    loading.value = true;
    error.value = null;

    try {
      const response = await urlsAPI.list({
        page_number: pagination.value.page,
        page_size: pagination.value.pageSize,
        ...params,
      });

      // Handle DRF paginated response
      if (response.data.results !== undefined) {
        urls.value = response.data.results;
        pagination.value.total = response.data.count || 0;
      } else {
        // Non-paginated response
        urls.value = response.data;
        pagination.value.total = response.data.length;
      }

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error fetching URLs:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteUrl(id) {
    loading.value = true;
    error.value = null;

    try {
      await urlsAPI.delete(id);
      const index = urls.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        urls.value.splice(index, 1);
      }
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error deleting URL:", err);
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
    urls,
    loading,
    error,
    pagination,

    // Getters
    urlsCount,
    first,

    // Actions
    fetchUrls,
    deleteUrl,
    setPage,
    setPageSize,
  };
});
