/**
 * Promgen API Endpoints
 * 
 * All REST API v2 endpoint integrations
 */

import { api, buildQueryString } from './client.js';

// ========== Services ==========

export const servicesAPI = {
  /**
   * List all services
   * @param {Object} params - Query parameters {name, page_number, page_size}
   */
  list: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/services${query ? '?' + query : ''}`);
  },

  /**
   * Get service detail
   * @param {number} id - Service ID
   */
  get: (id) => api.get(`/services/${id}`),

  /**
   * Create new service
   * @param {Object} data - {name, description, owner}
   */
  create: (data) => api.post('/services', data),

  /**
   * Update service
   * @param {number} id - Service ID
   * @param {Object} data - Service data
   */
  update: (id, data) => api.put(`/services/${id}`, data),

  /**
   * Partially update service
   * @param {number} id - Service ID
   * @param {Object} data - Partial service data
   */
  partialUpdate: (id, data) => api.patch(`/services/${id}`, data),

  /**
   * Delete service
   * @param {number} id - Service ID
   */
  delete: (id) => api.delete(`/services/${id}`),

  // Service sub-resources
  users: {
    list: (id, params = {}) => {
      const query = buildQueryString(params);
      return api.get(`/services/${id}/users${query ? '?' + query : ''}`);
    },
    assign: (id, data) => api.post(`/services/${id}/users`, data),
    remove: (id, userId, params = {}) => {
      const query = buildQueryString(params);
      return api.delete(`/services/${id}/users/${userId}${query ? '?' + query : ''}`);
    },
  },

  groups: {
    list: (id, params = {}) => {
      const query = buildQueryString(params);
      return api.get(`/services/${id}/groups${query ? '?' + query : ''}`);
    },
    assign: (id, data) => api.post(`/services/${id}/groups`, data),
    remove: (id, groupId, params = {}) => {
      const query = buildQueryString(params);
      return api.delete(`/services/${id}/groups/${groupId}${query ? '?' + query : ''}`);
    },
  },

  notifiers: {
    create: (id, data) => api.post(`/services/${id}/notifiers`, data),
  },

  rules: {
    create: (id, data) => api.post(`/services/${id}/rules`, data),
  },

  projects: {
    create: (id, data) => api.post(`/services/${id}/project`, data),
  },
};

// ========== Projects ==========

export const projectsAPI = {
  list: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/projects${query ? '?' + query : ''}`);
  },

  get: (id) => api.get(`/projects/${id}`),

  update: (id, data) => api.put(`/projects/${id}`, data),

  partialUpdate: (id, data) => api.patch(`/projects/${id}`, data),

  delete: (id) => api.delete(`/projects/${id}`),

  // Project sub-resources
  users: {
    list: (id, params = {}) => {
      const query = buildQueryString(params);
      return api.get(`/projects/${id}/users${query ? '?' + query : ''}`);
    },
    assign: (id, data) => api.post(`/projects/${id}/users`, data),
    remove: (id, userId, params = {}) => {
      const query = buildQueryString(params);
      return api.delete(`/projects/${id}/users/${userId}${query ? '?' + query : ''}`);
    },
  },

  groups: {
    list: (id, params = {}) => {
      const query = buildQueryString(params);
      return api.get(`/projects/${id}/groups${query ? '?' + query : ''}`);
    },
    assign: (id, data) => api.post(`/projects/${id}/groups`, data),
    remove: (id, groupId, params = {}) => {
      const query = buildQueryString(params);
      return api.delete(`/projects/${id}/groups/${groupId}${query ? '?' + query : ''}`);
    },
  },

  notifiers: {
    create: (id, data) => api.post(`/projects/${id}/notifiers`, data),
  },

  rules: {
    create: (id, data) => api.post(`/projects/${id}/rules`, data),
  },

  exporters: {
    create: (id, data) => api.post(`/projects/${id}/exporters`, data),
  },

  farms: {
    create: (id, data) => api.post(`/projects/${id}/farms`, data),
  },

  urls: {
    create: (id, data) => api.post(`/projects/${id}/urls`, data),
  },
};

// ========== Rules ==========

export const rulesAPI = {
  list: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/rules${query ? '?' + query : ''}`);
  },

  get: (id) => api.get(`/rules/${id}`),

  update: (id, data) => api.put(`/rules/${id}`, data),

  partialUpdate: (id, data) => api.patch(`/rules/${id}`, data),

  delete: (id) => api.delete(`/rules/${id}`),
};

// ========== Exporters ==========

export const exportersAPI = {
  list: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/exporters${query ? '?' + query : ''}`);
  },

  get: (id) => api.get(`/exporters/${id}`),

  update: (id, data) => api.put(`/exporters/${id}`, data),

  partialUpdate: (id, data) => api.patch(`/exporters/${id}`, data),

  delete: (id) => api.delete(`/exporters/${id}`),
};

