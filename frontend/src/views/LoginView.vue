<script setup lang="ts">

  import { ref } from 'vue'
  import { useAuthStore } from '../stores/auth'
  import { useRouter } from 'vue-router'

  const AuthStore = useAuthStore();
  const Router = useRouter()

  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');

  async function handleSubmit() {

    try {

      await AuthStore.login(email.value, password.value)

      console.log('Logged in successfully.')

      Router.push({ name: 'main'})



    } catch (err: any) {

      errorMessage.value = err.response.data.errors.email[0]

    }


  }

</script>

<template>
<div class="fixed flex inset-0 justify-center items-center">   
  <div class="bg-everGreen inset-shadow-sm inset-shadow-darkSpruce/100 text-white p-4 rounded-xl text-2xl justify-center grid grid-cols-1 gap-4 relative p-10">

    <div class="flex w-full border-b-2 pb-4">

      <p class="text-5xl pointer-events-none">Log in</p>

    </div>

    <form class="row-start-2 grid grid-cols-1 gap-y-4" @submit.prevent="handleSubmit">
      
      <div class="row-start-1">
        <label class="mr-2" for="email">Email:</label>
        <input autocomplete="off" class="w-full border-2 border-slate-300 rounded-xl outline-none focus:border-darkSpruce px-2 py-1" id="email" type="email" v-model="email" required/>
      </div>

      <div class="row-start-2">
        <label class="mr-2" for="password">Password:</label>
        <input autocomplete="off" class="w-full border-2 border-slate-300 rounded-xl outline-none focus:border-darkSpruce px-2 py-1" id="password" type="password" v-model="password" required/>
      </div>

      <div class="row-start-3 flex justify-items-center">
        <button type="submit" class="outline outline-darkSpruce rounded-xl p-2 hover:bg-darkSpruce transition-bg duration-200">Log In</button>
      </div>

      <p class="flex text-red-400" v-if="errorMessage">{{ errorMessage }}</p>
    
    </form>

    <div class="flex">
      <p class="pointer-events-none">Don't have an account? Register</p>
      <router-link to="/register" class="ml-2 text-darkSpruce">here</router-link>
    </div>

  </div>
</div>

</template>

