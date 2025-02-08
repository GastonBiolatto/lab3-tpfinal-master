import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegistroView from '../views/RegistroView.vue'
import LoginView from '../views/LoginView.vue'
import InicioView from '@/views/InicioView.vue'
import CompraView from '@/views/CompraView.vue'
import HistorialView from '@/views/HistorialView.vue'
import AnalisisView from '@/views/AnalisisView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/registro',
    name: 'Registro',
    component: RegistroView 
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/inicio',
    name: 'Inicio',
    component: InicioView
  },
  {
    path: '/compra',
    name: 'Compra',
    component: CompraView
  },
  {
    path: '/analisis',
    name: 'Analisis',
    component: AnalisisView
  },
  {
    path: '/historial',
    name: 'historial',
    component: HistorialView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
