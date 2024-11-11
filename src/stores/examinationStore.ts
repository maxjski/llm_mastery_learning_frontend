import { defineStore } from 'pinia'
import type {
  UserQuestion,
  QuestionAnswer,
  Confidence,
  ExaminationDraft,
} from '../types'
import * as examinationService from '../services/examinationService'

interface ExaminationState {
  questions: UserQuestion[]
  answers: QuestionAnswer[]
  loading: boolean
  error: string | null
  draft: ExaminationDraft | null
}

export const useExaminationStore = defineStore('examination', {
  state: (): ExaminationState => ({
    questions: [],
    answers: [],
    loading: false,
    error: null,
    draft: null,
  }),

  getters: {
    getQuestions: state => state.questions,
    getAnswers: state => state.answers,
    isLoading: state => state.loading,
  },

  actions: {
    async submitAnswer(
      questionId: number,
      answer: string,
      confidence: Confidence,
    ) {
      this.loading = true
      try {
        // Here you would typically make an API call
        const newAnswer: QuestionAnswer = {
          id: crypto.randomUUID(),
          questionId,
          answer,
          confidence,
          timestamp: new Date(),
        }

        this.answers.push(newAnswer)
        return newAnswer
      } catch (error) {
        this.error = 'Failed to submit answer'
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
        console.log('draft', draft)
        this.draft = draft
        this.questions = draft.questions
        console.log('questions', this.questions)
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
