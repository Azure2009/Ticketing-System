<script setup lang="ts">

import { useRouter, RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ref, Transition } from 'vue'
import { DownloadCloud, LoaderCircle, PanelRight, X } from '@lucide/vue'

const router = useRouter()
const authStore = useAuthStore()

const promptLogoutConfirmation = ref(false)

const logoutconfirmed = ref(false)

const isLoading = ref(false)

const isSidePanelOpen = ref(false)


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

<template >

  <!-- Overlay a blackscreen when side panel is open -->
  <div 
  class="fixed w-screen h-screen bg-black/50 z-10  transition-all duration-300"
  :class="isSidePanelOpen? 'opacity-100 visible' : 'opacity-0 invisible' "></div>

  <nav class="relative flex top-0 w-full h-10 bg-everGreen p-6 max-md:justify-center items-center text-white">

    <div class="justify-start flex gap-x-4 font-mono">
    
      <span class="cursor-pointer max-md:hidden" v-on:click="router.push({ name: 'main' })">Ticketing System</span>
      <span class="pointer-events-none max-md:hidden">|</span>
      
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

    <PanelRight @click="isSidePanelOpen = true" class="cursor-pointer absolute right-0 mr-2 min-md:hidden"/>

    <div class="flex ml-auto items-center max-md:hidden">
      <span class="mx-4 pointer-events-none">{{ authStore.user?.name }} ({{ capitalizeFirstLetter(authStore.user!.role) }})</span>
      <button class="outline outline-darkSpruce rounded-xl p-2 hover:bg-darkSpruce transition-bg duration-200" v-on:click="promptLogoutConfirmation =true">Logout</button>
    </div>

  </nav>

  <!-- Side Panel for mobile screen size -->

  <div  
  class="fixed flex flex-col text-white p-2 gap-2 top-0 right-0 w-50 z-20 border-l-[3px] border-darkSpruce  transition-all duration-300 h-screen bg-everGreen min-md:hidden"
  :class="isSidePanelOpen? 'transition-x-0' : 'translate-x-full'"
  >

    <X @click="isSidePanelOpen = false" class="ml-auto cursor-pointer"/>
    <span class="text-center pointer-events-none">{{ authStore.user?.name }}</span>
    <span class="text-center pointer-events-none">Role: {{ capitalizeFirstLetter(authStore.user!.role) }}</span>
    
    <button class="cursor-pointer outline outline-darkSpruce rounded-xl p-2 hover:bg-darkSpruce transition-bg duration-200" v-on:click="promptLogoutConfirmation =true">Sign out</button>
    

  </div>

  <Transition
  enter-active-class="transition-all duration-300"
  enter-from-class="opacity-0"
  enter-to-class="opacity-100"

  leave-active-class="transition-all duration-300"
  leave-from-class="opacity-100"
  leave-to-class="opacity-0"
  >

    <div v-if="promptLogoutConfirmation" class="fixed inset-0 flex items-center justify-center z-60 text-white text-xl mx-2 font-mono">

      <div class="bg-everGreen p-4 rounded-xl inset-shadow-darkSpruce inset-shadow-sm cursor-default">
        
        <p class="text-center">Are you sure you want to logout?</p>

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