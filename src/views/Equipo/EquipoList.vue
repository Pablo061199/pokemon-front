<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Listado de Equipos</h2>
      <button
        class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        @click="handleAddEquipo"
      >
        Agregar nuevo equipo
      </button>
    </div>

    <BaseTable :data="formattedEquipos" @row-click="handleRowClick">
      <template #actions="{ item }">
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded"
          @click.stop="deleteRow(item.ID)"
        >
          Eliminar
        </button>
      </template>
    </BaseTable>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useEquipoStore } from '@/stores/equipoStore'
import BaseTable from '@/components/BaseTable.vue'
import { useRouter } from 'vue-router'

const equipoStore = useEquipoStore()
const router = useRouter()

type EquipoRow = {
  ID: string
  Nombre: string
  Pokemones: string
}

onMounted(() => {
  equipoStore.getEquipoList()
})

const formattedEquipos = computed(() => {
  return equipoStore.equipoList.map((equipo) => ({
    ID: equipo.id,
    Nombre: equipo.name,
    Pokemones: equipo.pokemons.map((p) => p.Nombre).join(', '),
  }))
})

function handleRowClick(item: Record<string, unknown>): void {
  const equipo = item as EquipoRow
  router.push({ name: 'EquipoDetalle', params: { id: equipo.ID } })
}

function handleAddEquipo() {
  router.push({ name: 'EquipoDetalle' })
}
async function deleteRow(id: string) {
  const confirmacion = window.confirm(`¿Estás seguro de que quieres eliminar al equipo ${id}?`)
  if (confirmacion) {
    await equipoStore.removeEquipo(id)
    await equipoStore.getEquipoList()
  } else {
    console.log('Eliminación cancelada por el usuario.')
  }
}
</script>
