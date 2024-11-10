<script setup lang="ts">
import CreateTopic from '@/components/dashboard/CreateTopic.vue'
import { useComponentStore, ActiveComponentEnum } from '@/stores/componentStore'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const componentStore = useComponentStore()
const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/auth')
}
</script>

<template>
  <div class="dashboard">
    <header>
      <nav>
        <button
          @click="componentStore.setActiveComponent(ActiveComponentEnum.Decks)"
        >
          Decks
        </button>
        <button
          @click="
            componentStore.setActiveComponent(ActiveComponentEnum.Generate)
          "
        >
          Create Topic
        </button>
      </nav>
      <button @click="logout" class="logout-btn">Logout</button>
    </header>

    <main>
      <CreateTopic />
    </main>
  </div>
</template>

<style>
/* Global styles */
body {
  background-color: #121212;
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #e0e0e0;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c2c2c;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

nav {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #e0e0e0;
  background-color: rgba(255, 255, 255, 0.05);
}

button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

nav button {
  background-color: transparent;
  color: #a0a0a0;
}

nav button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.logout-btn {
  background-color: transparent;
  color: #a0a0a0;
}

.logout-btn:hover {
  background-color: rgba(255, 0, 0, 0.1);
  color: #ff4d4d;
  border-color: rgba(255, 0, 0, 0.2);
}

main {
  background-color: #2c2c2c;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
