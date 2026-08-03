import injuries from '../data/injuries/injuries.json'
import type { Player, Strategies } from '../models/game'

export class InjuryEngine {
  constructor(private readonly random = Math.random) {}
  calculate(player: Player, strategies: Strategies) {
    const trainingRisk = strategies.training === 'Alto' ? .09 : strategies.training === 'Bajo' ? -.03 : 0
    const ageRisk = Math.max(0, player.age - 29) * .012
    if (this.random() > .11 + trainingRisk + ageRisk) return undefined
    const injury = injuries[Math.min(injuries.length - 1, Math.floor(this.random() * injuries.length))]
    player.injuries++
    player.fitness = Math.max(20, player.fitness - injury.games)
    return injury
  }
}
