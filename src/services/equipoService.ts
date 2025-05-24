import Equipo from '@/class/equipo'

const STORAGE_KEY = 'equipos'

export const equipoService = {
  async getEquipoList(): Promise<{ data: Equipo[] }> {
    const equiposJson = localStorage.getItem(STORAGE_KEY)
    const equipos: Equipo[] = equiposJson ? JSON.parse(equiposJson) : []
    return { data: equipos }
  },

  async getEquipo(idOrName: string): Promise<{ data: Equipo | null }> {
    const equiposJson = localStorage.getItem(STORAGE_KEY)
    const equipos: Equipo[] = equiposJson ? JSON.parse(equiposJson) : []
    const equipo = equipos.find(
      (e) => e.id === idOrName || e.name.toLowerCase() === idOrName.toLowerCase(),
    )
    return { data: equipo || null }
  },

  async saveEquipo(nuevoEquipo: Equipo): Promise<void> {
    const equiposJson = localStorage.getItem(STORAGE_KEY)
    const equipos: Equipo[] = equiposJson ? JSON.parse(equiposJson) : []
    equipos.push(nuevoEquipo)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(equipos))
  },

  async deleteEquipo(id: string): Promise<void> {
    const equiposJson = localStorage.getItem(STORAGE_KEY)
    const equipos: Equipo[] = equiposJson ? JSON.parse(equiposJson) : []
    const nuevosEquipos = equipos.filter((e) => e.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosEquipos))
  },
}
