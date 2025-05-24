<template>
  <div class="p-6 max-w-10xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">
      {{ isEditMode ? 'Editar Equipo' : 'Nuevo Equipo' }}
    </h1>
    <form @submit.prevent="handleSave">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Equipo</label>
          <input
            type="text"
            v-model="form.name"
            class="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Código</label>
          <input
            type="text"
            :value="form.id || 'Será generado al guardar'"
            class="w-full bg-gray-100 border border-gray-300 rounded-md p-2"
            readonly
          />
        </div>
      </div>

      <div class="mt-6">
        <p class="text-lg font-semibold mb-2">Pokémon del Equipo</p>
        <BaseTable :data="form.pokemons" @row-click="deleteRow" />
      </div>

      <div class="mt-6">
        <p class="text-lg font-semibold mb-2">Pokémon Disponibles</p>
        <BaseTable
          :data="pokemonDisponibles.map(formatPokemon)"
          selectable
          @row-click="handleRowClick"
          @selected-changed="handleSelectedChanged"
        />
      </div>

      <div class="flex justify-end mt-6 gap-2">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Guardar
        </button>
        <router-link
          to="/equipos"
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseTable from '@/components/BaseTable.vue'
import Equipo from '@/class/equipo'
import type { Pokemon } from '@/class/equipo'
import { useEquipoStore } from '@/stores/equipoStore'

const route = useRoute()
const router = useRouter()
const equipoStore = useEquipoStore()

const isEditMode = ref(false)
const form = ref({
  name: '',
  id: '',
  pokemons: [] as Pokemon[],
})
const pokemonDisponibles = ref<Pokemon[]>([])

interface ApiPokemonResult {
  name: string
  url: string
}

interface ApiPokemonListResponse {
  results: ApiPokemonResult[]
}

function isPokemon(obj: unknown): obj is Pokemon {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    'height' in obj &&
    'weight' in obj &&
    'base_experience' in obj &&
    'sprites' in obj &&
    'types' in obj
  )
}

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    isEditMode.value = true
    await equipoStore.getEquipo(id)
    if (equipoStore.equipo) {
      form.value = new Equipo(equipoStore.equipo.name, equipoStore.equipo.pokemons)
      form.value.id = equipoStore.equipo.id
    }
  }

  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50')
  const results: ApiPokemonListResponse = await response.json()

  const detalles = await Promise.all(
    results.results.map(async (p) => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.name}`)
      return await res.json()
    }),
  )

  pokemonDisponibles.value = detalles.filter(isPokemon)
})

function formatPokemon(pokemon: unknown): { Imagen: string; Nombre: string; Tipo: string } {
  if (
    typeof pokemon !== 'object' ||
    pokemon === null ||
    !('name' in pokemon) ||
    !('types' in pokemon) ||
    !('sprites' in pokemon)
  ) {
    return {
      Imagen: '',
      Nombre: 'Desconocido',
      Tipo: 'Desconocido',
    }
  }

  const p = pokemon as Pokemon
  return {
    Imagen: p.sprites.other['official-artwork'].front_default || '',
    Nombre: p.name,
    Tipo: p.types.map((t) => t.type.name).join(', '),
  }
}

function handleRowClick(item: Record<string, unknown>) {
  const maybePokemon = item as unknown

  //if (!isPokemon(maybePokemon)) return
  if (form.value.pokemons.length >= 6) return
  form.value.pokemons.push(maybePokemon)
}
function deleteRow(item: Record<string, unknown>) {
  const confirmacion = window.confirm(`¿Estás seguro de que quieres eliminar a ${item.Nombre}?`)
  if (confirmacion) {
    const index = form.value.pokemons.findIndex((p) => p.Nombre === item.Nombre)
    if (index !== -1) {
      form.value.pokemons.splice(index, 1)
    }
  } else {
    console.log('Eliminación cancelada por el usuario.')
  }
}
function handleSelectedChanged(selected: Record<string, unknown>[]) {
  const nuevosPokemons = selected
    .map((item) => item as unknown)
    .filter(isPokemon)
    .filter((p) => form.value.pokemons.every((ep) => ep.name !== p.name))
    .slice(0, 6 - form.value.pokemons.length)

  form.value.pokemons.push(...nuevosPokemons)
}

async function handleSave() {
  if (isEditMode.value) {
    await equipoStore.removeEquipo(form.value.id)
    await equipoStore.addEquipo(form.value)
  } else {
    const pokemosEdit = new Equipo(form.value.name, form.value.pokemons)
    await equipoStore.addEquipo(pokemosEdit)
  }
  router.push('/equipos')
}
</script>
