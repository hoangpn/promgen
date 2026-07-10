<script setup>
</script>

<template>
  <div class="home-dashboard">
    <!-- Header -->
    <div class="dashboard-header mb-4">
      <div>
        <h1 class="mb-2">
          <i class="pi pi-home me-2"></i>
          Welcome to <strong>Promgen</strong>
        </h1>
        <p class="text-muted mb-0">
          Prometheus configuration and alert rule management platform.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  color: white;
  margin: 0;
}

.dashboard-header .text-muted {
  color: rgba(255, 255, 255, 0.9) !important;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-0 {
  margin-bottom: 0;
}

.me-2 {
  margin-right: 0.5rem;
}

.text-muted {
  color: #6c757d;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-header {
    padding: 1.5rem;
  }
}
</style>
