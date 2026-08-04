<script setup lang="ts">

    import { ref } from 'vue'
    import { useAuthStore } from '../stores/auth.ts'
    import { useRouter } from 'vue-router'

    const authStore = useAuthStore()

    const Router = useRouter()

    const title = ref('')
    const description = ref('')
    const priority = ref(null)


    async function handleLogout() {
        
        try {
            
            await authStore.logout()

            Router.push({ name: 'index' })

        } catch {


            
        }

    }



</script>


<template>

    <div class="p-4">

        <div class="relative flex">
            <p>Welcome</p>
            <button v-on:click="">Create ticket</button>
        </div>

        <form class="relative grid grid-cols-1 bg-slate-500 h-10 w-50 border border-blue-500 rounded-xl" @submit.prevent="">

            <div class="flex row-start-1">
                <label for="title">Title:</label>
                <input class="ml-2 border-slate-500 outline-none focus:border-blue-500" id="title" type="text" required>
            </div>

            <div class="row-start-2">
                <label for="description">Description</label>
                <textarea class="border-slate-500 outline-none focus:border-blue-500" id="description" required>

                </textarea>

            </div>
            
            <div class="row-start-3">
                <label for="priority">Set priority <span class="text-slate-500">priority not set defaults to null</span>: </label>
                <select id="priority">                    
                    <option class="text-white bg-green-500" value="low">low</option>
                    <option class="text-white bg-yellow-500" value="medium">medium</option>
                    <option class="text-white bg-orange-500" value="high">high</option>
                    <option class="text-white bg-red-500" value="urgent">urgent</option>
                </select>
            </div>

        </form>

        <button class="relative mt-50 cursor-pointer bg-blue-500 rounded-xl p-2" v-on:click="handleLogout">Log out</button>
    </div>

</template>