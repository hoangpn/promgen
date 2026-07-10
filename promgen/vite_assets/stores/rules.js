import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { rulesAPI, servicesAPI, projectsAPI } from '../api';

export const useRulesStore = defineStore('rules', () => {
  // State
  const rules = ref([]);
  const currentRule = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  // Getters
  const rulesCount = computed(() => rules.value.length);
  
  const getRuleById = computed(() => {
    return (id) => rules.value.find(r => r.id === id);
  });

  const enabledRules = computed(() => rules.value.filter(r => r.enabled));
  const disabledRules = computed(() => rules.value.filter(r => !r.enabled));

  const first = computed(() => (pagination.value.page - 1) * pagination.value.pageSize);

  // Actions
  async function fetchRules(params = {}) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await rulesAPI.list({
        page_number: pagination.value.page,
        page_size: pagination.value.pageSize,
        ...params,
      });
      
      // Handle DRF paginated response
      if (response.data.results !== undefined) {
        rules.value = response.data.results;
        pagination.value.total = response.data.count || 0;
      } else {
        // Non-paginated response
        rules.value = response.data;
        pagination.value.total = response.data.length;
      }
      
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error('Error fetching rules:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchRule(id) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await rulesAPI.get(id);
      currentRule.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error('Error fetching rule:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateRule(id, data) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await rulesAPI.update(id, data);
      const index = rules.value.findIndex(r => r.id === id);
      if (index !== -1) {
        rules.value[index] = response.data;
      }
      if (currentRule.value?.id === id) {
        currentRule.value = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error('Error updating rule:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteRule(id) {
    loading.value = true;
    error.value = null;
    
    try {
      await rulesAPI.delete(id);
      const index = rules.value.findIndex(r => r.id === id);
      if (index !== -1) {
        rules.value.splice(index, 1);
      }
      if (currentRule.value?.id === id) {
        currentRule.value = null;
      }
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error('Error deleting rule:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createRuleForService(serviceId, data) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await servicesAPI.rules.create(serviceId, data);
      rules.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error('Error creating rule for service:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createRuleForProject(projectId, data) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await projectsAPI.rules.create(projectId, data);
      rules.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error('Error creating rule for project:', err);
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
    rules,
    currentRule,
    loading,
    error,
    pagination,
    
    // Getters
    rulesCount,
    getRuleById,
    enabledRules,
    disabledRules,
    first,
    
    // Actions
    fetchRules,
    fetchRule,
    updateRule,
    deleteRule,
    createRuleForService,
    createRuleForProject,
    setPage,
    setPageSize,
  };
});

