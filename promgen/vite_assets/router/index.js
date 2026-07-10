import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Demo from '../views/Demo.vue';
import ServicesList from '../views/ServicesList.vue';
import ServiceDetail from '../views/ServiceDetail.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { title: 'Dashboard' },
    },
    {
      path: '/demo',
      name: 'demo',
      component: Demo,
      meta: { title: 'Demo' },
    },
    
    // Services
    {
      path: '/services',
      name: 'services',
      component: ServicesList,
      meta: { title: 'Services' },
    },
    {
      path: '/services/:id',
      name: 'service-detail',
      component: ServiceDetail,
      meta: { title: 'Service Detail' },
    },
    {
      path: '/services/new',
      name: 'service-create',
      component: () => import('../views/ServiceForm.vue'),
      meta: { title: 'Register Service' },
    },
    {
      path: '/services/:id/edit',
      name: 'service-edit',
      component: () => import('../views/ServiceForm.vue'),
      meta: { title: 'Edit Service' },
    },
    
    // Projects
    {
      path: '/projects/new',
      name: 'project-create',
      component: () => import('../views/ProjectForm.vue'),
      meta: { title: 'Register Project' },
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: () => import('../views/ProjectDetail.vue'),
      meta: { title: 'Project Detail' },
    },
    {
      path: '/projects/:id/edit',
      name: 'project-edit',
      component: () => import('../views/ProjectForm.vue'),
      meta: { title: 'Edit Project' },
    },
    
    // Rules
    {
      path: '/rules',
      name: 'rules',
      component: () => import('../views/RulesList.vue'),
      meta: { title: 'Rules' },
    },
    {
      path: '/rules/new',
      name: 'rule-create',
      component: () => import('../views/RuleForm.vue'),
      meta: { title: 'Register Rule' },
    },
    {
      path: '/rules/:id',
      name: 'rule-detail',
      component: () => import('../views/RuleDetail.vue'),
      meta: { title: 'Rule Detail' },
    },
    {
      path: '/rules/:id/edit',
      name: 'rule-edit',
      component: () => import('../views/RuleForm.vue'),
      meta: { title: 'Edit Rule' },
    },
    
    // Exporters
    {
      path: '/exporters',
      name: 'exporters',
      component: () => import('../views/ExportersList.vue'),
      meta: { title: 'Exporters' },
    },
    
    // Notifiers
    {
      path: '/notifiers/new',
      name: 'notifier-create',
      component: () => import('../views/NotifierForm.vue'),
      meta: { title: 'Register Notifier' },
    },
    {
      path: '/notifiers/:id/edit',
      name: 'notifier-edit',
      component: () => import('../views/NotifierForm.vue'),
      meta: { title: 'Edit Notifier' },
    },
    
    // Farms
    {
      path: '/farms',
      name: 'farms',
      component: () => import('../views/FarmsList.vue'),
      meta: { title: 'Farms' },
    },
    {
      path: '/farms/:id',
      name: 'farm-detail',
      component: () => import('../views/FarmDetail.vue'),
      meta: { title: 'Farm Detail' },
    },
    
    // URLs
    {
      path: '/urls',
      name: 'urls',
      component: () => import('../views/URLsList.vue'),
      meta: { title: 'URLs' },
    },
    
    // Groups
    {
      path: '/groups',
      name: 'groups',
      component: () => import('../views/GroupsList.vue'),
      meta: { title: 'Groups' },
    },
    {
      path: '/groups/:id',
      name: 'group-detail',
      component: () => import('../views/GroupDetail.vue'),
      meta: { title: 'Group Detail' },
    },
    
    // Shards
    {
      path: '/shards',
      name: 'shards',
      component: () => import('../views/ShardsList.vue'),
      meta: { title: 'Shards' },
    },
    {
      path: '/shards/:id',
      name: 'shard-detail',
      component: () => import('../views/ShardDetail.vue'),
      meta: { title: 'Shard Detail' },
    },
    
    // Audit Logs
    {
      path: '/logs',
      name: 'logs',
      component: () => import('../views/AuditLogs.vue'),
      meta: { title: 'Audit Logs' },
    },
    
    // Profile
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { title: 'Profile' },
    },
    
    // Search
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/Search.vue'),
      meta: { title: 'Search' },
    },
    
    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      meta: { title: '404 Not Found' },
    },
  ],
});

// Update page title on route change
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - Promgen` : 'Promgen';
});

export default router;
