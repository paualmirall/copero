import type { Position } from '../models/game'

export interface CountryData {
  name: string
  flag: string
  league: string
  clubs: string[]
}

export const countries: CountryData[] = [
  { name: 'España', flag: '🇪🇸', league: 'Primera División', clubs: ['Real Madrid', 'FC Barcelona', 'Atlético de Madrid', 'Athletic Club'] },
  { name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', league: 'Premier League', clubs: ['Manchester City', 'Liverpool', 'Arsenal', 'Chelsea'] },
  { name: 'Italia', flag: '🇮🇹', league: 'Serie A', clubs: ['Inter de Milán', 'AC Milan', 'Juventus', 'Napoli'] },
  { name: 'Alemania', flag: '🇩🇪', league: 'Bundesliga', clubs: ['Bayern Múnich', 'Borussia Dortmund', 'Bayer Leverkusen', 'RB Leipzig'] },
  { name: 'Francia', flag: '🇫🇷', league: 'Ligue 1', clubs: ['Paris Saint-Germain', 'Olympique de Marsella', 'AS Monaco', 'Olympique de Lyon'] },
  { name: 'Portugal', flag: '🇵🇹', league: 'Primeira Liga', clubs: ['Benfica', 'FC Porto', 'Sporting CP', 'Braga'] },
  { name: 'Países Bajos', flag: '🇳🇱', league: 'Eredivisie', clubs: ['Ajax', 'PSV Eindhoven', 'Feyenoord', 'AZ Alkmaar'] },
  { name: 'Argentina', flag: '🇦🇷', league: 'Liga Profesional', clubs: ['River Plate', 'Boca Juniors', 'Racing Club', 'Rosario Central'] },
]

export const positions: { value: Position; short: string; icon: string }[] = [
  { value: 'Delantero', short: 'DEL', icon: '⚽' },
  { value: 'Mediocampista', short: 'MED', icon: '◆' },
  { value: 'Defensor', short: 'DEF', icon: '🛡' },
  { value: 'Arquero', short: 'POR', icon: '✋' },
]

export const countryByName = (name: string) => countries.find((country) => country.name === name) ?? countries[0]

export const firstValidClub = (country: string) => countryByName(country).clubs[0]

export function clubMonogram(club: string) {
  return club.split(' ').filter((word) => word.length > 2).slice(0, 2).map((word) => word[0]).join('').toUpperCase() || club.slice(0, 2).toUpperCase()
}
