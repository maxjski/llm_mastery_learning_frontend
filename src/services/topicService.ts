import axios from 'axios'
import { API_URL } from './config'
import type { Topic, Skill, SubSkill, Question } from '../types'

export interface TopicDraftRequest {
  course_id: number
  topic_name: string
}

export interface TopicDraftResponse {
  topic: TopicCreate
  skills: SkillCreate[]
  sub_skills: SubSkillCreate[]
  questions: QuestionCreate[]
}

export interface TopicCreate {
  name: string
  course_id: number
  mastery_definition?: string
}

export interface SkillCreate {
  name: string
  mastery_definition_of_skill?: string
  content_to_master?: string
}

export const generateTempId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export interface SubSkillCreate {
  temp_id: string
  name: string
  skill_id: number
  content_to_master?: string
  condensed_learning_materials?: string
  sfia_level?: number
  sfia_1_definition?: string
  sfia_2_definition?: string
  sfia_3_definition?: string
  sfia_4_definition?: string
  sfia_5_definition?: string
  sfia_6_definition?: string
  sfia_7_definition?: string
}

export interface QuestionCreate {
  sub_skill_id: number
  sfia_level?: number
  question_type?: string
  question_text: string
  correct_answer: string
  explanation?: string
}

export interface TopicWithSkills extends Topic {
  skills: SkillWithSubSkills[]
}

export interface SkillWithSubSkills extends Skill {
  sub_skills: SubSkillWithQuestions[]
}

export interface SubSkillWithQuestions extends SubSkill {
  questions: Question[]
}

const getAuthHeaders = () => {
  const authToken = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
  }
}

/**
 * Generates a draft topic with related skills, subskills, and questions using AI
 */
export async function generateTopicDraft(courseId: number, topicName: string) {
  try {
    const response = await axios.post<TopicDraftResponse>(
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

/**
 * Creates a complete topic with all related entities from a draft
 */
export async function createTopicFromDraft(draft: TopicDraftResponse) {
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
