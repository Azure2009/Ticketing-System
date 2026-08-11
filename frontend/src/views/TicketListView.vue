<script setup lang="ts">

    import { onMounted, ref } from 'vue'
    import { useTicketStore } from '../stores/ticket'
    import { RouterLink, useRouter } from 'vue-router'


    const ticketStore = useTicketStore()

    const router = useRouter()

    const status = ref<null | string>(null)

    const isFiltered = ref(false)

    onMounted(async () => { // render muna lahat ng tickets pag ka load ng page

        await ticketStore.index(status.value)
        isFiltered.value = true

    })

    async function renderTicketsByStatus() {

        await ticketStore.index(status.value)
        
    }

    async function resetFilter() {

        status.value = null
        isFiltered.value = false
        await ticketStore.index(null)

    }

    function rerouteToMain() {

        router.push( {name: 'main'} )

    }

</script>
<template>

    <div class="p-4">

        <button class="flex text-white cursor-pointer bg-blue-500 rounded-xl p-2 my-6 hover:bg-blue-600" v-on:click="rerouteToMain">Home</button>

        <div class="flex mb-4 items-center">
            
            <button v-if="isFiltered" v-on:click="resetFilter" class="text-white cursor-pointer bg-blue-500 rounded-xl p-2 my-6 hover:bg-blue-600">Reset Filter</button>

            <select class="focus:outline-none ml-auto" id="filter" v-model="status">          
                <option :value="null" disabled selected>Filter by status:</option>          
                <option class="text-white bg-green-500" value="open">open</option>
                <option class="text-white bg-yellow-500" value="in_progress">in_progress</option>
                <option class="text-white bg-orange-500" value="resolved">resolved</option>
                <option class="text-white bg-red-500" value="closed">closed</option>
            </select>

            <button v-on:click="renderTicketsByStatus" class="ml-4 text-white cursor-pointer bg-blue-500 rounded-xl p-2 my-6 hover:bg-blue-600">filter</button>

        </div>

        

        <p>My tickets</p>
        
        <p v-if="ticketStore.tickets.length === 0">Loading tickets...</p> <!-- Truthy ang array kahit empty pa yung loob kaya hindi gagana yung condition na !ticketStore.tickets -->

        <ul class="ml-20 grid grid-cols-1 gap-y-2 w-300 p-2 bg-slate-200 border border-blue-500 rounded-xl items-center" v-else-if="ticketStore.tickets">

            <li class="grid grid-cols-6 justify-items-center p-2 gap-x-4 " v-for="ticket in ticketStore.tickets" :key="ticket.id">
                
                <p class="text-blue-500 col-start-1">{{ ticket.title }}</p>
                <p v-if="ticket.assignee" class="bg-green-500 rounded-xl col-start-2">Assigned to: {{ ticket.assignee.name }}</p>
                <p v-else class="bg-gray-500 rounded-xl col-start-2 p-2">Unassigned</p>
                <p class="mr-4 col-start-3">Priority: {{ ticket.priority }}</p>
                <p class="col-start-4">Created by: {{ ticket.creator.name }}</p>
                <p class="col-start-5">Status: {{ ticket.status }}</p>
                
                <RouterLink :to="{name: 'ticket-detail', params: { id: ticket.id }}"><button class="col-start-6 cursor-pointer">...</button></RouterLink>

            </li>
            
        </ul>
    </div>

</template>