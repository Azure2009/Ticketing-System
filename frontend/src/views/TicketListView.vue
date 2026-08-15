<script setup lang="ts">

    import { onMounted, ref} from 'vue'
    import { FunnelX } from '@lucide/vue'
    import { useTicketStore } from '../stores/ticket'
    import { RouterLink } from 'vue-router'
    

    let options = [ 'open', 'in progress', 'resolved', 'closed' ]

    const ticketStore = useTicketStore()

    const status = ref<null | string>(null)

    const isFiltered = ref(false)

    const filteredTickets = ref(null)

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

    <div class="mx-50 my-20">

        <div v-if="isFiltered" class="relative group ml-2 inline-block mr-2">
        <FunnelX @click="resetFilter" class="translate-y-px text-slate-400 cursor-pointer"/>
        <div class="absolute flex border-2 w-14 border-slate-300 bg-black text-white text-[10px] px-px -translate-x-14 -translate-y-12 opacity-0 invisible group-hover:opacity-100 visible group-hover:transition-opacity duration-200">Reset filter</div>
        </div>

        <div class="group relative inline-block">
            
            <button type="button" class="px-3 py-2 border border-slate-300 rounded-lg text-sm">
            {{ status ?? 'Set status' }}
            </button>

            
            <div
            class="absolute left-full w-100 top-0 hidden group-hover:flex
                    items-center justify-evenly -translate-y-2 gap-x-2 bg-white border border-slate-200
                    rounded-lg p-2 shadow-md"
            >
            <button
                v-for="option in options"
                :key="option"
                type="button"
                @click="() => {

                    status = option

                    renderTicketsByStatus()

                }"
                class="px-3 py-1.5 text-sm rounded-md hover:bg-slate-100"
            >
                {{ option }}
            </button>

            </div>

        </div>

        <p v-if="ticketStore.tickets.length === 0">Loading tickets...</p> <!-- Truthy ang array kahit empty pa yung loob kaya hindi gagana yung condition na !ticketStore.tickets -->

        <div class="grid grid-cols-1 mt-2" v-else-if="ticketStore.tickets.length > 0">

            <div class="grid grid-cols-5 justify-items-center border border-darkCoffee rounded-xl p-2">

                <p>Title</p>
                <p>Assignee</p>
                <p>Priority</p>
                <p>Creator</p>
                <p>Status</p>
                
            </div>
            
            <div v-for="ticket in ticketStore.tickets" :key="ticket.id" class="relative group">
                <RouterLink :to="{name: 'ticket-detail', params: { id: ticket.id }}" class="grid grid-cols-5 justify-items-center items-center p-2 text-slate-500 group-hover:bg-darkCoffee rounded-xl group-hover:text-white">    
                    <p class="col-start-1">{{ ticket.title }}</p>
                    <p v-if="ticket.assignee" class="bg-darkSpruce rounded-xl col-start-2">{{ ticket.assignee.name }}</p>
                    <p v-else class="rounded-xl col-start-2 p-2">Unassigned</p>
                    <p class="mr-4 col-start-3">{{ ticket.priority }}</p>
                    <p class="col-start-4">{{ ticket.creator.name }}</p>
                    <p class="col-start-5">{{ ticket.status }}</p>            
                </RouterLink>
            </div>

        </div>
    </div>

</template>