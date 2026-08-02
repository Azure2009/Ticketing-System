import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/auth'

export const useAuthStore = defineStore('auth', () => {

    // My state
    const user = ref(null);

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

        user.value = await apiLogin(email, password); //login function from api layer
        
    }

    async function register(name: string, email: string, password: string, password_confirmation: string) {

        user.value = await apiRegister(name, email, password, password_confirmation);

    }

    async function logout() {

        await apiLogout();

        user.value = null;

    }

    return { user, isLoggedIn, login, logout, register}

});