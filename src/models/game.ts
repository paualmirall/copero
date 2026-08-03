export type Position = 'Delantero' | 'Mediocampista' | 'Defensor' | 'Arquero'
export type StrategyKey = 'training' | 'money' | 'image' | 'career'
export type Strategies = Record<StrategyKey, string>

export interface Player {
  name: string; country: string; position: Position; club: string
  age: number; season: number; rating: number; popularity: number
  fitness: number; morale: number; wealth: number; salary: number
  titles: number; sponsors: number; companies: number; injuries: number
  flags: string[]
}
export interface Requirement { field: keyof Player | 'flag'; op: 'gt'|'gte'|'lt'|'lte'|'eq'|'neq'|'has'|'notHas'; value: string|number }
export interface Effect { field: keyof Player | 'flag'; amount?: number; value?: string|number; label: string }
export interface Choice { id: string; label: string; description: string; effects: Effect[]; schedule?: { eventId: string; years: number } }
export interface GameEvent { id: string; category: string; title: string; description: string; weight: number; requirements: Requirement[]; choices: Choice[] }
export interface PendingEvent { eventId: string; dueSeason: number }
export interface SeasonResult { season: number; age: number; club: string; matches: number; goals: number; assists: number; rating: number; titles: string[]; injury?: string; income: number; wealth: number; headlines: string[] }
export interface GameState { player: Player; strategies: Strategies; history: SeasonResult[]; pending: PendingEvent[]; seenEvents: string[] }
export interface EventSelection { event: GameEvent; choiceId: string }
