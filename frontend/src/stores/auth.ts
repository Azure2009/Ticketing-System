import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, logout as apiLogout, register as apiRegister, fetchUser as apiFetchUser} from '../api/auth'

export const useAuthStore = defineStore('auth', () => {

    // My state
    const user = ref(null)

    // My getter
    const isLoggedIn = computed(() => {

        if (!!user.value) {

            return true;

        } else {

            return false;

        }

    })

    // My action (a logic that changes the state)
    async function login(email: string, password: string) {

        user.value = await apiLogin(email, password) 
        
    }

    async function register(name: string, email: string, password: string, password_confirmation: string) {

        user.value = await apiRegister(name, email, password, password_confirmation)

    }

    async function logout() {

        const res = await apiLogout()

        user.value = null

        console.log(res.message)

    }

    async function fetchUser() {

        try {
            
            user.value = await apiFetchUser()

        } catch {
            
            user.value = null

        }
        
    }

    return { user, isLoggedIn, login, logout, register, fetchUser}

});