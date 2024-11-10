import axios from 'axios'
import { API_URL } from './config'

// Interfaces matching your backend schemas
export interface TopicCreate {
  name: string
  course_id: number
  mastery_definition: string
}

export interface SkillCreate {
  name: string
  mastery_definition_of_skill: string
  content_to_master: string
}

export interface SubSkillCreate {
  name: string
  skill_id: number
  content_to_master: string
  condensed_learning_materials: string
  sfia_level: number
  sfia_1_definition: string
  sfia_2_definition: string
  sfia_3_definition: string
  sfia_4_definition: string
  sfia_5_definition: string
  sfia_6_definition: string
  sfia_7_definition: string
}

export interface QuestionCreate {
  sub_skill_id: number
  sfia_level: number
  question_type: string
  question_text: string
  correct_answer: string
  explanation?: string
}

export interface TopicDraftResponse {
  topic: TopicCreate
  skills: SkillCreate[]
  sub_skills: SubSkillCreate[]
  questions: QuestionCreate[]
}

// Service functions
export const generateTopicDraft = async (
  courseId: number,
  topicName: string,
): Promise<TopicDraftResponse> => {
  const response = await axios.post('/api/topic-generation/draft', null, {
    params: {
      course_id: courseId,
      topic_name: topicName,
    },
  })
  return response.data
}

export async function createTopicFromDraft(
  draft: TopicDraftResponse,
): Promise<TopicWithSkills> {
  const response = await axios.post(
    `${API_URL}/topic-generation/create`,
    draft,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  )
  return response.data
}
