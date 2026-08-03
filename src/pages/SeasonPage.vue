<script setup lang="ts">
import { computed, reactive } from 'vue'
import { Play, SlidersHorizontal, Sparkles } from 'lucide-vue-next'
import { clubMonogram, countryByName, positions } from '../data/football'
import { useGameStore } from '../stores/game'

const emit = defineEmits<{ played: [] }>()
const store = useGameStore()
const choices = reactive<Record<string, string>>({})
const strategies = [
  { key: 'training', label: 'Entrenamiento', options: [['Bajo', 'Suave', 'Protege el físico, pero limita la mejora.'], ['Normal', 'Normal', 'Equilibra progreso y recuperación.'], ['Alto', 'Intenso', 'Mejora la media con mayor riesgo físico.']] },
  { key: 'money', label: 'Finanzas', options: [['Ahorrar', 'Ahorrar', 'Prioriza el crecimiento del patrimonio.'], ['Bienestar', 'Vivir', 'Mejora la moral a cambio de ahorrar menos.'], ['Invertir', 'Invertir', 'Busca ingresos futuros con más incertidumbre.']] },
  { key: 'image', label: 'Perfil público', options: [['Perfil bajo', 'Bajo', 'Reduce exposición y popularidad.'], ['Equilibrado', 'Medio', 'Mantiene una presencia pública estable.'], ['Mediático', 'Estrella', 'Aumenta rápido la popularidad.']] },
  { key: 'career', label: 'Ambición', options: [['Minutos', 'Jugar', 'Favorece tener más partidos esta temporada.'], ['Dinero', 'Cobrar', 'Prioriza contratos e ingresos.'], ['Títulos', 'Ganar', 'Eleva las opciones de competir por trofeos.']] },
] as const
const player = computed(() => store.state!.player)
const country = computed(() => countryByName(player.value.country))
const position = computed(() => positions.find((item) => item.value === player.value.position)?.short ?? player.value.position)
const selectedEffect = (strategy: typeof strategies[number]) => strategy.options.find((option) => option[0] === store.state!.strategies[strategy.key])?.[2]
const selectedChoice = (eventId: string) => {
  const event = store.currentEvents.find((item) => item.id === eventId)
  return event?.choices.find((choice) => choice.id === (choices[eventId] || event.choices[0]?.id))
}
function play() { store.playSeason(choices); emit('played') }
</script>

<template>
  <main v-if="store.state" class="game-shell pitch-shell">
    <header class="scoreboard">
      <div class="team-crest" aria-hidden="true">{{ clubMonogram(player.club) }}</div>
      <div class="scoreboard-player"><b>{{ player.name }}</b><span>{{ country.flag }} {{ player.country }} · {{ position }} · {{ player.club }}</span></div>
      <dl class="score-stats">
        <div><dt>EDAD</dt><dd>{{ player.age }}</dd></div><div><dt>MED</dt><dd>{{ player.rating }}</dd></div><div><dt>PJ</dt><dd>{{ store.totals.matches }}</dd></div><div><dt>G</dt><dd>{{ store.totals.goals }}</dd></div><div><dt>A</dt><dd>{{ store.totals.assists }}</dd></div>
      </dl>
    </header>
    <section class="season-board">
      <div class="season-heading"><span>⚽ TEMPORADA</span><strong>{{ player.age }} AÑOS</strong><small>{{ country.league }}</small></div>
      <div class="season-columns">
        <section class="game-panel strategies-panel">
          <div class="game-panel-title"><SlidersHorizontal :size="16" /><h2>Estrategia</h2></div>
          <div class="strategy-grid">
            <fieldset v-for="strategy in strategies" :key="strategy.key" class="strategy-card">
              <legend>{{ strategy.label }}</legend>
              <div class="mini-segments"><button v-for="option in strategy.options" :key="option[0]" type="button" :class="{ selected: store.state.strategies[strategy.key] === option[0] }" @click="store.state.strategies[strategy.key] = option[0]">{{ option[1] }}</button></div>
              <p>{{ selectedEffect(strategy) }}</p>
            </fieldset>
          </div>
        </section>
        <section class="game-panel events-panel">
          <div class="game-panel-title"><Sparkles :size="16" /><h2>Decisiones clave</h2><span>{{ store.currentEvents.length }}</span></div>
          <div class="events-scroll">
            <article v-for="event in store.currentEvents" :key="event.id" class="decision-row">
              <div class="decision-copy"><span>{{ event.category }}</span><h3>{{ event.title }}</h3><p>{{ event.description }}</p></div>
              <label>Tu decisión<select v-model="choices[event.id]"><option v-for="choice in event.choices" :key="choice.id" :value="choice.id">{{ choice.label }}</option></select></label>
              <p class="choice-effect">{{ selectedChoice(event.id)?.description }}</p>
            </article>
          </div>
        </section>
      </div>
      <button class="kickoff" type="button" @click="play"><Play fill="currentColor" :size="17" /> JUGAR TEMPORADA · {{ player.age }} AÑOS</button>
    </section>
  </main>
</template>
