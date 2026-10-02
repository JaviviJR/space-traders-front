<script setup lang="ts">
import FeatureCard from './FeatureCard.vue'

interface Feature {
  id: string
  icon: string
  title: string
  description: string
}

const features: Feature[] = [
  {
    id: 'fleet',
    icon: '🚀',
    title: 'Gestiona tu flota',
    description: 'Compra naves, equípalas y muévelas entre waypoints.',
  },
  {
    id: 'trade',
    icon: '💰',
    title: 'Comercia',
    description: 'Consulta mercados y encuentra las rutas más rentables.',
  },
  {
    id: 'explore',
    icon: '🛰️',
    title: 'Explora',
    description: 'Descubre sistemas, asteroides y puertas de salto.',
  },
  {
    id: 'contracts',
    icon: '📜',
    title: 'Cumple contratos',
    description: 'Acepta encargos de las facciones y gana créditos y reputación.',
  },
]
</script>

<template>
  <section id="features" class="mx-auto max-w-6xl px-4 py-20">
    <h2 class="text-center text-3xl font-bold text-white">¿Qué puedes hacer?</h2>
    <div class="mt-12 grid gap-6 sm:grid-cols-2">
      <FeatureCard
        v-for="feature in features"
        :key="feature.id"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
      />
    </div>
  </section>
</template>
