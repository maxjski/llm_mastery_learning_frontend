import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TopicDraft } from '@/types'

export enum ActiveComponentEnum {
  Courses = 'courses',
  Generate = 'generate',
  ManageDeck = 'manageDeck',
  ReviseDeck = 'reviseDeck',
  EditDraft = 'editDraft',
  Examination = 'examination',
  Topics = 'topics',
  Skills = 'skills',
}

export const useComponentStore = defineStore('component', {
  state: () => ({
    activeComponent: ref<ActiveComponentEnum>(ActiveComponentEnum.Courses),
    currentCourseId: ref<number | null>(null),
    currentTopicId: ref<number | null>(null),
    currentDraft: ref<TopicDraft | null>(null),
  }),
  getters: {
    getActiveComponent(state) {
      return state.activeComponent
    },
    getCurrentCourseId(state) {
      return state.currentCourseId
    },
    getCurrentTopicId(state) {
      return state.currentTopicId
    },
    getCurrentDraft(state) {
      return state.currentDraft
    },
  },
  actions: {
    setActiveComponent(component: ActiveComponentEnum) {
      this.activeComponent = component
    },
    setCurrentCourseId(id: number) {
      this.currentCourseId = id
    },
    setCurrentTopicId(id: number) {
      this.currentTopicId = id
    },
    setCurrentDraft(draft: TopicDraft | null) {
      this.currentDraft = draft
      this.activeComponent = draft
        ? ActiveComponentEnum.EditDraft
        : ActiveComponentEnum.Generate
    },
  },
})
