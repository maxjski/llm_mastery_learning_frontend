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