// ========== Farms ==========

export const farmsAPI = {
  list: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/farms${query ? '?' + query : ''}`);
  },

  get: (id) => api.get(`/farms/${id}`),

  update: (id, data) => api.put(`/farms/${id}`, data),

  partialUpdate: (id, data) => api.patch(`/farms/${id}`, data),

  delete: (id) => api.delete(`/farms/${id}`),

  convertToLocal: (id) => api.post(`/farms/${id}/convert-to-local`),

  sync: (id) => api.post(`/farms/${id}/sync`),

  hosts: {
    list: (id, params = {}) => {
      const query = buildQueryString(params);
      return api.get(`/farms/${id}/hosts${query ? '?' + query : ''}`);
    },
    create: (id, data) => api.post(`/farms/${id}/hosts`, data),
    delete: (id, hostId) => api.delete(`/farms/${id}/hosts/${hostId}`),
  },

  // Farm sources and remotes
  sources: {
    list: (params = {}) => {
      const query = buildQueryString(params);
      return api.get(`/farms/sources${query ? '?' + query : ''}`);
    },
  },

  remotes: {
    list: (source, params = {}) => {
      const query = buildQueryString(params);
      return api.get(`/farms/remotes/${source}${query ? '?' + query : ''}`);
    },
  },
};

// ========== Notifiers ==========

export const notifiersAPI = {
  list: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/notifiers${query ? '?' + query : ''}`);
  },

  get: (id) => api.get(`/notifiers/${id}`),

  update: (id, data) => api.put(`/notifiers/${id}`, data),

  partialUpdate: (id, data) => api.patch(`/notifiers/${id}`, data),

  delete: (id) => api.delete(`/notifiers/${id}`),

  createForService: (serviceId, data) => api.post(`/services/${serviceId}/notifiers`, data),

  createForProject: (projectId, data) => api.post(`/projects/${projectId}/notifiers`, data),

  createForUser: (data) => api.post(`/users/me/notifiers`, data),

  getTypes: () => api.get('/notifiers/types'),

  filters: {
    create: (id, data) => api.post(`/notifiers/${id}/filters`, data),
    delete: (id, filterId) => api.delete(`/notifiers/${id}/filters/${filterId}`),
  },
};

// ========== Groups ==========

export const groupsAPI = {
  list: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/groups${query ? '?' + query : ''}`);
  },

  get: (id) => api.get(`/groups/${id}`),

  create: (data) => api.post('/groups', data),

  update: (id, data) => api.put(`/groups/${id}`, data),

  partialUpdate: (id, data) => api.patch(`/groups/${id}`, data),

  delete: (id) => api.delete(`/groups/${id}`),

  members: {
    list: (id, params = {}) => {
      const query = buildQueryString(params);
      return api.get(`/groups/${id}/members${query ? '?' + query : ''}`);
    },
    add: (id, data) => api.post(`/groups/${id}/members`, data),
    update: (id, userId, data) => api.put(`/groups/${id}/members/${userId}`, data),
    remove: (id, userId) => api.delete(`/groups/${id}/members/${userId}`),
  },

  resources: {
    list: (id, params = {}) => {
      const query = buildQueryString(params);
      return api.get(`/groups/${id}/resources${query ? '?' + query : ''}`);
    },
  },
};

// ========== Users ==========

export const usersAPI = {
  list: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/users${query ? '?' + query : ''}`);
  },

  me: {
    get: () => api.get('/users/me'),
    notifiers: {
      create: (data) => api.post('/users/me/notifiers', data),
    },
  },
};

// ========== Shards ==========

export const shardsAPI = {
  list: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/shards${query ? '?' + query : ''}`);
  },

  get: (id) => api.get(`/shards/${id}`),
};

// ========== URLs ==========

export const urlsAPI = {
  list: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/urls${query ? '?' + query : ''}`);
  },

  delete: (id) => api.delete(`/urls/${id}`),
};

// ========== Probes ==========

export const probesAPI = {
  list: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/probes${query ? '?' + query : ''}`);
  },
};

// ========== Sites ==========

export const sitesAPI = {
  me: () => api.get('/sites/me'),

  rules: {
    create: (id, data) => api.post(`/sites/${id}/rules`, data),
  },
};

// ========== Audit Logs ==========

export const logsAPI = {
  list: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/logs${query ? '?' + query : ''}`);
  },
};

// Export all as a single object
export const promgenAPI = {
  services: servicesAPI,
  projects: projectsAPI,
  rules: rulesAPI,
  exporters: exportersAPI,
  farms: farmsAPI,
  notifiers: notifiersAPI,
  groups: groupsAPI,
  users: usersAPI,
  shards: shardsAPI,
  urls: urlsAPI,
  probes: probesAPI,
  sites: sitesAPI,
  logs: logsAPI,
};

export default promgenAPI;

