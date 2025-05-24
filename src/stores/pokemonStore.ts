import { defineStore } from 'pinia'
import { pokemonService } from '@/services'

import Pokemon from '@/class/pokemon'

export const usePokemonStore = defineStore('pokemonStore', {
  state: () => ({
    pokemonList: [] as Pokemon[],
    statusList: '' as string,
    error: null as unknown,
    pokemon: null as unknown,
    total: 0 as number,
  }),

  actions: {
    async getListPokemon() {
      try {
        const response = await pokemonService.getListPokemon()
        this.statusList = response.status
        this.total = response.total
      } catch (err) {
        this.error = err
      }
    },
    async getPokemonPagination(page: number = 1, limit: number = 20) {
      try {
        const response = await pokemonService.getPokemonPagination(page, limit)
        this.pokemonList = response
      } catch (err) {
        this.error = err
      }
    },
    async getPokemon(id: string) {
      try {
        const response = await pokemonService.getPokemon(id)
        this.pokemon = response.data
        this.error = null
      } catch (err) {
        this.error = err
      }
    },
  },
})
