import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import MainView from '../views/MainView.vue'
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


  ]
})

router.beforeEach((to) => {

  const authStore = useAuthStore();

  if (to.meta.guestOnly && authStore.isLoggedIn) {

    return { name: 'main' }

  }

})

export default router
