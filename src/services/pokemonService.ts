import createAxios from './axiosHttp'

export interface PokemonResult {
  name: string
  url: string
}

export interface PokemonApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonResult[]
}

export interface PokemonResponse {
  data: PokemonApiResponse
  headers: unknown
}

async function getListPokemon() {
  const axios = createAxios()
  const urlPath = `pokemon?limit=2000`

  try {
    const response = await axios.get<PokemonApiResponse>(urlPath)
    localStorage.setItem('listPokemonDetail', JSON.stringify(response.data.results))
    return { status: '200', total: response.data.count }
  } catch (error) {
    return Promise.reject(error)
  }
}

async function getPokemonPagination(page: number, limit: number = 20) {
  const raw = localStorage.getItem('listPokemonDetail')
  if (!raw) {
    throw new Error('La lista de Pokémon no está disponible en localStorage.')
  }

  const lista: PokemonResult[] = JSON.parse(raw)

  const start = (page - 1) * limit
  const end = start + limit
  const slice = lista.slice(start, end)

  const detalles = await Promise.all(
    slice.map(async (p) => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.name}`)
      return await res.json()
    }),
  )

  return detalles
}

async function getPokemon(id: string): Promise<{ data: unknown; headers: unknown }> {
  const axios = createAxios()
  const urlPath = `pokemon/${id}/`

  try {
    const response = await axios.get(urlPath)
    return {
      data: response.data,
      headers: response.headers,
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

export const pokemonService = {
  getListPokemon,
  getPokemon,
  getPokemonPagination,
}
