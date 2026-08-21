<script setup lang="ts">

import { useRouter, RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ref, Transition } from 'vue'
import { LoaderCircle } from '@lucide/vue'

const router = useRouter()
const authStore = useAuthStore()

const promptLogoutConfirmation = ref(false)

const logoutconfirmed = ref(false)

const isLoading = ref(false)


function capitalizeFirstLetter(x: string): string {


  const y = x.charAt(0).toUpperCase() + x.slice(1)  

  return y

}

async function handleLogout() {
        
        try {
            
          isLoading.value = true

          await authStore.logout()

          router.push({ name: 'index' })

        } catch {

          
            
        }

    }

</script>

<template>

  <nav class="relative flex top-0 w-full h-10 bg-everGreen p-6 items-center text-white">

    <div class="flex gap-x-4 font-mono">
    <span class="cursor-pointer" v-on:click="router.push({ name: 'main' })">Ticketing System</span>
    <span class="pointer-events-none">|</span>
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

    <span class="ml-auto mx-4 pointer-events-none">{{ authStore.user?.name }} ({{ capitalizeFirstLetter(authStore.user!.role) }})</span>
    <button class="outline outline-darkSpruce rounded-xl p-2 hover:bg-darkSpruce transition-bg duration-200" v-on:click="promptLogoutConfirmation =true">Logout</button>

  </nav>

  <Transition
  enter-active-class="transition-all duration-300"
  enter-from-class="opacity-0"
  enter-to-class="opacity-100"

  leave-active-class="transition-all duration-300"
  leave-from-class="opacity-100"
  leave-to-class="opacity-0"
  >

    <div v-if="promptLogoutConfirmation" class="fixed inset-0 flex items-center justify-center z-60 text-white text-3xl mb-40 font-mono">

      <div class="bg-everGreen p-4 rounded-xl inset-shadow-darkSpruce inset-shadow-sm cursor-default">
        
        <p>Are you sure you want to logout?</p>

        <div class="flex justify-self-center ml-4 mt-10 gap-14">

          <button @click="()=>{
            logoutconfirmed = false
            promptLogoutConfirmation = false
            }"
            class="p-2 hover:bg-darkSpruce rounded-xl transition-bg duration-200"
            >No</button>
          <button 
          @click="handleLogout"
          class="p-2 hover:bg-darkSpruce rounded-xl transition-bg duration-200"
          >Yes</button>

        </div>

        <div v-if="isLoading" class="mt-4 text-slate-500">
          <p class="text-base justify-self-center">Logging out</p>
          <LoaderCircle class="ml-px scale-70 justify-self-center animate-spin"/>
        </div>

      </div>
        
    </div>

  </Transition>

  <main>
  <RouterView/>
  </main>
</template>