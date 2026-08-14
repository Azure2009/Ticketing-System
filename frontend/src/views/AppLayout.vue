<script setup lang="ts">

import { useRouter, RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
        
        try {
            
            await authStore.logout()

            router.push({ name: 'index' })

        } catch (error: any) {

            error.response?.data?.message
            
        }

    }

</script>

<template>

  <nav class="relative flex top-0 w-full h-10 bg-everGreen p-6 items-center text-white">

    <div class="flex gap-x-4 font-mono">
    <span>Ticketing System</span>
    <span>|</span>
    <RouterLink
    :to="{ name: 'main' }"
    active-class="underline decoration-darkSpruce underline-offset-4"
    >
    Home
    </RouterLink>

    <RouterLink
    :to="{ name: 'tickets' }"
    class=""
    active-class="underline decoration-darkSpruce underline-offset-4"
    >
    Tickets
    </RouterLink>

    </div>

    <span class="ml-auto mx-4">{{ authStore.user?.name }}</span>
    <button class="cursor-pointer outline outline-darkSpruce rounded-xl p-2" v-on:click="handleLogout">Logout</button>

  </nav>



  <main>
  <RouterView/>
  </main>
</template>