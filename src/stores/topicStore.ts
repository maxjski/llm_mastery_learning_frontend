// stores/topicStore.js
import { defineStore } from 'pinia'
import { transformTopicDraft } from '@/utils/topicDraftStructuring'
import { createTopicFromDraft } from '@/services/topicService'

export const useTopicStore = defineStore('topic', {
  state: () => ({
    topic: {
      name: '',
      mastery_definition: '',
      skills: [],
    },
    isEditing: false,
  }),

  actions: {
    initializeNewTopic() {
      this.topic = {
        name: '',
        mastery_definition: '',
        skills: [],
      }
      this.isEditing = true
    },

    addSkill() {
      this.topic.skills.push({
        name: '',
        mastery_definition: '',
        content_to_master: '',
        subskills: [],
      })
    },

    removeSkill(skillIndex) {
      this.topic.skills.splice(skillIndex, 1)
    },

    addSubskill(skillIndex) {
      const newSubskill = {
        name: '',
        content_to_master: '',
        condensed_learning_materials: '',
        questions: [],
        // Initialize SFIA levels 1-7
        ...Array.from({ length: 7 }, (_, i) => ({
          [`sfia_${i + 1}_definition`]: '',
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      }
      this.topic.skills[skillIndex].subskills.push(newSubskill)
    },

    removeSubskill(skillIndex, subskillIndex) {
      this.topic.skills[skillIndex].subskills.splice(subskillIndex, 1)
    },

    addQuestion(skillIndex, subskillIndex) {
      const newQuestion = {
        type: '',
        question_text: '',
        correct_answer: '',
        explanation: '',
        sfia_level: 1,
      }
      this.topic.skills[skillIndex].subskills[subskillIndex].questions.push(
        newQuestion,
      )
    },

    removeQuestion(skillIndex, subskillIndex, questionIndex) {
      this.topic.skills[skillIndex].subskills[subskillIndex].questions.splice(
        questionIndex,
        1,
      )
    },

    // Save draft (you would implement actual API calls here)
    async saveDraft() {
      console.log('Saving draft:', this.topic)
      const draft = transformTopicDraft(this.topic, 1)
      await createTopicFromDraft(draft)
    },
  },
})
