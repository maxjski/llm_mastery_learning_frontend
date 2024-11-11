import type {
  TopicDraft,
  SkillCreate,
  SubSkillCreate,
  QuestionCreate,
  TopicCreate,
} from '@/types'

interface FrontendTopic {
  name: string
  mastery_definition: string
  skills: Array<{
    name: string
    mastery_definition: string
    content_to_master: string
    subskills: Array<{
      name: string
      content_to_master: string
      condensed_learning_materials: string
      questions: Array<{
        type: string
        question_text: string
        correct_answer: string
        explanation: string
        sfia_level: number
      }>
      sfia_1_definition: string
      sfia_2_definition: string
      sfia_3_definition: string
      sfia_4_definition: string
      sfia_5_definition: string
      sfia_6_definition: string
      sfia_7_definition: string
    }>
    mastery_definition_of_skill?: string
  }>
}

export function transformTopicDraft(
  frontendData: FrontendTopic,
  courseId: number,
): TopicDraft {
  // Initialize arrays to store transformed data
  const skills: SkillCreate[] = []
  const subSkills: SubSkillCreate[] = []
  const questions: QuestionCreate[] = []

  // Transform topic data
  const topic: TopicCreate = {
    name: frontendData.name,
    mastery_definition: frontendData.mastery_definition,
    course_id: courseId,
  }

  // Process skills and their nested data
  frontendData.skills.forEach((skillData, skillIndex) => {
    // Create skill
    const skill: SkillCreate = {
      name: skillData.name,
      mastery_definition_of_skill:
        skillData.mastery_definition_of_skill || skillData.mastery_definition,
      content_to_master: skillData.content_to_master,
      subskills: [], // This won't be used in the backend but is required by the interface
    }
    skills.push(skill)

    // Process subskills
    skillData.subskills.forEach((subskillData, subskillIndex) => {
      const tempId = `subskill-${skillIndex}-${subskillIndex}`

      // Create subskill
      const subSkill: SubSkillCreate = {
        temp_id: tempId,
        name: subskillData.name,
        skill_id: 0, // This will be set by the backend
        content_to_master: subskillData.content_to_master,
        condensed_learning_materials: subskillData.condensed_learning_materials,
        sfia_1_definition: subskillData.sfia_1_definition,
        sfia_2_definition: subskillData.sfia_2_definition,
        sfia_3_definition: subskillData.sfia_3_definition,
        sfia_4_definition: subskillData.sfia_4_definition,
        sfia_5_definition: subskillData.sfia_5_definition,
        sfia_6_definition: subskillData.sfia_6_definition,
        sfia_7_definition: subskillData.sfia_7_definition,
      }
      subSkills.push(subSkill)

      // Process questions
      subskillData.questions.forEach((questionData, questionIndex) => {
        const questionTempId = `question-${skillIndex}-${subskillIndex}-${questionIndex}`

        // Create question
        const question: QuestionCreate = {
          temp_id: questionTempId,
          sub_skill_temp_id: tempId,
          sub_skill_id: 0, // This will be set by the backend
          sfia_level: questionData.sfia_level,
          question_type: questionData.type,
          question_text: questionData.question_text,
          correct_answer: questionData.correct_answer,
          explanation: questionData.explanation,
        }
        questions.push(question)
      })
    })
  })

  return {
    topic,
    skills,
    sub_skills: subSkills,
    questions,
  }
}
