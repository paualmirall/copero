import type { Player, Strategies } from '../models/game'
export class MoneyEngine {
  calculate(player: Player, strategies: Strategies) {
    const sponsorship = player.sponsors * .65
    const business = player.companies * .9
    const expenseRate = strategies.money === 'Ahorrar' ? .32 : strategies.money === 'Bienestar' ? .7 : .5
    const investment = strategies.money === 'Invertir' ? player.wealth * .035 : 0
    const income = Math.max(0, player.salary + sponsorship + business - player.salary * expenseRate + investment)
    player.wealth = Math.max(0, player.wealth + income)
    return Number(income.toFixed(1))
  }
}
