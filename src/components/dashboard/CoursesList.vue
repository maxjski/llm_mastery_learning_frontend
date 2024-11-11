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
  componentStore.setActiveComponent(ActiveComponentEnum.Examination)
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
              Study
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
