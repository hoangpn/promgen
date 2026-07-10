import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { projectsAPI, servicesAPI } from '../api';

export const useProjectsStore = defineStore('projects', () => {
  // State
  const projects = ref([]);
  const currentProject = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  // Getters
  const projectsCount = computed(() => projects.value.length);
  
  const getProjectById = computed(() => {
    return (id) => projects.value.find(p => p.id === id);
  });

  const projectsByService = computed(() => {
    return (serviceId) => projects.value.filter(p => p.service?.id === serviceId);
  });

  const first = computed(() => (pagination.value.page - 1) * pagination.value.pageSize);

  // Actions
  async function fetchProjects(params = {}) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await projectsAPI.list({
        page_number: pagination.value.page,
        page_size: pagination.value.pageSize,
        ...params,
      });
      
      // Handle DRF paginated response
      if (response.data.results !== undefined) {
        projects.value = response.data.results;
        pagination.value.total = response.data.count || 0;
      } else {
        // Non-paginated response
        projects.value = response.data;
        pagination.value.total = response.data.length;
      }
      
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error('Error fetching projects:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchProject(id) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await projectsAPI.get(id);
      currentProject.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error('Error fetching project:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createProject(serviceId, data) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await servicesAPI.projects.create(serviceId, data);
      projects.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error('Error creating project:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateProject(id, data) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await projectsAPI.update(id, data);
      const index = projects.value.findIndex(p => p.id === id);
      if (index !== -1) {
        projects.value[index] = response.data;
      }
      if (currentProject.value?.id === id) {
        currentProject.value = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error('Error updating project:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteProject(id) {
    loading.value = true;
    error.value = null;
    
    try {
      await projectsAPI.delete(id);
      const index = projects.value.findIndex(p => p.id === id);
      if (index !== -1) {
        projects.value.splice(index, 1);
      }
      if (currentProject.value?.id === id) {
        currentProject.value = null;
      }
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error('Error deleting project:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchProjectUsers(id, params = {}) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await projectsAPI.users.list(id, params);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error('Error fetching project users:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchProjectGroups(id, params = {}) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await projectsAPI.groups.list(id, params);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message;
      console.error('Error fetching project groups:', err);
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
    projects,
    currentProject,
    loading,
    error,
    pagination,
    
    // Getters
    projectsCount,
    getProjectById,
    projectsByService,
    first,
    
    // Actions
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    fetchProjectUsers,
    fetchProjectGroups,
    setPage,
    setPageSize,
  };
});

