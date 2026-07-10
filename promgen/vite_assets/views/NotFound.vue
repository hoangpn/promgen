<script setup>
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Card from 'primevue/card';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="not-found">
    <Card>
      <template #content>
        <div class="text-center py-5">
          <i class="pi pi-exclamation-triangle" style="font-size: 4rem; color: #dc3545"></i>
          <h1 class="mt-4">404 - Page Not Found</h1>
          <p class="text-muted mb-4">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div class="d-flex gap-2 justify-content-center">
            <Button
              label="Go Home"
              icon="pi pi-home"
              @click="goHome"
            />
            <Button
              label="Go Back"
              icon="pi pi-arrow-left"
              severity="secondary"
              @click="goBack"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 600px;
  margin: 50px auto;
}
</style>

