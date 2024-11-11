import axios from 'axios'
import { API_URL } from './config'
import type { ExaminationDraft, UserQuestion } from '../types'

const getAuthHeaders = () => {
  const authToken = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
  }
}

export async function generateExaminationDraft(topicId: number) {
  try {
    const response = await axios.post<ExaminationDraft>(
      `${API_URL}/examinations/draft`,
      {
        topic_id: topicId,
      },
      {
        headers: getAuthHeaders(),
      },
    )
    return response.data
  } catch (error) {
    console.error('Error generating examination draft:', error)
    throw error
  }
}

export async function createExaminationFromDraft(draft: ExaminationDraft) {
  try {
    const response = await axios.post<UserQuestion[]>(
      `${API_URL}/examinations/create`,
      draft,
      {
        headers: getAuthHeaders(),
      },
    )
    return response.data
  } catch (error) {
    console.error('Error creating examination from draft:', error)
    throw error
  }
}
