import { ref } from 'vue'
import { defineStore } from 'pinia'

export enum ActiveComponentEnum {
  Decks = 'decks',
  Generate = 'generate',
  ManageDeck = 'manageDeck',
  ReviseDeck = 'reviseDeck',
}

export const useComponentStore = defineStore('component', {
  state: () => ({
    activeComponent: ref<ActiveComponentEnum>(ActiveComponentEnum.Decks),
    currentDeckId: ref<number | null>(null),
  }),
  getters: {
    getActiveComponent(state) {
      return state.activeComponent
    },
    getCurrentDeckId(state) {
      return state.currentDeckId
    },
  },
  actions: {
    setActiveComponent(component: ActiveComponentEnum) {
      this.activeComponent = component
    },
    setCurrentDeckId(id: number) {
      this.currentDeckId = id
    },
  },
})
