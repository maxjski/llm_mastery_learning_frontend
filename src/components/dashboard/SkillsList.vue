<script setup lang="ts">
import { onMounted, ref as vueRef } from 'vue'
import { useTopicStore } from '@/stores/topicStore'
import { useComponentStore } from '@/stores/componentStore'
import { storeToRefs } from 'pinia'
import { ActiveComponentEnum } from '@/stores/componentStore'

const topicStore = useTopicStore()
const componentStore = useComponentStore()
const { skillList, error, loading: isLoading } = storeToRefs(topicStore)

onMounted(async () => {
  try {
    const topicId = componentStore.currentTopicId
    await topicStore.fetchSkills(topicId)
  } catch (error) {
    console.error('Failed to fetch skills')
    console.error(error)
  }
})

const showNewSkillModal = vueRef(false)
const newSkillName = vueRef('')

const createSkill = async () => {
  if (newSkillName.value.trim()) {
    try {
      // TODO: Implement createSkill in topicStore
      showNewSkillModal.value = false
      newSkillName.value = ''
    } catch {
      console.error('Failed to create skill')
    }
  }
}

const selectSkill = (id: number) => {
  // TODO: Implement skill selection logic
  console.log('Selected skill:', id)
}

const manageSkill = (id: number) => {
  console.log('Managing skill:', id)
  // TODO: Implement skill management logic
}

const deleteSkillHandler = async (skillId: number) => {
  if (confirm('Are you sure you want to delete this skill?')) {
    try {
      // TODO: Implement deleteSkill in topicStore
      console.log('Deleting skill:', skillId)
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }
}

const goBackToTopics = () => {
  componentStore.setActiveComponent(ActiveComponentEnum.Topics)
}
</script>

<template>
  <div class="skills">
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="topicStore.clearError">Dismiss</button>
    </div>

    <div v-if="isLoading" class="loading">Loading...</div>

    <div class="skills-header">
      <div class="header-left">
        <button @click="goBackToTopics" class="back-btn">
          ← Back to Topics
        </button>
        <h2>Skills</h2>
      </div>
      <button @click="showNewSkillModal = true" class="add-skill-btn">
        Add New Skill
      </button>
    </div>

    <ul>
      <li v-for="skill in skillList" :key="skill.id">
        <div class="skill-item">
          <h3 class="skill-title">{{ skill.name }}</h3>
          <div class="skill-actions">
            <button @click="selectSkill(skill.id)" class="study-btn">
              Study
            </button>
            <button @click="manageSkill(skill.id)" class="manage-btn">
              Manage
            </button>
            <button @click="deleteSkillHandler(skill.id)" class="delete-btn">
              Delete
            </button>
          </div>
        </div>
      </li>
    </ul>

    <!-- New Skill Modal -->
    <div v-if="showNewSkillModal" class="modal-overlay">
      <div class="modal">
        <h3>Create New Skill</h3>
        <input
          v-model="newSkillName"
          placeholder="Enter skill name"
          @keyup.enter="createSkill"
        />
        <div class="modal-actions">
          <button @click="createSkill" class="create-btn">Create</button>
          <button @click="showNewSkillModal = false" class="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skills {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;
}

.skills-header {
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

.add-skill-btn {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-skill-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

ul {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.skill-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.skill-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.skill-title {
  margin: 0;
  font-size: 1.25rem;
  color: #fff;
}

.skill-actions {
  display: flex;
  gap: 0.75rem;
}

.skill-actions button {
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
