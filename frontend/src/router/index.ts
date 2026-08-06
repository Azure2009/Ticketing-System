import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import MainView from '../views/MainView.vue'
import TicketListView from '../views/TicketListView.vue'
import TicketDetailView from '../views/TicketDetailView.vue'


import { useAuthStore } from '../stores/auth.ts' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true }
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true }
    },

    {
      path: '/',
      name: 'index',
      redirect: '/login'
    },

    {
      path: '/main',
      name: 'main',
      component: MainView,
    },

    {
      path: '/tickets',
      name: 'tickets',
      component: TicketListView,
      meta: {requiresAuth: true}
    },

    {
      path: '/tickets/:id',
      name: 'ticket-detail',
      component: TicketDetailView,
      meta: {requiresAuth: true}
    }


  ]
})

router.beforeEach((to) => {

  const authStore = useAuthStore();

  if (to.meta.guestOnly && authStore.isLoggedIn) {

    return { name: 'main' }

  } else if (to.meta.requiresAuth && !authStore.isLoggedIn) {

    return { name: 'login' }

  }

})

export default router
