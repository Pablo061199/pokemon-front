import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/pokemons',
    },
    {
      path: '/pokemons',
      name: 'Pokemons',
      component: () => import('@/views/Pokemon/PokemonList.vue'),
    },
    {
      path: '/pokemon/:id',
      name: 'Pokemon',
      component: () => import('@/views/Pokemon/PokemonDetalle.vue'),
    },
    {
      path: '/equipos',
      name: 'Equipos',
      component: () => import('@/views/Equipo/EquipoList.vue'),
    },
    {
      path: '/equipo/:id?',
      name: 'EquipoDetalle',
      component: () => import('@/views/Equipo/EquipoForm.vue'),
      props: true,
    },
  ],
})

export default router
