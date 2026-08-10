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
      meta: {requiresAuth: true}
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

router.beforeEach(async (to) => {

  const authStore = useAuthStore()
  await authStore.ensureUserFetched() // Ang purpose nito ay i-wait yung promise object (na galing kay fetch user()) na mapunta from pending state to
  // either fulfilled state o rejected state. Kasi technically kung fulfilled state na siya, ibigsabihin, natapos na yung fetch user function at meron na tayong type user sa user variable (hindi na siya null) 
 // benefit nito is everytime na pupunta tayo sa bagong route, hindi na kailangan kumuha na naman ng panibagong response (panibagong user value) sa ticketcontroller. 

  if (to.meta.guestOnly && authStore.isLoggedIn) {

    return { name: 'main' }

  } else if (to.meta.requiresAuth && !authStore.isLoggedIn) {

    return { name: 'login' }

  }

})

export default router
