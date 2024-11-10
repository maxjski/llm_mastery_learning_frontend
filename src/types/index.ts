export interface Course {
  id: number
  name: string
  owner_id: number
  created_at: string
}

export interface Course {
  id: number
  name: string
  description: string
  owner_id: number
}

export type Topic = {
  id: number
  name: string
  course_id: number
  mastery_definition?: string
}

export type Skill = {
  id: number
  name: string
  mastery_definition_of_skill?: string
  content_to_master?: string
}

export type SubSkill = {
  id: number
  name: string
  skill_id: number
  content_to_master?: string
  condensed_learning_materials?: string
  sfia_1_definition?: string
  sfia_2_definition?: string
  sfia_3_definition?: string
  sfia_4_definition?: string
  sfia_5_definition?: string
  sfia_6_definition?: string
  sfia_7_definition?: string
}

export type Question = {
  id: number
  sub_skill_id: number
  sfia_level: number
  question_type: string
  question_text: string
  correct_answer: string
  explanation?: string
}
