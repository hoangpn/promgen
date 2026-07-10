<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores";
import promgenLogo from "../../assets/images/promgen_logo_color.png";

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
});


const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const searchQuery = ref("");
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);
const moreMenuOpen = ref(false);

// Computed properties
const userInitials = computed(() => {
  if (!props.user?.username) return "U";
  const names = props.user.username.split(" ");
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return props.user.username.substring(0, 2).toUpperCase();
});

const isAuthenticated = computed(() => !!props.user);

// Navigation items
const mainNavItems = [
  { name: "Services", path: "/services", icon: "pi-server" },
  { name: "Rules", path: "/rules", icon: "pi-list" },
  { name: "Groups", path: "/groups", icon: "pi-users" },
];

const moreNavItems = [
  { name: "Farms", path: "/farms", icon: "pi-sitemap" },
  { name: "URLs", path: "/urls", icon: "pi-link" },
  { name: "Shards", path: "/shards", icon: "pi-database" },
  { name: "Exporters", path: "/exporters", icon: "pi-upload" },
  { divider: true },
  { name: "Audit Logs", path: "/logs", icon: "pi-history" },
];

// Methods
const handleSearch = (e) => {
  e.preventDefault();
  if (searchQuery.value.trim()) {
    router.push({ name: "search", query: { q: searchQuery.value } });
    searchQuery.value = "";
    closeMobileMenu();
  }
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (mobileMenuOpen.value) {
    userMenuOpen.value = false;
    moreMenuOpen.value = false;
  }
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  userMenuOpen.value = false;
  moreMenuOpen.value = false;
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
  moreMenuOpen.value = false;
};

const toggleMoreMenu = () => {
  moreMenuOpen.value = !moreMenuOpen.value;
  userMenuOpen.value = false;
};

const isActiveRoute = (path) => {
  return route.path.startsWith(path);
};

const navigateTo = (path) => {
  router.push(path);
  closeMobileMenu();
};
</script>

