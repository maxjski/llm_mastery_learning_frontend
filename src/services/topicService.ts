import axios from 'axios'
import { API_URL } from './config'
import type { TopicDraft, TopicWithSkills } from '../types'

const getAuthHeaders = () => {
  const authToken = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
  }
}

export const generateTempId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export async function generateTopicDraft(courseId: number, topicName: string) {
  try {
    const response = await axios.post<TopicDraft>(
      `${API_URL}/topic-generation/draft`,
      {
        course_id: courseId,
        topic_name: topicName,
      },
      {
        headers: getAuthHeaders(),
      },
    )
    return response.data
  } catch (error) {
    console.error('Error generating topic draft:', error)
    throw error
  }
}

export async function createTopicFromDraft(draft: TopicDraft) {
  try {
    const response = await axios.post<TopicWithSkills>(
      `${API_URL}/topic-generation/create`,
      draft,
      {
        headers: getAuthHeaders(),
      },
    )
    return response.data
  } catch (error) {
    console.error('Error creating topic from draft:', error)
    throw error
  }
}

interface TopicResponse {
  name: string
  mastery_definition: string
  id: number
  course_id: number
  created_at: string
}

export async function getTopics(courseId: number) {
  const response = await axios.get<TopicResponse[]>(
    `${API_URL}/topic-generation/${courseId}`,
    {
      headers: getAuthHeaders(),
    },
  )
  console.log(response.data)
  return response.data
}

export async function apiDeleteTopic(topicId: number) {
  const response = await axios.delete(
    `${API_URL}/topic-generation/${topicId}`,
    {
      headers: getAuthHeaders(),
    },
  )

  return response.data
}

interface SkillResponse {
  id: number
  name: string
}

export async function getSkills(topicId: number) {
  const response = await axios.get<SkillResponse[]>(
    `${API_URL}/skill/${topicId}`,
    {
      headers: getAuthHeaders(),
    },
  )
  return response.data
}
