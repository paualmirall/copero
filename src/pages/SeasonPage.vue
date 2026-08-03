<script setup lang="ts">
import { computed, reactive } from 'vue'
import { Activity, Goal, Play, Shield, Sparkles, Swords, Trophy } from 'lucide-vue-next'
import { useGameStore } from '../stores/game'

const emit = defineEmits<{ played: [] }>()
const store = useGameStore()
const choices = reactive<Record<string, string>>({})
const strategies = [
  { key: 'training', label: 'Entreno', icon: Activity, options: [['Bajo', 'Suave', 'Cuida el físico'], ['Normal', 'Mixto', 'Mejora estable'], ['Alto', 'Intenso', 'Sube la media']] },
  { key: 'money', label: 'Finanzas', icon: Trophy, options: [['Ahorrar', 'Ahorrar', 'Fondo seguro'], ['Bienestar', 'Vivir', 'Mejora el ánimo'], ['Invertir', 'Invertir', 'Busca rentabilidad']] },
  { key: 'image', label: 'Perfil', icon: Sparkles, options: [['Perfil bajo', 'Discreto', 'Evita presión'], ['Equilibrado', 'Cercano', 'Fama controlada'], ['Mediático', 'Estrella', 'Máxima popularidad']] },
  { key: 'career', label: 'Ambición', icon: Swords, options: [['Minutos', 'Jugar', 'Más partidos'], ['Dinero', 'Contrato', 'Mejor salario'], ['Títulos', 'Trofeos', 'Busca la gloria']] },
] as const
const flags: Record<string, string> = { España: '🇪🇸', Inglaterra: '🇬🇧', Italia: '🇮🇹', Alemania: '🇩🇪', Francia: '🇫🇷', Portugal: '🇵🇹', 'Países Bajos': '🇳🇱', Argentina: '🇦🇷', México: '🇲🇽', Colombia: '🇨🇴', Uruguay: '🇺🇾', Chile: '🇨🇱' }
const clubMonogram = computed(() => store.state?.player.club.split(' ').filter((word) => word.length > 2).slice(0, 2).map((word) => word[0]).join('').toUpperCase() || 'FC')
const careerStats = computed(() => (store.state?.history ?? []).reduce((totals, season) => ({ matches: totals.matches + season.matches, goals: totals.goals + season.goals, assists: totals.assists + season.assists }), { matches: 0, goals: 0, assists: 0 }))
const selectedHint = (key: typeof strategies[number]['key']) => strategies.find((item) => item.key === key)?.options.find((option) => option[0] === store.state?.strategies[key])?.[2]

function play() { store.playSeason(choices); emit('played') }
</script>

<template>
  <main v-if="store.state" class="game-shell football-theme">
    <header class="topbar">
      <div class="brand small"><Goal :size="16" /> COPERO</div>
      <div class="season-label"><span>CARRERA</span><strong>{{ store.state.player.age }} AÑOS</strong></div>
      <div class="player-mini"><b>{{ store.state.player.name }}</b><span>{{ store.state.player.club }}</span></div>
    </header>
    <section class="dashboard">
      <div class="player-scorecard">
        <div class="player-badge"><span>{{ flags[store.state.player.country] || '🌍' }}</span><i>{{ clubMonogram }}</i></div>
        <div class="player-name"><p>{{ store.state.player.position }} · {{ store.state.player.country }}</p><h1>{{ store.state.player.name }}</h1></div>
        <div class="live-stats">
          <div><strong>{{ store.state.player.rating }}</strong><span>MEDIA</span></div><div><strong>{{ careerStats.matches }}</strong><span>PJ</span></div><div><strong>{{ careerStats.goals }}</strong><span>GOLES</span></div><div><strong>{{ careerStats.assists }}</strong><span>ASIST.</span></div>
        </div>
      </div>
      <div class="columns season-board">
        <section class="panel tactics-panel">
          <div class="pitch-mark"><i /><span /></div>
          <div class="panel-heading"><Shield :size="17" /><div><h2>Tu vestuario</h2><p>Define la mentalidad para esta temporada.</p></div></div>
          <div class="tactic-grid">
            <article v-for="strategy in strategies" :key="strategy.key" class="tactic-card">
              <header><component :is="strategy.icon" :size="13" /><h3>{{ strategy.label }}</h3></header>
              <div class="toggle-group"><button v-for="option in strategy.options" :key="option[0]" :class="{ selected: store.state.strategies[strategy.key] === option[0] }" @click="store.state.strategies[strategy.key] = option[0]">{{ option[1] }}</button></div>
              <small>{{ selectedHint(strategy.key) }}</small>
            </article>
          </div>
        </section>
        <section class="panel events">
          <div class="panel-heading"><Sparkles :size="17" /><div><h2>Decisiones clave</h2><p>Cada respuesta cambia tu historia.</p></div></div>
          <article v-for="event in store.currentEvents" :key="event.id" class="event-card compact-event">
            <div><span class="event-tag">{{ event.category }}</span><h3>{{ event.title }}</h3><p>{{ event.description }}</p></div>
            <select v-model="choices[event.id]" :aria-label="`Decisión: ${event.title}`"><option v-for="choice in event.choices" :key="choice.id" :value="choice.id">{{ choice.label }} — {{ choice.description }}</option></select>
          </article>
        </section>
      </div>
      <button class="play-button" @click="play"><span><Play fill="currentColor" :size="18" /> JUGAR CON {{ store.state.player.age }} AÑOS</span><small>Simular temporada</small></button>
    </section>
  </main>
</template>
