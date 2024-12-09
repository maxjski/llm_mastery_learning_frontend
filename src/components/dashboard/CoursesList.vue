<script setup lang="ts">
import { onMounted, ref as vueRef } from 'vue'
import { useCourseStore } from '../../stores/courseStore'
import { storeToRefs } from 'pinia'
import { useComponentStore } from '@/stores/componentStore'
import { ActiveComponentEnum } from '@/stores/componentStore'

const courseStore = useCourseStore()
const componentStore = useComponentStore()

const { courseList, error, isLoading } = storeToRefs(courseStore)

onMounted(async () => {
  try {
    await courseStore.fetchCourses()
  } catch (error) {
    console.error('Failed to fetch courses')
    console.error(error)
  }
})

const showNewCourseModal = vueRef(false)
const newCourseName = vueRef('')

const createCourse = async () => {
  if (newCourseName.value.trim()) {
    try {
      await courseStore.createCourse({
        name: newCourseName.value.trim(),
      })
      showNewCourseModal.value = false
      newCourseName.value = ''
    } catch {
      console.error('Failed to create course')
    }
  }
}

const selectCourse = (id: number) => {
  componentStore.setCurrentCourseId(id)
  componentStore.setActiveComponent(ActiveComponentEnum.Topics)
}

const manageCourse = (id: number) => {
  console.log('Managing course:', id)
  // TODO: Implement course management logic
}

const deleteCourseHandler = async (courseId: number) => {
  if (confirm('Are you sure you want to delete this course?')) {
    try {
      await courseStore.deleteCourse(courseId)
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }
}
</script>

<template>
  <div class="courses">
    <!-- Add error display -->
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="courseStore.clearError">Dismiss</button>
    </div>

    <!-- Add loading state -->
    <div v-if="isLoading" class="loading">Loading...</div>

    <div class="courses-header">
      <h2>Your Courses</h2>
      <button @click="showNewCourseModal = true" class="add-course-btn">
        Add New Course
      </button>
    </div>

    <ul>
      <li v-for="course in courseList" :key="course.id">
        <div class="course-item">
          <h3 class="course-title">{{ course.name }}</h3>
          <div class="course-actions">
            <button @click="selectCourse(course.id)" class="revise-btn">
              See Topics
            </button>
            <button @click="manageCourse(course.id)" class="manage-btn">
              Manage
            </button>
            <button @click="deleteCourseHandler(course.id)" class="delete-btn">
              Delete
            </button>
          </div>
        </div>
      </li>
    </ul>

    <!-- New Course Modal -->
    <div v-if="showNewCourseModal" class="modal-overlay">
      <div class="modal">
        <h3>Create New Course</h3>
        <input
          v-model="newCourseName"
          placeholder="Enter course name"
          @keyup.enter="createCourse"
        />
        <div class="modal-actions">
          <button @click="createCourse" class="create-btn">Create</button>
          <button @click="showNewCourseModal = false" class="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.courses {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;
}

.courses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h2 {
  font-size: 2rem;
  margin: 0;
}

.add-course-btn {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-course-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

ul {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.course-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.course-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.course-title {
  margin: 0;
  font-size: 1.25rem;
  color: #fff;
}

.course-actions {
  display: flex;
  gap: 0.75rem;
}

.course-actions button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.revise-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.revise-btn:hover {
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
