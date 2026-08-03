import type { Choice, Effect, GameEvent, GameState, Player } from '../models/game'

const compare = (actual: unknown, op: string, expected: unknown) => {
  if (op === 'has') return Array.isArray(actual) && actual.includes(expected)
  if (op === 'notHas') return Array.isArray(actual) && !actual.includes(expected)
  if (op === 'eq') return actual === expected
  if (op === 'neq') return actual !== expected
  if (op === 'gt') return Number(actual) > Number(expected)
  if (op === 'gte') return Number(actual) >= Number(expected)
  if (op === 'lt') return Number(actual) < Number(expected)
  return Number(actual) <= Number(expected)
}

export class EventEngine {
  constructor(private readonly events: GameEvent[], private readonly random = Math.random) {}

  isValid(event: GameEvent, state: GameState) {
    return event.requirements.every((r) => compare(r.field === 'flag' ? state.player.flags : state.player[r.field], r.op, r.value))
  }

  select(state: GameState, count = 3): GameEvent[] {
    const dueIds = state.pending.filter((p) => p.dueSeason <= state.player.season).map((p) => p.eventId)
    const due = dueIds.map((id) => this.events.find((e) => e.id === id)).filter((e): e is GameEvent => !!e && this.isValid(e, state))
    const candidates = this.events.filter((e) => !dueIds.includes(e.id) && !state.seenEvents.includes(e.id) && this.isValid(e, state))
    const selected = [...due]
    while (selected.length < count && candidates.length) {
      const total = candidates.reduce((sum, event) => sum + event.weight, 0)
      let roll = this.random() * total
      const index = candidates.findIndex((event) => (roll -= event.weight) <= 0)
      selected.push(candidates.splice(Math.max(index, 0), 1)[0])
    }
    return selected.slice(0, count)
  }

  applyChoice(state: GameState, event: GameEvent, choice: Choice): string[] {
    const labels = choice.effects.map((effect) => this.applyEffect(state.player, effect))
    if (choice.schedule) state.pending.push({ eventId: choice.schedule.eventId, dueSeason: state.player.season + choice.schedule.years })
    state.pending = state.pending.filter((p) => p.eventId !== event.id)
    state.seenEvents.push(event.id)
    return labels
  }

  private applyEffect(player: Player, effect: Effect) {
    if (effect.field === 'flag') {
      if (typeof effect.value === 'string' && !player.flags.includes(effect.value)) player.flags.push(effect.value)
      return effect.label
    }
    const current = player[effect.field]
    if (typeof current === 'number' && effect.amount) (player[effect.field] as number) = current + effect.amount
    else if (effect.value !== undefined) (player[effect.field] as string | number) = effect.value
    return effect.label
  }
}
