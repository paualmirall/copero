import clubs from '../data/clubs/clubs.json'
import type { Player, Strategies } from '../models/game'
export class TransferEngine {
  constructor(private readonly random = Math.random) {}
  calculate(player: Player, strategies: Strategies) {
    const chance = strategies.career === 'Dinero' ? .28 : strategies.career === 'Títulos' ? .22 : .1
    if (this.random() > chance) return undefined
    const suitable = clubs.filter((club) => club.name !== player.club && Math.abs(club.level - player.rating) < 12)
    if (!suitable.length) return undefined
    const club = suitable[Math.floor(this.random() * suitable.length)]
    player.club = club.name
    player.salary = Number(Math.max(.5, club.level / 16 - 3).toFixed(1))
    return `Nuevo desafío en ${club.name}`
  }
}
