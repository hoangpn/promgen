import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { shardsAPI } from "../api";

export const useShardsStore = defineStore("shards", () => {
  // State
  const shards = ref([]);
  const currentShard = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  // Getters
  const shardsCount = computed(() => shards.value.length);

  const getShardById = computed(() => {
    return (id) => shards.value.find((s) => s.id === id);
  });

  const first = computed(() => (pagination.value.page - 1) * pagination.value.pageSize);

  // Actions
  async function fetchShards(params = {}) {
    loading.value = true;
    error.value = null;

    try {
      const response = await shardsAPI.list({
        page_number: pagination.value.page,
        page_size: pagination.value.pageSize,
        ...params,
      });

      // Handle DRF paginated response
      if (response.data.results !== undefined) {
        shards.value = response.data.results;
        pagination.value.total = response.data.count || 0;
      } else {
        // Non-paginated response
        shards.value = response.data;
        pagination.value.total = response.data.length;
      }

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error fetching shards:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchShard(id) {
    loading.value = true;
    error.value = null;

    try {
      const response = await shardsAPI.get(id);
      currentShard.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error fetching shard:", err);
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
    shards,
    currentShard,
    loading,
    error,
    pagination,

    // Getters
    shardsCount,
    getShardById,
    first,

    // Actions
    fetchShards,
    fetchShard,
    setPage,
    setPageSize,
  };
});
