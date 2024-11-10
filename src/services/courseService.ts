import axios from 'axios'
import { API_URL } from './config'
import type { Course } from '../types'

export interface CourseWithTopics extends Course {
  topics: Topic[]
}

export interface Topic {
  id: number
  name: string
  course_id: number
}

export interface CourseCreate {
  name: string
}

export interface CourseUpdate {
  name?: string
  description?: string
}

const getAuthHeaders = () => {
  const authToken = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
  }
}

export async function getCourses(skip = 0, limit = 100) {
  const response = await axios.get<Course[]>(`${API_URL}/courses`, {
    params: { skip, limit },
    headers: getAuthHeaders(),
  })
  return response.data
}

export async function createCourse(courseData: CourseCreate) {
  try {
    const response = await axios.post<Course>(
      `${API_URL}/courses`,
      courseData,
      {
        headers: getAuthHeaders(),
      },
    )
    return response.data
  } catch (error) {
    console.error('Error creating course:', error)
    throw error
  }
}

export async function getCourse(courseId: number) {
  const response = await axios.get<CourseWithTopics>(
    `${API_URL}/courses/${courseId}`,
    {
      headers: getAuthHeaders(),
    },
  )
  return response.data
}

export async function updateCourse(
  courseId: number,
  courseUpdate: CourseUpdate,
) {
  const response = await axios.put<Course>(
    `${API_URL}/courses/${courseId}`,
    courseUpdate,
    {
      headers: getAuthHeaders(),
    },
  )
  return response.data
}

export async function deleteCourse(courseId: number) {
  const response = await axios.delete<Course>(
    `${API_URL}/courses/${courseId}`,
    {
      headers: getAuthHeaders(),
    },
  )
  return response.data
}
