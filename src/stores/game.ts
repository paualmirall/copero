import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import events from '../data/events/catalog.json'
import type { GameEvent, GameState, Player, Position, SeasonResult, Strategies } from '../models/game'
import { SimulationEngine } from '../engine/SimulationEngine'

const STORAGE_KEY = 'copero-career-v1'
const defaults: Strategies = { training: 'Normal', money: 'Ahorrar', image: 'Equilibrado', career: 'Minutos' }
const load = (): GameState | null => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') } catch { return null } }

export const useGameStore = defineStore('game', () => {
  const state = ref<GameState | null>(load())
  const currentEvents = ref<GameEvent[]>([])
  const latestResult = ref<SeasonResult | null>(state.value?.history.at(-1) ?? null)
  const engine = new SimulationEngine(events as GameEvent[])
  const finished = computed(() => !!state.value && state.value.player.age >= 38)
  watch(state, (value) => value && localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true })
  function createPlayer(input: { name: string; country: string; position: Position; club: string }) {
    const player: Player = { ...input, age: 18, season: 2026, rating: 64, popularity: 12, fitness: 90, morale: 75, wealth: .2, salary: .5, titles: 0, sponsors: 0, companies: 0, injuries: 0, flags: [] }
    state.value = { player, strategies: { ...defaults }, history: [], pending: [], seenEvents: [] }; latestResult.value = null; prepareSeason()
  }
  function prepareSeason() { if (state.value && !finished.value) currentEvents.value = engine.getEvents(state.value) }
  function playSeason(choices: Record<string, string>) {
    if (!state.value) return
    latestResult.value = engine.simulate(state.value, state.value.strategies, currentEvents.value.map((event) => ({ event, choiceId: choices[event.id] || event.choices[0].id })))
  }
  function reset() { localStorage.removeItem(STORAGE_KEY); state.value = null; latestResult.value = null; currentEvents.value = [] }
  if (state.value && !finished.value) prepareSeason()
  return { state, currentEvents, latestResult, finished, createPlayer, prepareSeason, playSeason, reset }
})
