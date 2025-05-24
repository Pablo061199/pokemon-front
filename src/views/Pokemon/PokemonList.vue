<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar Pokémon por nombre..."
        class="w-full max-w-sm px-4 py-2 border border-gray-300 rounded shadow-sm"
        @keyup.enter="handleEnter"
      />
      <select v-model="orden" @change="ordenarPokemones" class="select-orden">
        <option value="desc">Mayor a menor poder</option>
        <option value="asc">Menor a mayor poder</option>
      </select>
    </div>
    <BaseTable
      :data="pokemonStore.pokemonList.map(formatPokemon)"
      :pagination="{ total: pokemonStore.total, page: currentPage, limit: pageSize }"
      @row-click="handleClick"
      @page-changed="pageChanged"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { usePokemonStore } from '@/stores/pokemonStore'
import BaseTable from '@/components/BaseTable.vue'
import type { Pokemon as PokemonDetalle } from '@/class/equipo'
import { useRouter } from 'vue-router'

const router = useRouter()
const pokemonStore = usePokemonStore()
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

onMounted(() => {
  pokemonStore.getListPokemon()
})

function handleClick(item: Record<string, unknown>) {
  router.push({ name: 'Pokemon', params: { id: item.Nombre } })
}

function handleEnter() {
  const name = search.value.trim().toLowerCase()
  if (name) {
    router.push({ name: 'Pokemon', params: { id: name } })
  }
}
function formatPokemon(pokemon: unknown): {
  Imagen: string
  Nombre: string
  Tipo: string
  Poder: number
} {
  if (
    typeof pokemon !== 'object' ||
    pokemon === null ||
    !('name' in pokemon) ||
    !('types' in pokemon) ||
    !('sprites' in pokemon) ||
    !('stats' in pokemon)
  ) {
    return {
      Imagen: '',
      Nombre: 'Desconocido',
      Tipo: 'Desconocido',
      Poder: 0,
    }
  }

  const p = pokemon as PokemonDetalle
  // Suma los base_stat para calcular poder total
  const poderTotal = p.stats.reduce((sum, stat) => sum + (stat.base_stat || 0), 0)

  return {
    Imagen: p.sprites.other['official-artwork'].front_default || '',
    Nombre: p.name,
    Tipo: p.types.map((t) => t.type.name).join(', '),
    Poder: poderTotal,
  }
}

function pageChanged(page: number) {
  currentPage.value = page
  pokemonStore.getPokemonPagination(currentPage.value, pageSize.value)
}
function ordenarPokemones() {
  currentPage.value = 1
  pokemonStore.getPokemonPagination(currentPage.value, pageSize.value)
}
watch(
  () => pokemonStore.statusList,
  (newStatusList) => {
    if (newStatusList === '200') {
      pokemonStore.getPokemonPagination(1, 20)
    }
  },
  { immediate: true },
)
</script>
