import type { EventSelection, GameEvent, GameState, SeasonResult, Strategies } from '../models/game'
import { EventEngine } from './EventEngine'
import { InjuryEngine } from './InjuryEngine'
import { MoneyEngine } from './MoneyEngine'
import { TransferEngine } from './TransferEngine'

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value))
export class SimulationEngine {
  private eventEngine: EventEngine
  private injuryEngine: InjuryEngine
  private moneyEngine = new MoneyEngine()
  private transferEngine: TransferEngine
  constructor(events: GameEvent[], private readonly random = Math.random) {
    this.eventEngine = new EventEngine(events, random); this.injuryEngine = new InjuryEngine(random); this.transferEngine = new TransferEngine(random)
  }
  getEvents(state: GameState) { return this.eventEngine.select(state, 2 + Math.floor(this.random() * 3)) }
  simulate(state: GameState, strategies: Strategies, selections: EventSelection[]): SeasonResult {
    const p = state.player; const headlines: string[] = []
    selections.forEach(({ event, choiceId }) => {
      const choice = event.choices.find((c) => c.id === choiceId)
      if (choice) headlines.push(...this.eventEngine.applyChoice(state, event, choice))
    })
    const growth = strategies.training === 'Alto' ? 3 : strategies.training === 'Bajo' ? 0 : 1.5
    const aging = p.age > 30 ? (p.age - 29) * .55 : 0
    p.rating = Math.round(clamp(p.rating + growth - aging + (this.random() * 2 - 1)))
    p.popularity = Math.round(clamp(p.popularity + (strategies.image === 'Mediático' ? 7 : strategies.image === 'Perfil bajo' ? -2 : 2)))
    p.morale = clamp(p.morale + (strategies.money === 'Bienestar' ? 8 : -1))
    const injury = this.injuryEngine.calculate(p, strategies)
    const minutesBias = strategies.career === 'Minutos' ? 5 : 0
    const matches = Math.round(clamp(25 + (p.rating - 60) * .45 + minutesBias - (injury?.games ?? 0), 4, 55))
    const attacking = p.position === 'Delantero' ? .48 : p.position === 'Mediocampista' ? .2 : p.position === 'Defensor' ? .07 : .01
    const goals = Math.round(matches * attacking * (p.rating / 85) * (.7 + this.random() * .6))
    const assists = Math.round(matches * (p.position === 'Mediocampista' ? .3 : .13) * (.6 + this.random() * .7))
    const titleChance = (p.rating / 180) + (strategies.career === 'Títulos' ? .15 : 0)
    const titles = this.random() < titleChance ? [this.random() < .28 ? 'Champions' : 'Liga'] : []
    p.titles += titles.length
    const income = this.moneyEngine.calculate(p, strategies)
    const transfer = this.transferEngine.calculate(p, strategies); if (transfer) headlines.push(transfer)
    const result: SeasonResult = { season: p.season, age: p.age, club: p.club, matches, goals, assists, rating: p.rating, titles, injury: injury?.name, income, wealth: Number(p.wealth.toFixed(1)), headlines }
    state.history.push(result); state.strategies = { ...strategies }; p.age++; p.season++
    return result
  }
}
