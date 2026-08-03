<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { ArrowRight, BadgeCheck, Trophy } from 'lucide-vue-next'
import { useGameStore } from '../stores/game'
import type { Position } from '../models/game'
import { clubMonogram, countries, countryByName, positions } from '../data/football'

const store = useGameStore()
const form = reactive({ name: '', country: countries[0].name, position: 'Delantero' as Position, club: countries[0].clubs[0] })
const selectedCountry = computed(() => countryByName(form.country))
const monogram = computed(() => clubMonogram(form.club))

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
            <span class="select-wrap club-select"><i aria-hidden="true">{{ monogram }}</i><select v-model="form.club"><option v-for="club in selectedCountry.clubs" :key="club">{{ club }}</option></select></span>
          </label>
        </div>
        <label>Posición
          <div class="segmented">
            <button v-for="position in positions" :key="position.value" type="button" :class="{ active: form.position === position.value }" @click="form.position = position.value">
              <b class="position-icon" aria-hidden="true">{{ position.icon }}</b>
              <span>{{ position.short }}</span><small>{{ position.value }}</small>
            </button>
          </div>
        </label>
        <button class="primary start-game" type="submit"><span>COMENZAR CARRERA</span><ArrowRight :size="18" /></button>
      </form>
    </section>
  </main>
</template>
