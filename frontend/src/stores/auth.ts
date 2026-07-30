import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, logout as apiLogout } from '../api/auth'


const useAuthStore = defineStore('auth', () => {

    const user = ref(null);

    const isLoggedIn = computed(() => {

        if (!!user.value) {

            return true;

        } else {

            return false;

        }

    })

    async function login(email: string, password: string) {

        user.value = await apiLogin(email, password);
        
    }

    async function logout() {

        await apiLogout();

        user.value = null;

    }

    return { user, isLoggedIn, login, logout }


});