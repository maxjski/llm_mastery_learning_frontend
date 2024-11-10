import { defineStore } from 'pinia'
import {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} from '../services/courseService'
import type {
  CourseCreate,
  CourseUpdate,
  CourseWithTopics,
} from '../services/courseService'
import type { Course } from '../types'

interface CourseState {
  courseList: Course[]
  activeCourse: CourseWithTopics | null
  loading: boolean
  error: string | null
}

export const useCourseStore = defineStore('course', {
  state: (): CourseState => ({
    courseList: [],
    activeCourse: null,
    loading: false,
    error: null,
  }),

  getters: {
    getCourseList: state => state.courseList,
    getActiveCourse: state => state.activeCourse,
    isLoading: state => state.loading,
  },

  actions: {
    async fetchCourses(skip = 0, limit = 100) {
      this.loading = true
      try {
        this.courseList = await getCourses(skip, limit)
      } catch (error) {
        this.error = 'Failed to fetch courses'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCourseById(id: number) {
      this.loading = true
      try {
        this.activeCourse = await getCourse(id)
      } catch (error) {
        this.error = 'Failed to fetch course details'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCourse(courseData: CourseCreate) {
      this.loading = true
      try {
        const newCourse = await createCourse(courseData)
        this.courseList.push(newCourse)
        return newCourse
      } catch (error) {
        this.error = 'Failed to create course'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCourse(courseId: number, courseData: CourseUpdate) {
      this.loading = true
      try {
        const updatedCourse = await updateCourse(courseId, courseData)
        const index = this.courseList.findIndex(c => c.id === courseId)
        if (index !== -1) {
          this.courseList[index] = updatedCourse
        }
        if (this.activeCourse?.id === courseId) {
          await this.fetchCourseById(courseId)
        }
        return updatedCourse
      } catch (error) {
        this.error = 'Failed to update course'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCourse(courseId: number) {
      this.loading = true
      try {
        await deleteCourse(courseId)
        this.courseList = this.courseList.filter(c => c.id !== courseId)
        if (this.activeCourse?.id === courseId) {
          this.activeCourse = null
        }
      } catch (error) {
        this.error = 'Failed to delete course'
        throw error
      } finally {
        this.loading = false
      }
    },

    setActiveCourse(course: CourseWithTopics | null) {
      this.activeCourse = course
    },

    clearError() {
      this.error = null
    },
  },
})
