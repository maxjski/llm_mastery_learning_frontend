import { defineStore } from 'pinia'
import type {
  UserQuestion,
  QuestionCreate,
  QuestionAnswer,
  Confidence,
  ExaminationDraft,
  ExaminationAnswers,
} from '../types'
import * as examinationService from '../services/examinationService'

interface ExaminationState {
  questions: UserQuestion[]
  examinationAnswers: ExaminationAnswers
  loading: boolean
  error: string | null
  draft: ExaminationDraft | null
}

export const useExaminationStore = defineStore('examination', {
  state: (): ExaminationState => ({
    questions: [],
    examinationAnswers: {
      topic_id: 0,
      answers: [],
    },
    loading: false,
    error: null,
    draft: null,
  }),

  getters: {
    getQuestions: state => state.questions,
    getExaminationAnswers: state => state.examinationAnswers,
    isLoading: state => state.loading,
    getDraft: state => state.draft,
  },

  actions: {
    async submitAnswers(answers: ExaminationAnswers) {
      this.loading = true
      try {
        const examinationAnswers =
          await examinationService.submitExaminationAnswers(answers)
        this.examinationAnswers = examinationAnswers
      } catch (error) {
        this.error = 'Failed to submit answers'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchQuestions(topicId: number) {
      this.loading = true
      this.error = null
      try {
        const draft = await examinationService.generateExaminationDraft(topicId)
        console.log('draft at store ----------------------------')
        console.log(draft)

        const updated_draft = {
          ...draft,
          questions: draft.questions.map(question => ({
            ...question,
            id: Math.floor(Math.random() * 1000000),
          })),
        }

        this.draft = updated_draft
        this.questions = updated_draft.questions

        console.log('draft ABSD', this.draft)
        console.log('questions ABSD', this.questions)
      } catch (error) {
        this.error = 'Failed to fetch questions'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createExamination() {
      if (!this.draft) {
        throw new Error('No draft available')
      }

      this.loading = true
      this.error = null
      try {
        const questions = await examinationService.createExaminationFromDraft(
          this.draft,
        )
        this.questions = questions
        this.draft = null
      } catch (error) {
        this.error = 'Failed to create examination'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },
  },
})
