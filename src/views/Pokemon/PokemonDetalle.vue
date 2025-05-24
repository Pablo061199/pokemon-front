<template>
  <div v-if="!errorComputed && pokemon">
    <div class="flex items-center gap-6">
      <img
        :src="
          pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default
        "
        :alt="pokemon.name"
        class="w-40 h-40 object-contain"
      />
      <h1 class="text-4xl font-bold capitalize">{{ pokemon.name }}</h1>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm text-gray-700">
      <div>
        <p class="font-semibold">Altura</p>
        <p>{{ pokemon.height / 10 }} m</p>
      </div>
      <div>
        <p class="font-semibold">Peso</p>
        <p>{{ pokemon.weight / 10 }} kg</p>
      </div>
      <div>
        <p class="font-semibold">Experiencia base</p>
        <p>{{ pokemon.base_experience }}</p>
      </div>
      <div>
        <p class="font-semibold">Tipos</p>
        <div class="flex gap-2 mt-1">
          <span
            v-for="type in pokemon.types"
            :key="type.type.name"
            class="px-2 py-1 rounded-full text-white text-xs font-medium"
            :class="getTypeColor(type.type.name)"
          >
            {{ type.type.name }}
          </span>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <p class="font-semibold text-lg">Habilidades</p>
      <ul class="list-disc list-inside text-sm text-gray-800 mt-1">
        <li v-for="ab in pokemon.abilities" :key="ab.ability.name" class="capitalize">
          {{ ab.ability.name }}
        </li>
      </ul>
    </div>

    <div class="mt-6">
      <p class="font-semibold text-lg mb-2">Estadísticas base</p>
      <div class="space-y-2">
        <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="text-sm">
          <div class="flex justify-between">
            <span class="capitalize">{{ stat.stat.name }}</span>
            <span class="font-semibold">{{ stat.base_stat }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-500 h-2 rounded-full"
              :style="{ width: stat.base_stat + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center text-gray-500">Pokémon no encotrado...</div>
  <div class="mt-8" style="margin-top: 20px">
    <button
      class="bg-gray-800 text-white px-4 py-2 mt-3 rounded hover:bg-gray-700"
      @click="router.back()"
    >
      ← Volver
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePokemonStore } from '@/stores/pokemonStore'

const route = useRoute()
const router = useRouter()
const pokemonStore = usePokemonStore()

onMounted(() => {
  pokemonStore.getPokemon(String(route.params.id))
})

const pokemon = computed(() => pokemonStore.pokemon)

function getTypeColor(type: string): string {
  const map: Record<string, string> = {
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    grass: 'bg-green-500',
    electric: 'bg-yellow-400 text-black',
    ice: 'bg-cyan-400',
    ground: 'bg-yellow-700',
    rock: 'bg-gray-600',
    psychic: 'bg-pink-500',
    fighting: 'bg-orange-600',
    dark: 'bg-gray-800',
    steel: 'bg-gray-400',
    fairy: 'bg-pink-300 text-black',
    poison: 'bg-purple-500',
    bug: 'bg-lime-600',
    dragon: 'bg-indigo-700',
    ghost: 'bg-purple-700',
    normal: 'bg-gray-300 text-black',
    flying: 'bg-indigo-300 text-black',
  }
  return map[type] || 'bg-gray-200 text-black'
}
const errorComputed = computed(() => {
  return pokemonStore.error
})
</script>
