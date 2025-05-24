import { defineStore } from 'pinia'
import { equipoService } from '@/services'

import Equipo from '@/class/equipo'
interface State {
  equipoList: Equipo[]
  equipo: Equipo | null
  error: unknown
}
export const useEquipoStore = defineStore('equipoStore', {
  state: (): State => ({
    equipoList: [],
    equipo: null,
    error: null,
  }),

  actions: {
    async getEquipoList() {
      try {
        const response = await equipoService.getEquipoList()
        this.equipoList = response.data
      } catch (err) {
        this.error = err
      }
    },

    async getEquipo(search: string) {
      try {
        const response = await equipoService.getEquipo(search)
        this.equipo = response.data
        this.error = null
      } catch (err) {
        this.error = err
      }
    },

    async addEquipo(nuevoEquipo: Equipo) {
      try {
        await equipoService.saveEquipo(nuevoEquipo)
        await this.getEquipoList()
      } catch (err) {
        this.error = err
      }
    },

    async removeEquipo(id: string) {
      try {
        await equipoService.deleteEquipo(id)
        await this.getEquipoList()
      } catch (err) {
        this.error = err
      }
    },
  },
})
