import { createRouter, createWebHistory } from 'vue-router'

import IndexView from '../views/IndexView.vue'
import AppLayout from '../views/AppLayout.vue'
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
      component: IndexView,
      // redirect: '/login'
    },

    {
      path: '/app', 
      component: AppLayout, // Basically, gusto ko mag render tong component na to sa bawat children niya (Eto yung magiging side panel component natin)
      meta: {requiresAuth: true},
      children: [

        { path: 'main', name: 'main', component: MainView },
        { path: 'tickets', name: 'tickets', component: TicketListView },
        { path: 'tickets/:id', name: 'ticket-detail', component: TicketDetailView },

      ]

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
