import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types/user'
import { login as apiLogin, logout as apiLogout, register as apiRegister, fetchUser as apiFetchUser} from '../api/auth'

export const useAuthStore = defineStore('auth', () => {

    
    const user = ref<User | null>(null)

    const isReady = ref(false) 

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

        await apiLogout()

        user.value = null

    }

    async function fetchUser() {

        try {
            
            user.value = await apiFetchUser()

        } catch {
            
            user.value = null

        } finally {

            isReady.value = true

        }
        
    }

    return { user, isLoggedIn, isReady, login, logout, register, fetchUser}

});