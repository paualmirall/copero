import { describe, expect, it } from 'vitest'
import events from '../src/data/events/catalog.json'
import { countries, firstValidClub } from '../src/data/football'
import { SimulationEngine } from '../src/engine/SimulationEngine'
import type { GameEvent, GameState, SeasonResult } from '../src/models/game'
import { careerTotals, createInitialPlayer, migrateGameState, resolveEventSelections } from '../src/stores/game'

const state = (): GameState => ({
  player: { name: 'Test', country: 'Argentina', position: 'Delantero', club: 'Racing Club', age: 22, season: 22, rating: 75, popularity: 50, fitness: 90, morale: 70, wealth: 10, salary: 2, titles: 0, sponsors: 0, companies: 0, injuries: 0, flags: [] },
  strategies: { training: 'Normal', money: 'Ahorrar', image: 'Equilibrado', career: 'Minutos' },
  history: [], pending: [], seenEvents: [],
})

const result = (matches: number, goals: number, assists: number): SeasonResult => ({ season: 16, age: 16, club: 'Racing Club', matches, goals, assists, rating: 65, titles: [], income: 1, wealth: 1, headlines: [] })

describe('career setup and compatibility', () => {
  it('creates every player at age 16 with an age-based season', () => {
    const player = createInitialPlayer({ name: 'Alex', country: 'España', club: 'Athletic Club', position: 'Defensor' })
    expect(player.age).toBe(16)
    expect(player.season).toBe(16)
  })

  it('provides a valid club whenever the country changes', () => {
    for (const country of countries) expect(country.clubs).toContain(firstValidClub(country.name))
    expect(firstValidClub('Argentina')).toBe('River Plate')
  })

  it('adds accumulated matches, goals and assists', () => {
    expect(careerTotals([result(20, 4, 7), result(31, 9, 5)])).toEqual({ matches: 51, goals: 13, assists: 12 })
  })

  it('migrates calendar-year saves to age-based seasons', () => {
    const legacy = state()
    legacy.player.age = 18
    legacy.player.season = 2028
    legacy.history = [{ ...result(30, 10, 4), season: 2026, age: 16 }, { ...result(32, 11, 5), season: 2027, age: 17 }]
    const migrated = migrateGameState(legacy)!
    expect(migrated.player.season).toBe(18)
    expect(migrated.history.map((season) => season.season)).toEqual([16, 17])
  })

  it('uses the first event choice when a selector is untouched', () => {
    const event = (events as GameEvent[])[0]
    expect(resolveEventSelections([event], {})[0].choiceId).toBe(event.choices[0].id)
  })
})

describe('SimulationEngine', () => {
  it('only selects valid, unique events', () => {
    const current = state()
    const selected = new SimulationEngine(events as GameEvent[], () => .5).getEvents(current)
    expect(new Set(selected.map((event) => event.id)).size).toBe(selected.length)
    expect(selected.every((event) => event.requirements.every((requirement) => requirement.field !== 'age' || current.player.age >= Number(requirement.value)))).toBe(true)
  })

  it('simulates and records a complete age-based season', () => {
    const current = state()
    const engine = new SimulationEngine(events as GameEvent[], () => .9)
    const season = engine.simulate(current, current.strategies, [])
    expect(season.matches).toBeGreaterThan(0)
    expect(current.history).toHaveLength(1)
    expect(current.player.age).toBe(23)
    expect(current.player.season).toBe(23)
  })
})
