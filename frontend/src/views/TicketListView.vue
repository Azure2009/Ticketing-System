<script setup lang="ts">

    import { onMounted, ref } from 'vue'
    import { useTicketStore } from '../stores/ticket'
    import { RouterLink } from 'vue-router'

    const ticketStore = useTicketStore()

    const status = ref<null | string>(null)

    const isFiltered = ref(false)

    onMounted(async () => { // render muna lahat ng tickets pag ka load ng page

        await ticketStore.index(status.value)
        

    })

    async function renderTicketsByStatus() {

        await ticketStore.index(status.value)
        isFiltered.value = true
    }

    async function resetFilter() {

        status.value = null
        isFiltered.value = false
        await ticketStore.index(null)

    }

</script>
<template>

    <div class="p-6">



        <div class="">
            
            <button v-if="isFiltered" v-on:click="resetFilter" class="text-white cursor-pointer bg-darkCoffee rounded-xl p-2 my-6 hover:bg-blue-600">Reset Filter</button>

            <select class="focus:outline-none ml-auto" id="filter" v-model="status">          
                <option :value="null" disabled selected>Filter by status:</option>          
                <option class="text-white bg-green-500" value="open">open</option>
                <option class="text-white bg-yellow-500" value="in_progress">in_progress</option>
                <option class="text-white bg-orange-500" value="resolved">resolved</option>
                <option class="text-white bg-red-500" value="closed">closed</option>
            </select>

            <button v-on:click="renderTicketsByStatus" class="ml-4 text-white cursor-pointer bg-darkCoffee rounded-xl p-2 my-6 hover:bg-blue-600">filter</button>

        </div>

        <p v-if="ticketStore.tickets.length === 0">Loading tickets...</p> <!-- Truthy ang array kahit empty pa yung loob kaya hindi gagana yung condition na !ticketStore.tickets -->

        <ul class="ml-20 grid grid-cols-1 gap-y-2 w-300 p-2 items-center" v-else-if="ticketStore.tickets.length > 0">

            <div class="grid grid-cols-6 border border-darkCoffee rounded-xl justify-items-center-safe items-center p-2 gap-x-4">

                <p>Title</p>
                <p>Assignee</p>
                <p>Priority</p>
                <p>Creator</p>
                <p>Status</p>
                
            </div>
            
            <li  v-for="ticket in ticketStore.tickets" :key="ticket.id">
                <RouterLink :to="{name: 'ticket-detail', params: { id: ticket.id }}" class="grid grid-cols-6 justify-items-center-safe items-center p-2 gap-x-4 hover:bg-darkCoffee rounded-xl text-white">    
                    <p class="text-slate-500 col-start-1">{{ ticket.title }}</p>
                    <p v-if="ticket.assignee" class="text-slate-500 bg-darkSpruce rounded-xl col-start-2">{{ ticket.assignee.name }}</p>
                    <p v-else class="text-slate-500 rounded-xl col-start-2 p-2">Unassigned</p>
                    <p class="text-slate-500 mr-4 col-start-3">{{ ticket.priority }}</p>
                    <p class="text-slate-500 col-start-4">{{ ticket.creator.name }}</p>
                    <p class="text-slate-500 col-start-5">{{ ticket.status }}</p>            
                </RouterLink>
            </li>
        </ul>
    </div>

</template>