<script setup lang="ts">

    import { onMounted, ref } from 'vue'
    import { FunnelX, Plus } from '@lucide/vue'
    import { useTicketStore } from '../stores/ticket'
    import { RouterLink } from 'vue-router'
    import router from '@/router'

    let options = [ 'open', 'in progress', 'resolved', 'closed' ]

    const ticketStore = useTicketStore()

    const status = ref<null | string>(null)
    const isFiltered = ref(false)

    const hasFetchedOnce = ref(false)
    const isLoading = ref(false) 

    async function fetchTickets(newStatus: string | null) { // Prupose nito is para mag stostop na yung loading message the moment na ma fetch na yung tickets -- di na kailangang hintayin matapos yung 0.3 second
        const timer = setTimeout(() => {
            isLoading.value = true
        }, 300)

        try {
            await ticketStore.index(newStatus)
        } finally {
            clearTimeout(timer)
            isLoading.value = false
            hasFetchedOnce.value = true
        }
    }

    onMounted(() => {
        fetchTickets(status.value) // note: sabay nangyayari ang callback sa onMounted at pag render nung template, so kung walang hasfetchOnce sa finally keyword, magchecheck na agad ng length ng tickets array si Vue. 
    })

    async function renderTicketsByStatus() {
        await fetchTickets(status.value)
        isFiltered.value = true
    }

    async function resetFilter() {
        await fetchTickets(null)
        status.value = null
        isFiltered.value = false
    }

</script>
<template>
    <div v-if="isLoading" class="absolute inset-0 flex justify-self-center self-center self-center text-3xl text-slate-500">Loading tickets...</div>

    <div v-else-if="hasFetchedOnce"> <!-- Kailangan toh gawing wrapper sa if statements para ichecheck lang yung length ng tickets array kung tapos na mag fetch -->

        <div v-if="ticketStore.tickets.length === 0"> <!-- Truthy ang array kahit empty pa yung loob kaya hindi gagana yung condition na !ticketStore.tickets -->
            <div v-if="!isFiltered">
                <div class="absolute inset-0 flex justify-self-center self-center text-3xl text-slate-500">
                    <div class="grid grid-cols-1 gap-y-4">
                        <p class="flex justify-self-center">No tickets available.</p>
                        <p class="flex justify-self-center">Create your first ticket</p>
                        <Plus @click="() => {router.push({ name: 'main' })}" class="flex justify-self-center cursor-pointer"/>
                    </div>  
                </div>     
            </div>

            <div v-else-if="isFiltered" class="fixed inset-0 flex items-center justify-center">
                <div>
                    <p class="pointer-events-none text-black text-3xl text-slate-800">No tickets available for this status</p> 
                    <button @click="resetFilter" class="flex mt-2 justify-self-center text-slate-500 hover:underline decoration-darkSpruce underline-offset-2">Reset</button>
                </div>
            </div>

        </div>
        
        <div v-else-if="ticketStore.tickets.length > 0" class="mx-50 my-20">
    
            <div v-if="isFiltered" class="relative group ml-2 inline-block mr-2">
                <FunnelX @click="resetFilter" class="translate-y-px text-slate-400 "/>
                <div class="absolute flex border-2 w-14 border-slate-300 bg-black text-white text-[10px] px-px -translate-x-14 -translate-y-12 opacity-0 invisible group-hover:opacity-100 visible group-hover:transition-opacity duration-200">Reset filter</div>
            </div>

            <div class="group relative inline-block">
                
                <button type="button" class="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                {{ status ?? 'Set status' }}
                </button>
                
                <div
                class="absolute left-full w-100 top-0 hidden group-hover:flex
                        items-center justify-evenly -translate-y-2 gap-x-2 bg-white border border-slate-200
                        rounded-xl p-2 shadow-md"
                >
                    <button
                        v-for="option in options"
                        :key="option"
                        type="button"
                        @click="() => {

                            status = option

                            renderTicketsByStatus()

                        }"
                        class="px-3 py-1.5 text-sm rounded-md  hover:bg-slate-200"
                    >
                        {{ option }}
                    </button>

                </div>

            </div>

            
            
            <div class="grid grid-cols-1 mt-2">

                <div class="grid grid-cols-5 justify-items-center border border-everGreen text-everGreen rounded-xl pointer-events-none p-2">

                    <p>Title</p>
                    <p>Assignee</p>
                    <p>Priority</p>
                    <p>Creator</p>
                    <p>Status</p>
                    
                </div>
                
                <div v-for="ticket in ticketStore.tickets" :key="ticket.id" class="relative group">
                    <RouterLink :to="{name: 'ticket-detail', params: { id: ticket.id }}" class="grid grid-cols-5 justify-items-center items-center p-2 cursor-default text-slate-500 group-hover:bg-everGreen rounded-xl group-hover:text-white">    
                        <p class="col-start-1">{{ ticket.title }}</p>
                        <p v-if="ticket.assignee" class="rounded-xl col-start-2">{{ ticket.assignee.name }}</p>
                        <p v-else class="rounded-xl col-start-2 p-2">Unassigned</p>
                        <p class="mr-4 col-start-3">{{ ticket.priority }}</p>
                        <p class="col-start-4">{{ ticket.creator.name }}</p>
                        <p class="col-start-5">{{ ticket.status }}</p>            
                    </RouterLink>
                </div>

            </div>
        </div>

    </div>

</template>