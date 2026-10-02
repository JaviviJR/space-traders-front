<script setup lang="ts">
import FeatureItem from './FeatureItem.vue'

interface Feature {
  id: string
  icon: string
  title: string
  description: string
}

const features: Feature[] = [
  {
    id: 'fleet',
    icon: 'icon-[lucide--rocket]',
    title: 'Gestiona tu flota',
    description: 'Compra naves, equípalas y muévelas entre waypoints.',
  },
  {
    id: 'trade',
    icon: 'icon-[lucide--coins]',
    title: 'Comercia',
    description: 'Consulta mercados y encuentra las rutas más rentables.',
  },
  {
    id: 'explore',
    icon: 'icon-[lucide--telescope]',
    title: 'Explora',
    description: 'Descubre sistemas, asteroides y puertas de salto.',
  },
  {
    id: 'contracts',
    icon: 'icon-[lucide--scroll-text]',
    title: 'Cumple contratos',
    description: 'Acepta encargos de las facciones y gana créditos y reputación.',
  },
]
</script>

<template>
  <section id="features" class="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
    <div class="text-center">
      <h2 class="text-gradient font-display text-4xl tracking-tight text-balance">
        ¿Qué puedes hacer?
      </h2>
      <p class="mx-auto mt-4 max-w-3xl text-xl text-pretty text-slate-400">
        Todo lo que permite la API de SpaceTraders, desde el navegador y sin escribir código.
      </p>
    </div>
    <dl class="mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-2 md:gap-x-8">
      <FeatureItem
        v-for="feature in features"
        :key="feature.id"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
      />
    </dl>
  </section>
</template>
