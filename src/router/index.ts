import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SettingsView from '../views/SettingsView.vue'
import SettingGroupView from '@/views/SettingGroupView.vue'
import FunctionsView from '../views/FunctionsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/settings/:group',
      component: SettingGroupView
    },
    {
      path: '/functions',
      name: 'functions',
      component: FunctionsView
    },
  ],
})

export default router
