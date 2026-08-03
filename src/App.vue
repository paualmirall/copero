<script setup lang="ts">
import { ref, watch } from 'vue'; import { useGameStore } from './stores/game'; import CreatePlayer from './pages/CreatePlayer.vue'; import SeasonPage from './pages/SeasonPage.vue'; import SeasonResult from './pages/SeasonResult.vue'; import CareerSummary from './pages/CareerSummary.vue'
const store=useGameStore(); const screen=ref<'season'|'result'|'summary'>(store.state ? (store.finished?'summary':'season') : 'season'); watch(()=>store.state,()=>{if(!store.state)screen.value='season'})
</script>
<template><CreatePlayer v-if="!store.state"/><CareerSummary v-else-if="screen==='summary'"/><SeasonResult v-else-if="screen==='result'" @next="screen=store.finished?'summary':'season'"/><SeasonPage v-else @played="screen='result'"/></template>
