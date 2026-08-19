<script setup lang="ts">

  import { ref } from 'vue'
  import { useAuthStore } from '../stores/auth'
  import { useRouter } from 'vue-router'

  const authStore = useAuthStore()
  const router = useRouter()

  const register_name = ref('')
  const register_email = ref('')
  const register_password = ref('')
  const password_confirmation = ref('')
  const register_errorMessage = ref('')

  async function handleRegistration() {

    if (register_password.value !== password_confirmation.value) {

      register_errorMessage.value = 'Passwords do not match.'

      return

    }

    try {

      await authStore.register(register_name.value , register_email.value, register_password.value, password_confirmation.value)
      router.push({ name: 'main' })


    } catch (err: any) {

      register_errorMessage.value = err.response?.data?.message ?? 'Registration failed.' // Fallback na message para sa frontend 
    
    }

  }

</script>

<template>
<div class="fixed flex inset-0 justify-center items-center">   

  <div class="grid grid-cols-1 gap-4 relative p-4">
    
    <form class="" @submit.prevent="handleRegistration">

      <p>Register</p>

      <div class="row-start-1">
        <label class="mr-2" for="register_name">Name</label>
      <input autocomplete="off" class="border-2 border-slate-300 rounded-xl outline-none focus:border-blue-500 px-2 py-1" id="register_name" type="text" v-model="register_name"  required>
      </div>

      <div class="row-start-2">
        <label class="mr-2" for="register_email">Email</label>
      <input autocomplete="off" class="border-2 border-slate-300 rounded-xl outline-none focus:border-blue-500 px-2 py-1" id="register_email" type="email" v-model="register_email"  required>  
      </div>

      <div class="row-start-3">  
        <label class="mr-2" for="register_password">Create Password</label>
      <input autocomplete="off" class="border-2 border-slate-300 rounded-xl outline-none focus:border-blue-500 px-2 py-1" id="register_password" type="password" v-model="register_password"  required>      
      </div>

      <div class="row-start-4">
        <label class="mr-2" for="password_confirmation">Confirm Password</label>
      <input autocomplete="off" class="border-2 border-slate-300 rounded-xl outline-none focus:border-blue-500 px-2 py-1" id="password_confirmation" type="password" v-model="password_confirmation"  required>  
      </div>

      <div class="flex row-start-5 items-center">
        <button class="cursor-pointer bg-blue-500 rounded-xl p-2 mr-2" type="submit">Register</button>
        <p class="text-slate-500">note: ticketing system automatically logs you in once you have registered.</p>
      </div>
      
      <p class="flex text-red-400" v-if="register_errorMessage">{{ register_errorMessage }}</p>
    
    </form>
  </div>

</div>
</template>

