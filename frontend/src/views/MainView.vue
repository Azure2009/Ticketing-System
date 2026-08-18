<script setup lang="ts">

    import { ref } from 'vue'
    import { useTicketStore } from '../stores/ticket.ts'
    import { ChevronDown } from '@lucide/vue'

    const ticketStore = useTicketStore()

    const title = ref('')
    const description = ref('')
    const priority = ref(null)
    const successMessage = ref('')
    const errorMessage = ref('')
    const isSettingPriority = ref(false)

    let priorityOptions = [ 'low', 'medium', 'high', 'urgent' ]

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

</script>


<template>

    <div class="relative p-6">
        
        <div class="justify-items-center">
            <p class="mx-auto font-mono text-everGreen">Welcome to the ticketing system</p>
            <form class="relative mt-4" @submit.prevent="handleTicketCreation">

                <button class="self-center my-4 text-white bg-darkCoffee p-2 rounded-xl cursor-pointer hover:bg-darkCoffee shadow-xl/20 ring-white shadow-darkCoffee" type="submit">Create ticket</button>
                
                <div class="grid grid-cols-1 gap-y-2 w-100 p-2 border border-darkCoffee shadow-xl/20 rounded-xl">

                    <div class="flex row-start-1 items-center">
                        <label class="text-slate-500" for="title">Title:</label>
                        <input class="ml-2 p-2 w-full border border-darkCoffee rounded-xl bg-white focus:outline-darkCoffee" id="title" type="text" v-model="title" required>
                    </div>

                    <div class="row-start-2">
                        <label class="text-slate-500" for="description">Description</label>
                        <textarea class="flex w-full border border-darkCoffee p-2 bg-white resize-none rounded-xl focus:outline-darkCoffee" id="description" v-model="description" required>

                        </textarea>

                    </div>
                    
                    <div class="group row-start-3 justify-start mr-auto" v-on:mouseenter="isSettingPriority = true" v-on:mouseleave="isSettingPriority = false">

                        <div class="flex">
                            <p>{{priority ?? 'Set priority'}}</p>
                            <ChevronDown class="-rotate-90 group-hover:rotate-0 transition-rotate duration-200"/>
                        </div>

                        <div v-if="isSettingPriority" class="absolute grid bg-darkCoffee text-slate-300 p-2 rounded-xl w-25">
                            <button 
                            v-for="option in priorityOptions"
                            class="flex hover:text-white"
                            >{{ option }}
                            </button>
                        </div>

                    </div>

                    

                </div>

                

                <p class="relative flex text-green-500" v-if="successMessage">{{ successMessage }}</p>
                <p class="relative flex text-red-500" v-if="errorMessage">{{ errorMessage }}</p>
                
            </form>

        </div>

    </div>

</template>