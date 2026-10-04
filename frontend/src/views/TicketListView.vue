<script setup lang="ts">

    import { onMounted, ref } from 'vue'
    import { CircleX, Plus } from '@lucide/vue'
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
                    <p class="pointer-events-none text-center text-black text-3xl text-slate-800">No tickets available for this status</p> 
                    <button @click="resetFilter" class="flex mt-2 justify-self-center text-slate-500 hover:underline decoration-darkSpruce underline-offset-2">Reset</button>
                </div>
            </div>

        </div>
        
        <div v-else-if="ticketStore.tickets.length > 0" class="mx-2 mt-2">
            
            <div class="flex items-center gap-2">

                <div class="flex group w-fit">

                    <button type="button" class="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                    Set status
                    </button>

                    <div class="absolute translate-y-9 translate-x-[3px] flex flex-col w-fit opacity-0 invisible items-center justify-evenly gap-x-[2px] bg-white border border-slate-200 rounded-xl shadow-md group-hover:opacity-100 group-hover:visible">
                        
                        <button
                            v-for="option in options"
                            :key="option"
                            type="button"
                            @click="() => {

                                status = option

                                renderTicketsByStatus()

                            }"
                            class="px-3 py-1.5 text-xs rounded-md text-nowrap hover:bg-slate-200"
                        >
                            {{ option }}
                        </button>

                    </div>

                </div>

                <div v-if="isFiltered" class="flex text-xs text-slate-500 items-center h-fit bg-slate-300 pl-[2px] rounded-full">
                    <p class="flex px-[2px] justify-center">{{ status }}</p>

                    
                    <CircleX class="flex ml-auto cursor-pointer" @click="resetFilter"/>
                    
                    
                </div>
            
            </div>
            
            <div class="grid grid-cols-1 min-md:grid-cols-3 gap-2 mt-2">

                <div class="grid grid-cols-1 min-md:grid-cols-3 min-md:justify-between items-center min-md:col-span-3 justify-center border border-everGreen text-everGreen rounded-xl pointer-events-none py-2">

                    <p class="justify-self-center">Title</p>
                    <p class="max-md:hidden min-md:justify-self-center">Creator</p>
                    <p class="max-md:hidden min-md:justify-self-center">Assignee</p>
                    
                </div>
                
                <div v-for="ticket in ticketStore.tickets" :key="ticket.id" class="group min-md:col-span-3">
                    <RouterLink :to="{name: 'ticket-detail', params: { id: ticket.id }}" class="grid min-md:grid min-md:grid-cols-3 min-md:col-span-3 items-center justify-items-center p-2 cursor-default text-slate-500 group-hover:bg-everGreen rounded-xl group-hover:text-white">    
                        <p class="col-start-1">{{ ticket.title }}</p>
                        <p class="max-md:hidden col-start-2">{{ ticket.creator.name }}</p>
                        <p v-if="ticket.assignee" class="max-md:hidden rounded-xl col-start-3">{{ ticket.assignee.name }}</p>
                        <p v-else class="max-md:hidden rounded-xl col-start-2 p-2 col-start-3">Unassigned</p>
                        <!-- <p class="mr-4 col-start-3">{{ ticket.priority }}</p>
                        
                        <p class="col-start-5">{{ ticket.status }}</p>              -->
                    </RouterLink>
                </div>

            </div>
        </div>

    </div>

</template>