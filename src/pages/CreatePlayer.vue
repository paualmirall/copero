<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ArrowLeft, ArrowRight, Check, ChevronRight, Trophy } from 'lucide-vue-next'
import clubs from '../data/clubs/clubs.json'
import { useGameStore } from '../stores/game'
import type { Position } from '../models/game'

const store = useGameStore()
const step = ref(1)
const form = reactive({ name: '', country: 'Argentina', position: 'Delantero' as Position, club: clubs[0].name })
const positions: { name: Position; code: string }[] = [
  { name: 'Delantero', code: 'DEL' }, { name: 'Mediocampista', code: 'MED' },
  { name: 'Defensor', code: 'DEF' }, { name: 'Arquero', code: 'ARQ' },
]
const countries = [
  ['Argentina','🇦🇷'],['España','🇪🇸'],['Inglaterra','🏴'],['Alemania','🇩🇪'],['Italia','🇮🇹'],
  ['Francia','🇫🇷'],['Portugal','🇵🇹'],['Países Bajos','🇳🇱'],['Bélgica','🇧🇪'],['Croacia','🇭🇷'],
  ['Uruguay','🇺🇾'],['Brasil','🇧🇷'],['Colombia','🇨🇴'],['México','🇲🇽'],['Chile','🇨🇱'],
]
const selectedClub = computed(() => clubs.find((club) => club.name === form.club) ?? clubs[0])
watch(() => form.country, (country) => {
  const localClub = clubs.find((club) => club.country === country)
  if (localClub) form.club = localClub.name
})
function next() { if (form.name.trim()) step.value = 2 }
</script>

<template>
  <main class="create-shell game-onboarding">
    <section class="hero-copy">
      <div class="brand"><span class="brand-mark"><Trophy :size="20" /></span>COPERO</div>
      <div class="hero-content">
        <p class="eyebrow">TU HISTORIA. TUS DECISIONES.</p>
        <h1>El fútbol recuerda<br><em>a los que se atreven.</em></h1>
        <p class="lead">Empieza con 18 años. Decide dentro y fuera de la cancha. Conviértete en leyenda.</p>
      </div>
      <div class="career-path"><span>DEBUT</span><i /><span>ÉLITE</span><i /><span>LEYENDA</span></div>
    </section>

    <section class="form-card player-builder">
      <div class="builder-top">
        <div><p class="step">CREAR JUGADOR · {{ step }}/2</p><h2>{{ step === 1 ? 'Tu identidad' : 'Elige tu escudo' }}</h2></div>
        <div class="step-dots"><i :class="{ active: step === 1 }" /><i :class="{ active: step === 2 }" /></div>
      </div>

      <form v-if="step === 1" class="identity-form" @submit.prevent="next">
        <label>Nombre del jugador<input v-model="form.name" required maxlength="24" autofocus placeholder="¿Cómo te llamarán las gradas?" /></label>
        <label>País<select v-model="form.country"><option v-for="country in countries" :key="country[0]" :value="country[0]">{{ country[1] }}&nbsp; {{ country[0] }}</option></select></label>
        <fieldset><legend>Posición</legend><div class="position-grid"><button v-for="position in positions" :key="position.code" type="button" :class="{ active: form.position === position.name }" @click="form.position = position.name"><span>{{ position.code }}</span><b>{{ position.name }}</b><Check v-if="form.position === position.name" :size="13" /></button></div></fieldset>
        <button class="primary builder-action" type="submit">ELEGIR CLUB <ChevronRight :size="18" /></button>
      </form>

      <div v-else class="club-step">
        <button class="back-button" @click="step = 1"><ArrowLeft :size="15" /> Cambiar jugador</button>
        <div class="selected-club"><img :src="selectedClub.crest" :alt="`Escudo de ${selectedClub.name}`"><div><span>PRIMER CONTRATO</span><strong>{{ selectedClub.shortName }}</strong><small>{{ selectedClub.country }} · NIVEL {{ selectedClub.level }}</small></div></div>
        <div class="club-list" role="listbox" aria-label="Club inicial"><button v-for="club in clubs" :key="club.name" type="button" :class="{ active: form.club === club.name }" @click="form.club = club.name"><img :src="club.crest" :alt="" loading="lazy"><span><b>{{ club.shortName }}</b><small>{{ club.country }}</small></span><Check v-if="form.club === club.name" :size="15" /></button></div>
        <button class="primary builder-action" @click="store.createPlayer(form)">FIRMAR Y COMENZAR <ArrowRight :size="18" /></button>
      </div>
      <small class="autosave">Guardado automático · Sin registro</small>
    </section>
  </main>
</template>
