<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { ArrowRight, BadgeCheck, Shield, Trophy } from 'lucide-vue-next'
import { useGameStore } from '../stores/game'
import type { Position } from '../models/game'

type Country = { name: string; flag: string; league: string; clubs: string[] }

const countries: Country[] = [
  { name: 'España', flag: '🇪🇸', league: 'Primera División', clubs: ['Real Madrid', 'FC Barcelona', 'Atlético de Madrid', 'Athletic Club'] },
  { name: 'Inglaterra', flag: '🇬🇧', league: 'Premier League', clubs: ['Manchester City', 'Liverpool', 'Arsenal', 'Chelsea'] },
  { name: 'Italia', flag: '🇮🇹', league: 'Serie A', clubs: ['Inter de Milán', 'AC Milan', 'Juventus', 'Napoli'] },
  { name: 'Alemania', flag: '🇩🇪', league: 'Bundesliga', clubs: ['Bayern Múnich', 'Borussia Dortmund', 'Bayer Leverkusen', 'RB Leipzig'] },
  { name: 'Francia', flag: '🇫🇷', league: 'Ligue 1', clubs: ['Paris Saint-Germain', 'Olympique de Marsella', 'AS Monaco', 'Olympique de Lyon'] },
  { name: 'Portugal', flag: '🇵🇹', league: 'Primeira Liga', clubs: ['Benfica', 'FC Porto', 'Sporting CP', 'Braga'] },
  { name: 'Países Bajos', flag: '🇳🇱', league: 'Eredivisie', clubs: ['Ajax', 'PSV Eindhoven', 'Feyenoord', 'AZ Alkmaar'] },
  { name: 'Argentina', flag: '🇦🇷', league: 'Liga Profesional', clubs: ['River Plate', 'Boca Juniors', 'Racing Club', 'Rosario Central'] },
]

const store = useGameStore()
const form = reactive({ name: '', country: countries[0].name, position: 'Delantero' as Position, club: countries[0].clubs[0] })
const positions: { value: Position; short: string }[] = [
  { value: 'Delantero', short: 'DEL' }, { value: 'Mediocampista', short: 'MED' },
  { value: 'Defensor', short: 'DEF' }, { value: 'Arquero', short: 'POR' },
]
const selectedCountry = computed(() => countries.find((country) => country.name === form.country) ?? countries[0])
const clubMonogram = computed(() => form.club.split(' ').filter((word) => word.length > 2).slice(0, 2).map((word) => word[0]).join('').toUpperCase())

watch(() => form.country, () => { form.club = selectedCountry.value.clubs[0] })
</script>

<template>
  <main class="create-shell">
    <section class="hero-copy">
      <div class="brand"><span class="brand-mark"><Trophy :size="20" /></span>COPERO</div>
      <div class="hero-content">
        <p class="eyebrow">TU HISTORIA. TUS DECISIONES.</p>
        <h1>El fútbol recuerda<br><em>a los que se atreven.</em></h1>
        <p class="lead">Dieciséis años. Un primer contrato. Toda una carrera por escribir.</p>
      </div>
      <div class="career-path"><span>DEBUT</span><i /><span>LEYENDA</span></div>
    </section>

    <section class="form-card">
      <div class="form-title">
        <p class="step">NUEVA PARTIDA · CREA TU PRO</p>
        <h2>Ficha del jugador</h2>
        <span class="save-status"><BadgeCheck :size="13" /> Guardado automático</span>
      </div>
      <form @submit.prevent="store.createPlayer(form)">
        <label class="name-field">Nombre<input v-model="form.name" required maxlength="24" placeholder="Ej. Mateo Álvarez"></label>
        <div class="field-row">
          <label>País y liga
            <span class="select-wrap"><b>{{ selectedCountry.flag }}</b><select v-model="form.country"><option v-for="country in countries" :key="country.name" :value="country.name">{{ country.name }} · {{ country.league }}</option></select></span>
          </label>
          <label>Primer club
            <span class="select-wrap club-select"><i>{{ clubMonogram }}</i><select v-model="form.club"><option v-for="club in selectedCountry.clubs" :key="club">{{ club }}</option></select></span>
          </label>
        </div>
        <label>Posición
          <div class="segmented">
            <button v-for="position in positions" :key="position.value" type="button" :class="{ active: form.position === position.value }" @click="form.position = position.value">
              <Shield :size="15" :fill="form.position === position.value ? 'currentColor' : 'none'" />
              <span>{{ position.short }}</span><small>{{ position.value }}</small>
            </button>
          </div>
        </label>
        <button class="primary start-game" type="submit"><span>COMENZAR CARRERA</span><ArrowRight :size="18" /></button>
      </form>
    </section>
  </main>
</template>
