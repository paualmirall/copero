<script setup lang="ts">
import { reactive } from 'vue'
import { Play, SlidersHorizontal, Sparkles } from 'lucide-vue-next'
import StatPill from '../components/StatPill.vue'
import { useGameStore } from '../stores/game'

const emit = defineEmits<{ played: [] }>()
const store = useGameStore()
const choices = reactive<Record<string, string>>({})
const strategies = [
  { key: 'training', label: 'Entreno', options: [['Bajo', 'Suave'], ['Normal', 'Normal'], ['Alto', 'Intenso']] },
  { key: 'money', label: 'Dinero', options: [['Ahorrar', 'Ahorrar'], ['Bienestar', 'Vivir'], ['Invertir', 'Invertir']] },
  { key: 'image', label: 'Imagen', options: [['Perfil bajo', 'Bajo'], ['Equilibrado', 'Balance'], ['Mediático', 'Estrella']] },
  { key: 'career', label: 'Objetivo', options: [['Minutos', 'Jugar'], ['Dinero', 'Cobrar'], ['Títulos', 'Ganar']] },
] as const

function play() { store.playSeason(choices); emit('played') }
</script>

<template>
  <main v-if="store.state" class="game-shell">
    <header class="topbar">
      <div class="brand small">COPERO</div>
      <div class="season-label">TEMPORADA <strong>{{ store.state.player.season }}</strong></div>
      <div class="player-mini"><b>{{ store.state.player.name }}</b><span>{{ store.state.player.club }}</span></div>
    </header>
    <section class="dashboard">
      <div class="identity">
        <div><p>{{ store.state.player.position.toUpperCase() }} · {{ store.state.player.country.toUpperCase() }}</p><h1>{{ store.state.player.name }}</h1></div>
        <div class="stats-row"><StatPill label="EDAD" :value="store.state.player.age" /><StatPill label="MEDIA" :value="store.state.player.rating" /><StatPill label="FORMA" :value="store.state.player.fitness" /><StatPill label="PATRIMONIO" :value="`${store.state.player.wealth.toFixed(1)} M€`" /></div>
      </div>
      <div class="columns">
        <section class="panel decisions">
          <div class="panel-heading"><SlidersHorizontal :size="17" /><div><h2>Plan de temporada</h2><p>Ajusta tu estilo de juego.</p></div></div>
          <div v-for="strategy in strategies" :key="strategy.key" class="strategy compact-strategy">
            <h3>{{ strategy.label }}</h3>
            <div class="option-grid toggle-group"><button v-for="option in strategy.options" :key="option[0]" :class="{ selected: store.state.strategies[strategy.key] === option[0] }" @click="store.state.strategies[strategy.key] = option[0]"><span>{{ option[1] }}</span></button></div>
          </div>
        </section>
        <section class="panel events">
          <div class="panel-heading"><Sparkles :size="17" /><div><h2>Momentos clave</h2><p>Decide cómo responder.</p></div></div>
          <article v-for="event in store.currentEvents" :key="event.id" class="event-card compact-event">
            <div><span class="event-tag">{{ event.category }}</span><h3>{{ event.title }}</h3></div>
            <select v-model="choices[event.id]" :aria-label="`Decisión: ${event.title}`">
              <option v-for="choice in event.choices" :key="choice.id" :value="choice.id">{{ choice.label }} · {{ choice.description }}</option>
            </select>
          </article>
        </section>
      </div>
      <button class="play-button" @click="play"><span><Play fill="currentColor" :size="18" /> JUGAR {{ store.state.player.season }}</span><small>Simular temporada</small></button>
    </section>
  </main>
</template>
