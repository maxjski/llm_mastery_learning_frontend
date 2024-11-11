<script setup lang="ts">
import CreateTopic from '@/components/dashboard/CreateTopic.vue'
import TopicDraftEditor from '@/components/dashboard/TopicDraftEditor.vue'
import CoursesList from '@/components/dashboard/CoursesList.vue'
import Examination from '@/components/dashboard/Examination.vue'
import { useComponentStore, ActiveComponentEnum } from '@/stores/componentStore'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { TopicDraft } from '@/types'

const componentStore = useComponentStore()
const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/auth')
}

const handleDraftGenerated = (draft: TopicDraft) => {
  componentStore.setCurrentDraft(draft)
}
</script>

<template>
  <div class="dashboard">
    <header>
      <nav>
        <button
          @click="
            componentStore.setActiveComponent(ActiveComponentEnum.Courses)
          "
        >
          Courses
        </button>
        <button
          @click="componentStore.setCurrentDraft(null)"
          :class="{
            active:
              componentStore.getActiveComponent !== ActiveComponentEnum.Courses,
          }"
        >
          Create Topic
        </button>
      </nav>
      <button @click="logout" class="logout-btn">Logout</button>
    </header>

    <main>
      <CreateTopic
        v-if="
          componentStore.getActiveComponent === ActiveComponentEnum.Generate
        "
        @draft-generated="handleDraftGenerated"
      />
      <Examination
        v-if="
          componentStore.getActiveComponent === ActiveComponentEnum.Examination
        "
      />
      <TopicDraftEditor
        v-if="
          componentStore.getActiveComponent === ActiveComponentEnum.EditDraft
        "
        :draft="componentStore.getCurrentDraft!"
      />
      <CoursesList
        v-if="componentStore.getActiveComponent === ActiveComponentEnum.Courses"
      />
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

nav button.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}
</style>
