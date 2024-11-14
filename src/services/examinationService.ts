import axios from 'axios'
import { API_URL } from './config'
import type {
  ExaminationAnswers,
  ExaminationDraft,
  UserQuestion,
} from '../types'

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
    console.log('draft at service ----------------------------')
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Error generating examination draft:', error)
    throw error
  }
}

export async function submitExaminationAnswers(answers: ExaminationAnswers) {
  try {
    const response = await axios.post<ExaminationAnswers>(
      `${API_URL}/examinations/submit`,
      answers,
      {
        headers: getAuthHeaders(),
      },
    )
    return response.data
  } catch (error) {
    console.error('Error submitting examination answers:', error)
    throw error
  }
}
