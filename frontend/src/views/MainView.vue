<script setup lang="ts">

    import { ref } from 'vue'
    import { useAuthStore } from '../stores/auth.ts'
    import { useTicketStore } from '../stores/ticket.ts'
    import { useRouter } from 'vue-router'

    const authStore = useAuthStore()
    const ticketStore = useTicketStore()

    const router = useRouter()

    const title = ref('')
    const description = ref('')
    const priority = ref(null)
    const successMessage = ref('')
    const errorMessage = ref('')

    async function handleLogout() {
        
        try {
            
            await authStore.logout()

            router.push({ name: 'index' })

        } catch (error: any) {

            error.response?.data?.message
            
        }

    }

    async function handleTicketCreation() {

        try {

            await ticketStore.store(title.value, description.value, priority.value)

            title.value = ''
            description.value = ''
            priority.value = null

            successMessage.value = 'Ticket successfully created.'
            
        } catch (error: any)  {
            
            errorMessage.value = error.response?.data?.message

        }
        
    }

    function seeTickets() {

        router.push({name: 'tickets'})

    }


</script>


<template>

    <div class="relative p-4 justify-items-center">
        <p class="flex mb-4">Welcome to ticketing system</p>
        
        <form class="relative mt-4" @submit.prevent="handleTicketCreation">

            <button class="self-center my-4 text-white bg-blue-500 p-2 rounded-xl cursor-pointer hover:bg-blue-600" type="submit">Create ticket</button>
            
            <div class="grid grid-cols-1 gap-y-2 w-100 p-2 bg-slate-200 border border-blue-500 rounded-xl">

                <div class="flex row-start-1 items-center">
                    <label class="text-blue-500" for="title">Title:</label>
                    <input class="ml-2 p-2 w-full border border-blue-500 rounded-xl bg-white focus:outline-blue-500 rounded-xl" id="title" type="text" v-model="title" required>
                </div>

                <div class="row-start-2">
                    <label class="text-blue-500" for="description">Description</label>
                    <textarea class="flex w-full border border-blue-500 outline-none p-2 bg-white resize-none rounded-xl" id="description" v-model="description" required>

                    </textarea>

                </div>
                
                <div class="row-start-3 justify-start">

                        <select class="mt-4 focus:outline-none" id="priority" v-model="priority">          
                            <option :value="null" disabled selected>Set priority (default: medium)</option>          
                            <option class="text-white bg-green-500" value="low">low</option>
                            <option class="text-white bg-yellow-500" value="medium">medium</option>
                            <option class="text-white bg-orange-500" value="high">high</option>
                            <option class="text-white bg-red-500" value="urgent">urgent</option>
                        </select>
            
                </div>

            </div>

            <p class="relative flex text-green-500" v-if="successMessage">{{ successMessage }}</p>
            <p class="relative flex text-red-500" v-if="errorMessage">{{ errorMessage }}</p>
            
        </form>

        <button class="relative flex text-white mt-50 cursor-pointer bg-blue-500 rounded-xl p-2 hover:bg-blue-600" v-on:click="seeTickets">My tickets</button>

        <button class="relative flex text-white mt-50 cursor-pointer bg-blue-500 rounded-xl p-2 hover:bg-blue-600" v-on:click="handleLogout">Log out</button>
    </div>

</template>