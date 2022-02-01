import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/go',
    name: 'Go',
    component: () => import('../views/Principal.vue')
  },
  {
    path: '/ayudadiag',
    name: 'AyudaDiag',
    component: () => import('../views/AyudaDiag.vue')
  },
  {
    path: '/consultaexterna/',
    name: 'ConsultaExterna',
    component: () => import('../views/ConsultaExterna.vue')
  },
  {
    path: '/escaneados',
    name: 'Escaneados',
    component: () => import('../views/Escaneados.vue')
  },
  {
    path: '/archivo',
    name: 'Archivo',
    component: () => import('../views/Archivo.vue')
  },
  ,
  {
    path: '/atencion/:id',
    name: 'Atencion',
    component: () => import('../views/ConsultaExterna.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
