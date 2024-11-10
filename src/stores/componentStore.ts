import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TopicDraftResponse } from '@/services/topicService'

export enum ActiveComponentEnum {
  Courses = 'courses',
  Generate = 'generate',
  ManageDeck = 'manageDeck',
  ReviseDeck = 'reviseDeck',
  EditDraft = 'editDraft',
}

export const useComponentStore = defineStore('component', {
  state: () => ({
    activeComponent: ref<ActiveComponentEnum>(ActiveComponentEnum.Courses),
    currentCourseId: ref<number | null>(null),
    currentDraft: ref<TopicDraftResponse | null>(null),
  }),
  getters: {
    getActiveComponent(state) {
      return state.activeComponent
    },
    getCurrentCourseId(state) {
      return state.currentCourseId
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
    setCurrentDraft(draft: TopicDraftResponse | null) {
      this.currentDraft = draft
      this.activeComponent = draft
        ? ActiveComponentEnum.EditDraft
        : ActiveComponentEnum.Generate
    },
  },
})
