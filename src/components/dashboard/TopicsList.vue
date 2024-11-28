<script setup lang="ts">
import { onMounted, ref as vueRef } from 'vue'
import { useTopicStore } from '@/stores/topicStore'
import { useComponentStore } from '@/stores/componentStore'
import { storeToRefs } from 'pinia'
import { ActiveComponentEnum } from '@/stores/componentStore'

const topicStore = useTopicStore()
const componentStore = useComponentStore()
const { topicList, error, isLoading } = storeToRefs(topicStore)

onMounted(async () => {
  try {
    const courseId = componentStore.currentCourseId
    await topicStore.fetchTopics(courseId)
  } catch (error) {
    console.error('Failed to fetch topics')
    console.error(error)
  }
})

const showNewTopicModal = vueRef(false)
const newTopicName = vueRef('')

const createTopic = async () => {
  if (newTopicName.value.trim()) {
    try {
      await topicStore.createTopic({
        name: newTopicName.value.trim(),
        courseId: componentStore.currentCourseId,
      })
      showNewTopicModal.value = false
      newTopicName.value = ''
    } catch {
      console.error('Failed to create topic')
    }
  }
}

const selectTopic = (id: number) => {
  componentStore.setCurrentTopicId(id)
  componentStore.setActiveComponent(ActiveComponentEnum.Skills)
}

const manageTopic = (id: number) => {
  console.log('Managing topic:', id)
  // TODO: Implement topic management logic
}

const deleteTopicHandler = async (topicId: number) => {
  if (confirm('Are you sure you want to delete this topic?')) {
    try {
      await topicStore.deleteTopic(topicId)
    } catch (error) {
      console.error('Error deleting topic:', error)
    }
  }
}

const goBackToCourses = () => {
  componentStore.setActiveComponent(ActiveComponentEnum.Courses)
}
</script>

<template>
  <div class="topics">
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="topicStore.clearError">Dismiss</button>
    </div>

    <div v-if="isLoading" class="loading">Loading...</div>

    <div class="topics-header">
      <div class="header-left">
        <button @click="goBackToCourses" class="back-btn">
          ← Back to Courses
        </button>
        <h2>Topics</h2>
      </div>
      <button @click="showNewTopicModal = true" class="add-topic-btn">
        Add New Topic
      </button>
    </div>

    <ul>
      <li v-for="topic in topicList" :key="topic.id">
        <div class="topic-item">
          <h3 class="topic-title">{{ topic.name }}</h3>
          <div class="topic-actions">
            <button @click="selectTopic(topic.id)" class="study-btn">
              See Skills
            </button>
            <button @click="manageTopic(topic.id)" class="manage-btn">
              Manage
            </button>
            <button @click="deleteTopicHandler(topic.id)" class="delete-btn">
              Delete
            </button>
          </div>
        </div>
      </li>
    </ul>

    <!-- New Topic Modal -->
    <div v-if="showNewTopicModal" class="modal-overlay">
      <div class="modal">
        <h3>Create New Topic</h3>
        <input
          v-model="newTopicName"
          placeholder="Enter topic name"
          @keyup.enter="createTopic"
        />
        <div class="modal-actions">
          <button @click="createTopic" class="create-btn">Create</button>
          <button @click="showNewTopicModal = false" class="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.topics {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;
}

.topics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  background: transparent;
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(59, 130, 246, 0.1);
}

h2 {
  font-size: 2rem;
  margin: 0;
}

.add-topic-btn {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-topic-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

ul {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.topic-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.topic-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.topic-title {
  margin: 0;
  font-size: 1.25rem;
  color: #fff;
}

.topic-actions {
  display: flex;
  gap: 0.75rem;
}

.topic-actions button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.study-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.study-btn:hover {
  background: #2563eb;
}

.manage-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.manage-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.delete-btn {
  background: transparent;
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: #1e1e1e;
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #fff;
}

.modal input {
  width: 100%;
  background: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.875rem 1rem;
  color: #fff;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
}

.modal input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-actions button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.create-btn:hover {
  background: #2563eb;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message button {
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.error-message button:hover {
  background: rgba(239, 68, 68, 0.1);
}

.loading {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  padding: 2rem;
  font-size: 1.1rem;
}
</style>