<template>
  <nav class="app-navbar">
    <div class="navbar-container">
      <!-- Left Section: Brand -->
      <div class="navbar-left">

        <router-link to="/" class="navbar-brand" @click="closeMobileMenu">
          <div class="brand-icon">
            <img :src="promgenLogo" alt="Promgen Logo" />
          </div>
          <span class="brand-text">Promgen</span>
          <span class="brand-badge">v2</span>
        </router-link>
      </div>

      <!-- Center Section: Main Navigation (Desktop) -->
      <div v-if="isAuthenticated" class="navbar-center">
        <nav class="main-nav">
          <router-link
            v-for="item in mainNavItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: isActiveRoute(item.path) }"
          >
            <i :class="['pi', item.icon]"></i>
            <span>{{ item.name }}</span>
          </router-link>

          <!-- More Dropdown -->
          <div class="nav-item-dropdown">
            <button
              class="nav-item more-btn"
              :class="{ active: moreMenuOpen }"
              @click="toggleMoreMenu"
            >
              <i class="pi pi-ellipsis-h"></i>
              <span>More</span>
              <i class="pi pi-chevron-down dropdown-icon"></i>
            </button>

            <transition name="dropdown-fade">
              <div v-if="moreMenuOpen" class="dropdown-menu">
                <template v-for="(item, index) in moreNavItems" :key="index">
                  <hr v-if="item.divider" class="dropdown-divider" />
                  <button
                    v-else
                    class="dropdown-item"
                    :class="{ active: isActiveRoute(item.path) }"
                    @click="navigateTo(item.path)"
                  >
                    <i :class="['pi', item.icon]"></i>
                    <span>{{ item.name }}</span>
                  </button>
                </template>
              </div>
            </transition>
          </div>
        </nav>
      </div>

      <!-- Right Section: Search + User Menu -->
      <div class="navbar-right">
        <!-- Search Form -->
        <form v-if="isAuthenticated" class="search-form" @submit="handleSearch">
          <div class="search-input-wrapper">
            <i class="pi pi-search search-icon"></i>
            <input
              v-model="searchQuery"
              type="search"
              class="search-input"
              placeholder="Search services, projects..."
              aria-label="Search"
            />
          </div>
        </form>

        <!-- User Menu or Login -->
        <div v-if="isAuthenticated" class="user-menu-wrapper">
          <button class="user-menu-btn" @click="toggleUserMenu">
            <div class="user-avatar">
              <span>{{ userInitials }}</span>
            </div>
            <span class="user-name">{{ user.username }}</span>
            <i class="pi pi-chevron-down dropdown-icon"></i>
          </button>

          <transition name="dropdown-fade">
            <div v-if="userMenuOpen" class="dropdown-menu user-dropdown">
              <div class="dropdown-header">
                <div class="user-avatar large">
                  <span>{{ userInitials }}</span>
                </div>
                <div class="user-info">
                  <div class="user-info-name">{{ user.username }}</div>
                  <div class="user-info-email">
                    {{ user.email || "User Account" }}
                  </div>
                </div>
              </div>

              <hr class="dropdown-divider" />

              <button class="dropdown-item" @click="navigateTo('/profile')">
                <i class="pi pi-user"></i>
                <span>Profile</span>
              </button>

              <button
                v-if="user.is_superuser"
                class="dropdown-item"
                @click="navigateTo('/admin')"
              >
                <i class="pi pi-cog"></i>
                <span>Admin Panel</span>
              </button>

              <hr class="dropdown-divider" />

              <button class="dropdown-item logout-item" @click="handleLogout">
                <i class="pi pi-sign-out"></i>
                <span>Logout</span>
              </button>
            </div>
          </transition>
        </div>

        <router-link v-else to="/login" class="login-btn">
          <i class="pi pi-sign-in"></i>
          <span>Login</span>
        </router-link>

        <!-- Mobile Menu Toggle -->
        <button
          class="mobile-menu-toggle"
          :class="{ active: mobileMenuOpen }"
          aria-label="Toggle mobile menu"
          @click="toggleMobileMenu"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition name="mobile-menu-fade">
      <div
        v-if="mobileMenuOpen"
        class="mobile-menu-overlay"
        @click="closeMobileMenu"
      >
        <div class="mobile-menu" @click.stop>
          <div class="mobile-menu-header">
            <h3>Menu</h3>
            <button class="close-btn" @click="closeMobileMenu">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div class="mobile-menu-content">
            <!-- Search in Mobile -->
            <form
              v-if="isAuthenticated"
              class="mobile-search"
              @submit="handleSearch"
            >
              <div class="search-input-wrapper">
                <i class="pi pi-search search-icon"></i>
                <input
                  v-model="searchQuery"
                  type="search"
                  class="search-input"
                  placeholder="Search..."
                />
              </div>
            </form>

            <!-- User Info in Mobile -->
            <div v-if="isAuthenticated" class="mobile-user-info">
              <div class="user-avatar">
                <span>{{ userInitials }}</span>
              </div>
              <div class="user-details">
                <div class="user-name">{{ user.username }}</div>
                <div class="user-email">{{ user.email || "User Account" }}</div>
              </div>
            </div>

            <!-- Main Navigation -->
            <nav v-if="isAuthenticated" class="mobile-nav">
              <div class="mobile-nav-section">
                <h4 class="mobile-nav-title">Main</h4>
                <router-link
                  v-for="item in mainNavItems"
                  :key="item.path"
                  :to="item.path"
                  class="mobile-nav-item"
                  :class="{ active: isActiveRoute(item.path) }"
                  @click="closeMobileMenu"
                >
                  <i :class="['pi', item.icon]"></i>
                  <span>{{ item.name }}</span>
                  <i
                    v-if="isActiveRoute(item.path)"
                    class="pi pi-check active-check"
                  ></i>
                </router-link>
              </div>

              <div class="mobile-nav-section">
                <h4 class="mobile-nav-title">More</h4>
                <template v-for="(item, index) in moreNavItems" :key="index">
                  <hr v-if="item.divider" class="mobile-nav-divider" />
                  <router-link
                    v-else
                    :to="item.path"
                    class="mobile-nav-item"
                    :class="{ active: isActiveRoute(item.path) }"
                    @click="closeMobileMenu"
                  >
                    <i :class="['pi', item.icon]"></i>
                    <span>{{ item.name }}</span>
                    <i
                      v-if="isActiveRoute(item.path)"
                      class="pi pi-check active-check"
                    ></i>
                  </router-link>
                </template>
              </div>

              <div class="mobile-nav-section">
                <h4 class="mobile-nav-title">Account</h4>
                <button class="mobile-nav-item" @click="navigateTo('/profile')">
                  <i class="pi pi-user"></i>
                  <span>Profile</span>
                </button>

                <button
                  v-if="user.is_superuser"
                  class="mobile-nav-item"
                  @click="navigateTo('/admin')"
                >
                  <i class="pi pi-cog"></i>
                  <span>Admin Panel</span>
                </button>

                <button
                  class="mobile-nav-item logout-link"
                  @click="handleLogout"
                >
                  <i class="pi pi-sign-out"></i>
                  <span>Logout</span>
                </button>
              </div>
            </nav>

            <!-- Login for unauthenticated users -->
            <div v-else class="mobile-auth">
              <router-link
                to="/login"
                class="mobile-login-btn"
                @click="closeMobileMenu"
              >
                <i class="pi pi-sign-in"></i>
                <span>Login</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
/* ==================== Main Navbar ==================== */
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 1030;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  max-width: 100%;
  gap: 1rem;
}

/* ==================== Left Section ==================== */
.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}


/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 1.25rem;
}

.brand-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.brand-text {
  font-weight: 800;
  letter-spacing: -0.5px;
}

