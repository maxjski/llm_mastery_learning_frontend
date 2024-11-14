// Base Entities
export interface Course {
  id: number
  name: string
  description: string
  owner_id: number
  created_at: string
}

export interface Topic {
  id: number
  name: string
  course_id: number
  mastery_definition?: string
}

export interface Skill {
  id: number
  topic_id: number
  name: string
  mastery_definition_of_skill?: string
  content_to_master?: string
}

export interface SubSkill {
  id: number
  temp_id?: string
  skill_id: number
  name: string
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

export interface Question {
  id: number
  temp_id?: string
  sub_skill_id: number
  sub_skill_temp_id?: string
  sfia_level?: number
  question_type?: string
  question_text: string
  correct_answer: string
  explanation?: string
}

// Creation Interfaces
export interface TopicCreate {
  name: string
  course_id: number
  mastery_definition?: string
}

export interface SkillCreate {
  name: string
  mastery_definition_of_skill?: string
  content_to_master?: string
  subskills: SubSkillCreate[]
}

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
  temp_id: string
  sub_skill_temp_id: string
  sub_skill_id?: number
  sfia_level?: number
  question_type?: string
  question_text: string
  correct_answer: string
  explanation?: string
}

// Extended Interfaces with Relationships
export interface TopicWithSkills extends Topic {
  skills: SkillWithSubSkills[]
}

export interface SkillWithSubSkills extends Skill {
  sub_skills: SubSkillWithQuestions[]
}

export interface SubSkillWithQuestions extends SubSkill {
  questions: Question[]
}

// Draft Interfaces
export interface TopicDraft {
  topic: TopicCreate
  skills: SkillCreate[]
  sub_skills: SubSkillCreate[]
  questions: QuestionCreate[]
}

export type Confidence = 'very high' | 'high' | 'medium' | 'low' | 'none'

export interface UserQuestion {
  id: number
  text: string
}

export interface QuestionAnswer {
  id: number
  sub_skill_id: number
  sfia_level: number
  question_type: string
  question: string
  answer: string
  correct_answer: string
  explanation: string
  correct: boolean
}

export interface ExaminationDraft {
  questions: Question[]
}

export interface ExaminationAnswers {
  topic_id: number
  answers: QuestionAnswer[]
}
