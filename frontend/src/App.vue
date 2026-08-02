<script setup lang="ts">

  import { ref } from 'vue'
  import { useAuthStore } from './stores/auth'

  const AuthStore = useAuthStore();

  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');

  const register_name = ref('');
  const register_email = ref('');
  const register_password = ref('');
  const password_confirmation = ref('');
  const register_errorMessage = ref('');

  async function handleSubmit() {

    try {

      await AuthStore.login(email.value, password.value);

    } catch (err: any) {

      errorMessage.value = err.response.data.errors.email[0];

    }


  }

  async function handleRegistration() {

    if (register_password.value !== password_confirmation.value) {

      register_errorMessage.value = 'Passwords do not match.';

      return

    }

    try {

      await AuthStore.register(register_name.value , register_email.value, register_password.value, password_confirmation.value);

    } catch (err: any) {

      register_errorMessage.value = err.response?.data?.message ?? 'Registration failed.' // 
    
    }

  }

</script>

<template>
<div class="p-4">   
  <div>
    <p class="">Log in</p>
    <form class="grid grid-cols-1 gap-4 relative p-4" @submit.prevent="handleSubmit">
      
    <div class="row-start-1">
      <label class="mr-2" for="email">Email:</label>
      <input autocomplete="off" class="border-2 border-slate-300 rounded-xl outline-none focus:border-blue-500 px-2 py-1" id="email" type="email" v-model="email" required/>
    </div>

    <div class="row-start-2">
      <label class="mr-2" for="password">Password:</label>
      <input autocomplete="off" class="border-2 border-slate-300 rounded-xl outline-none focus:border-blue-500 px-2 py-1" id="password" type="password" v-model="password" required/>
    </div>

    <div class="row-start-3">
    <button class="cursor-pointer bg-blue-500 rounded-xl p-2" type="submit">Log In</button>
    </div>

    <p class="flex text-red-400" v-if="errorMessage">{{ errorMessage }}</p>
    
    </form>
  </div>


  <div>
    <p>Register</p>
    <form class="grid grid-cols-1 gap-4 relative p-4" @submit.prevent="handleRegistration">

      <div class="row-start-1">
        <label class="mr-2" for="name">Name</label>
      <input autocomplete="off" class="border-2 border-slate-300 rounded-xl outline-none focus:border-blue-500 px-2 py-1" id="name" type="text" v-model="register_name"  required>
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

      <div class="row-start-5">
        <button class="cursor-pointer bg-blue-500 rounded-xl p-2" type="submit">Register</button>
      </div>
      
      <p class="flex text-red-400" v-if="register_errorMessage">{{ register_errorMessage }}</p>
    
    </form>
  </div>

</div>
</template>

<style scoped></style>
