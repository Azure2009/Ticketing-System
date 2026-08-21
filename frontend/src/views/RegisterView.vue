<script setup lang="ts">

  import { ref } from 'vue'
  import { useAuthStore } from '../stores/auth'
  import { useRouter } from 'vue-router'
  import { LoaderCircle } from '@lucide/vue'

  const authStore = useAuthStore()
  const router = useRouter()

  const register_name = ref('')
  const register_email = ref('')
  const register_password = ref('')
  const password_confirmation = ref('')
  const register_errorMessage = ref('')
  const isLoading = ref(false)

  async function handleRegistration() {

    if (register_password.value !== password_confirmation.value) {

      register_errorMessage.value = 'Passwords do not match.'

      return

    }

    try {

      isLoading.value = true
      await authStore.register(register_name.value , register_email.value, register_password.value, password_confirmation.value)
      router.push({ name: 'main' })


    } catch (err: any) {

      register_errorMessage.value = err.response?.data?.message ?? 'Registration failed.' // Fallback na message para sa frontend 
    
    }

  }

</script>

<template>
<div class="fixed flex inset-0 justify-center items-center">   

  <router-link :to="{ name: 'login' }" class="absolute right-4 top-0 mr-6 mt-4 p-2 text-white bg-darkSpruce rounded-xl">Log in</router-link>

  <div class="bg-everGreen inset-shadow-sm inset-shadow-darkSpruce/100 text-white p-4 rounded-xl text-2xl justify-center grid grid-cols-1 gap-4 relative p-10">
    
    <form class="row-start-2 grid grid-cols-1 gap-y-4" @submit.prevent="handleRegistration">

      <div class="flex w-full border-b-2 pb-4">

      <p class="text-5xl pointer-events-none">Register</p>

    </div>

      <div class="row-start-2">
        <label class="mr-2" for="register_name">Name</label>
      <input autocomplete="off" class="w-full border-2 border-slate-300 rounded-xl outline-none focus:border-darkSpruce px-2 py-1" id="register_name" type="text" v-model="register_name"  required>
      </div>

      <div class="row-start-3">
        <label class="mr-2" for="register_email">Email</label>
      <input autocomplete="off" class="w-full border-2 border-slate-300 rounded-xl outline-none focus:border-darkSpruce px-2 py-1" id="register_email" type="email" v-model="register_email"  required>  
      </div>

      <div class="row-start-4">  
        <label class="mr-2" for="register_password">Create Password</label>
      <input autocomplete="off" class="w-full border-2 border-slate-300 rounded-xl outline-none focus:border-darkSpruce px-2 py-1" id="register_password" type="password" v-model="register_password"  required>      
      </div>

      <div class="row-start-5">
        <label class="mr-2" for="password_confirmation">Confirm Password</label>
      <input autocomplete="off" class="w-full border-2 border-slate-300 rounded-xl outline-none focus:border-darkSpruce px-2 py-1" id="password_confirmation" type="password" v-model="password_confirmation"  required>  
      </div>

      <div class="flex row-start-6 items-center">
        <button class="outline outline-darkSpruce rounded-xl p-2 hover:bg-darkSpruce transition-bg duration-200" type="submit">Register</button>
        <p class="text-slate-500 text-xs ml-2">note: ticketing system automatically logs you in once you have registered.</p>
      </div>

      <div v-if="isLoading" class="flex items-center text-slate-500">
        <p class="text-base">Logging in</p>
        <LoaderCircle class="ml-px scale-70 animate-spin"/>
      </div>

      <p class="flex text-red-400" v-if="register_errorMessage">{{ register_errorMessage }}</p>
    
    </form>
  </div>

</div>
</template>

