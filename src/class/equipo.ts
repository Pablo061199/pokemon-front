export interface Pokemon {
  name: string
  height: number
  weight: number
  base_experience: number
  sprites: {
    front_default: string | null
    other: {
      ['official-artwork']: {
        front_default: string | null
      }
    }
  }
  types: {
    type: {
      name: string
    }
  }[]
  abilities: {
    ability: {
      name: string
    }
  }[]
  stats: {
    base_stat: number
    stat: {
      name: string
    }
  }[]
}
export default class Equipo {
  id: string
  name: string
  pokemons: Pokemon[]

  constructor(name: string, pokemons: Pokemon[]) {
    this.id = this.generarIdEquipo(name)
    this.name = name
    this.pokemons = pokemons
  }
  addPokemon(pokemon: Pokemon) {
    if (this.pokemons.length < 6) {
      this.pokemons.push(pokemon)
    }
  }

  removePokemon(name: string) {
    this.pokemons = this.pokemons.filter((p) => p.name !== name)
  }
  generarIdEquipo(name: string): string {
    let iniciales: string = ''
    const palabras: string[] = name.split(' ')

    for (const palabra of palabras) {
      if (palabra.length > 0) {
        iniciales += palabra[0].toUpperCase()
      }
    }

    const numeroAleatorio: number = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000

    const id: string = `${iniciales}_${numeroAleatorio}`

    return id
  }
}