.brand-badge {
  padding: 0.125rem 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* ==================== Center Section ==================== */
.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 600px;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  transform: translateY(-1px);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-weight: 600;
}

.nav-item i {
  font-size: 1rem;
}

/* More Dropdown */
.nav-item-dropdown {
  position: relative;
}

.more-btn {
  position: relative;
}

.dropdown-icon {
  font-size: 0.75rem;
  transition: transform 0.3s ease;
}

.more-btn.active .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #374151;
  text-decoration: none;
  text-align: left;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: #f3f4f6;
  color: #1e3a8a;
}

.dropdown-item.active {
  background: #dbeafe;
  color: #1e3a8a;
  font-weight: 600;
}

.dropdown-item i {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.dropdown-divider {
  margin: 0.5rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

/* Dropdown Animations */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ==================== Right Section ==================== */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

/* Search Form */
.search-form {
  display: flex;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #6b7280;
  font-size: 0.9rem;
  pointer-events: none;
}

.search-input {
  width: 280px;
  padding: 0.625rem 1rem 0.625rem 2.75rem;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid transparent;
  border-radius: 10px;
  color: #1f2937;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  background: white;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
  width: 320px;
}

.search-input::placeholder {
  color: #9ca3af;
}

/* User Menu */
.user-menu-wrapper {
  position: relative;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-menu-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 8px;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
}

.user-avatar.large {
  width: 48px;
  height: 48px;
  font-size: 1.1rem;
  border-radius: 12px;
}

.user-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* User Dropdown */
.user-dropdown {
  right: 0;
  min-width: 280px;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-info-name {
  font-weight: 700;
  color: #1f2937;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-info-email {
  font-size: 0.8rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-item {
  color: #dc2626;
}

.logout-item:hover {
  background: #fee2e2;
  color: #b91c1c;
}

/* Login Button */
.login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 40px;
  height: 40px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-menu-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
}

.hamburger-line {
  width: 100%;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.mobile-menu-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ==================== Mobile Menu ==================== */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  display: none;
}

.mobile-menu {
  position: absolute;
  top: 0;
  right: 0;
  width: 90%;
  max-width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
}

.mobile-menu-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.mobile-menu-content {
  padding: 1.5rem;
}

/* Mobile Search */
.mobile-search {
  margin-bottom: 1.5rem;
}

.mobile-search .search-input {
  width: 100%;
}

/* Mobile User Info */
.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.mobile-user-info .user-avatar {
  width: 48px;
  height: 48px;
  font-size: 1.1rem;
  border-radius: 12px;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-details .user-name {
  font-weight: 700;
  color: #1f2937;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-details .user-email {
  font-size: 0.85rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Mobile Navigation */
.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-nav-title {
  margin: 0 0 0.75rem 0;
  padding: 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b7280;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #374151;
  text-decoration: none;
  text-align: left;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.mobile-nav-item:hover {
  background: #f3f4f6;
  color: #1e3a8a;
}

.mobile-nav-item.active {
  background: #dbeafe;
  color: #1e3a8a;
  font-weight: 600;
}

.mobile-nav-item i {
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
}

.active-check {
  margin-left: auto;
  color: #10b981;
  font-size: 1rem;
}

.mobile-nav-divider {
  margin: 0.5rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

.logout-link {
  color: #dc2626;
}

.logout-link:hover {
  background: #fee2e2;
  color: #b91c1c;
}

/* Mobile Auth */
.mobile-auth {
  padding: 1rem 0;
}

.mobile-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border: none;
  border-radius: 12px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.mobile-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
}

/* Mobile Menu Animations */
.mobile-menu-fade-enter-active,
.mobile-menu-fade-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-fade-enter-from,
.mobile-menu-fade-leave-to {
  opacity: 0;
}

.mobile-menu-fade-enter-from .mobile-menu,
.mobile-menu-fade-leave-to .mobile-menu {
  transform: translateX(100%);
}

/* ==================== Responsive Design ==================== */
@media (max-width: 991px) {
  .navbar-center {
    display: none;
  }

  .search-form {
    display: none;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .mobile-menu-overlay {
    display: block;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0.625rem 1rem;
  }

  .brand-text {
    display: none;
  }

  .brand-badge {
    display: none;
  }

  .user-name {
    display: none;
  }

  .dropdown-icon {
    display: none;
  }
}

@media (max-width: 576px) {
  .navbar-container {
    padding: 0.5rem 0.75rem;
  }

  .mobile-menu-toggle {
    width: 36px;
    height: 36px;
  }

  .brand-icon {
    width: 32px;
    height: 32px;
    font-size: 1.1rem;
  }

  .brand-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }

  .mobile-menu {
    width: 100%;
    max-width: 100%;
  }
}

/* ==================== Accessibility ==================== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus states */
button:focus-visible,
a:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .app-navbar {
    display: none;
  }
}
</style>
