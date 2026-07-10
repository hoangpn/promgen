import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { groupsAPI } from "../api";

export const useGroupsStore = defineStore("groups", () => {
  // State
  const groups = ref([]);
  const currentGroup = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  // Getters
  const groupsCount = computed(() => groups.value.length);

  const getGroupById = computed(() => {
    return (id) => groups.value.find((g) => g.id === id);
  });

  const first = computed(() => (pagination.value.page - 1) * pagination.value.pageSize);

  // Actions
  async function fetchGroups(params = {}) {
    loading.value = true;
    error.value = null;

    try {
      const response = await groupsAPI.list({
        page_number: pagination.value.page,
        page_size: pagination.value.pageSize,
        ...params,
      });

      // Handle DRF paginated response
      if (response.data.results !== undefined) {
        groups.value = response.data.results;
        pagination.value.total = response.data.count || 0;
      } else {
        // Non-paginated response
        groups.value = response.data;
        pagination.value.total = response.data.length;
      }

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error fetching groups:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchGroup(id) {
    loading.value = true;
    error.value = null;

    try {
      const response = await groupsAPI.get(id);
      currentGroup.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error fetching group:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createGroup(data) {
    loading.value = true;
    error.value = null;

    try {
      const response = await groupsAPI.create(data);
      groups.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error creating group:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateGroup(id, data) {
    loading.value = true;
    error.value = null;

    try {
      const response = await groupsAPI.update(id, data);
      const index = groups.value.findIndex((g) => g.id === id);
      if (index !== -1) {
        groups.value[index] = response.data;
      }
      if (currentGroup.value?.id === id) {
        currentGroup.value = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error updating group:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteGroup(id) {
    loading.value = true;
    error.value = null;

    try {
      await groupsAPI.delete(id);
      const index = groups.value.findIndex((g) => g.id === id);
      if (index !== -1) {
        groups.value.splice(index, 1);
      }
      if (currentGroup.value?.id === id) {
        currentGroup.value = null;
      }
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error("Error deleting group:", err);
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
    groups,
    currentGroup,
    loading,
    error,
    pagination,

    // Getters
    groupsCount,
    getGroupById,
    first,

    // Actions
    fetchGroups,
    fetchGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    setPage,
    setPageSize,
  };
});
