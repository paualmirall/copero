import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import events from '../data/events/catalog.json'
import type { EventSelection, GameEvent, GameState, Player, Position, SeasonResult, Strategies } from '../models/game'
import { SimulationEngine } from '../engine/SimulationEngine'

const STORAGE_KEY = 'copero-career-v1'
const defaults: Strategies = { training: 'Normal', money: 'Ahorrar', image: 'Equilibrado', career: 'Minutos' }
export function migrateGameState(saved: GameState | null): GameState | null {
  if (!saved) return null
  const history = saved.history ?? []
  const inferredAge = history.at(-1)?.age !== undefined ? history.at(-1)!.age + 1 : saved.player.age
  saved.player.age = inferredAge || 16
  // Legacy saves used calendar years (2026, 2027…). Season is now the age
  // at the start of the next season, while historic ages remain authoritative.
  if (saved.player.season >= 1900) saved.player.season = saved.player.age
  saved.history.forEach((result, index) => {
    if (result.season >= 1900) result.season = result.age || 16 + index
  })
  saved.pending?.forEach((event) => {
    if (event.dueSeason >= 1900) event.dueSeason = saved.player.age + Math.max(0, event.dueSeason - 2026)
  })
  return saved
}

export function createInitialPlayer(input: { name: string; country: string; position: Position; club: string }): Player {
  return { ...input, age: 16, season: 16, rating: 64, popularity: 12, fitness: 90, morale: 75, wealth: .2, salary: .5, titles: 0, sponsors: 0, companies: 0, injuries: 0, flags: [] }
}

export function careerTotals(history: SeasonResult[]) {
  return history.reduce((sum, season) => ({ matches: sum.matches + season.matches, goals: sum.goals + season.goals, assists: sum.assists + season.assists }), { matches: 0, goals: 0, assists: 0 })
}

export function resolveEventSelections(currentEvents: GameEvent[], choices: Record<string, string>): EventSelection[] {
  return currentEvents.map((event) => ({ event, choiceId: choices[event.id] || event.choices[0].id }))
}

const load = (): GameState | null => {
  try { return migrateGameState(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')) } catch { return null }
}

export const useGameStore = defineStore('game', () => {
  const state = ref<GameState | null>(load())
  const currentEvents = ref<GameEvent[]>([])
  const latestResult = ref<SeasonResult | null>(state.value?.history.at(-1) ?? null)
  const engine = new SimulationEngine(events as GameEvent[])
  const finished = computed(() => !!state.value && state.value.player.age >= 38)
  const totals = computed(() => careerTotals(state.value?.history ?? []))
  watch(state, (value) => value && localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true })
  function createPlayer(input: { name: string; country: string; position: Position; club: string }) {
    const player = createInitialPlayer(input)
    state.value = { player, strategies: { ...defaults }, history: [], pending: [], seenEvents: [] }; latestResult.value = null; prepareSeason()
  }
  function prepareSeason() { if (state.value && !finished.value) currentEvents.value = engine.getEvents(state.value) }
  function playSeason(choices: Record<string, string>) {
    if (!state.value) return
    latestResult.value = engine.simulate(state.value, state.value.strategies, resolveEventSelections(currentEvents.value, choices))
  }
  function reset() { localStorage.removeItem(STORAGE_KEY); state.value = null; latestResult.value = null; currentEvents.value = [] }
  if (state.value && !finished.value) prepareSeason()
  return { state, currentEvents, latestResult, finished, totals, createPlayer, prepareSeason, playSeason, reset }
})
