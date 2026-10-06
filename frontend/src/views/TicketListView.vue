<script setup lang="ts">

    import { onMounted, ref, render } from 'vue'
    import { CircleX, Plus } from '@lucide/vue'
    import { useTicketStore } from '../stores/ticket'
    import { RouterLink, useRouter } from 'vue-router'
    
    let statusOptions = [ 'open', 'in progress', 'resolved', 'closed' ]
    let priorityOptions = [ 'low', 'medium', 'high', 'urgent' ]

    const ticketStore = useTicketStore()
    const router = useRouter()

    const status = ref<null | string>(null)
    const priority = ref<null | string>(null)

    const isStatusSet = ref(false)
    const isPrioritySet = ref(false)

    const isFiltered = ref(false)

    const hasFetchedOnce = ref(false)
    const isLoading = ref(false) 

    async function fetchTickets(newStatus: string | null, newPriority: string | null) { // Prupose nito is para mag stostop na yung loading message the moment na ma fetch na yung tickets -- di na kailangang hintayin matapos yung 0.3 second
        const timer = setTimeout(() => {
            isLoading.value = true
        }, 300)

        try {
            await ticketStore.index(newStatus, newPriority)
        } finally {
            clearTimeout(timer)
            isLoading.value = false
            hasFetchedOnce.value = true
        }
    }

    onMounted(() => {
        fetchTickets(status.value, priority.value) // note: sabay nangyayari ang callback sa onMounted at pag render nung template, so kung walang hasfetchOnce sa finally keyword, magchecheck na agad ng length ng tickets array si Vue. 
    })

    async function renderTicketsByFilter() {

        isFiltered.value = true

        if (!status) {

            await fetchTickets(null, priority.value)

        }
        
        if (!priority) {

            await fetchTickets(status.value, null)

        }

        await fetchTickets(status.value, priority.value)
        
    }

    async function resetFilter() {

        await fetchTickets(null, null)

        isStatusSet.value = false
        status.value = null

        isPrioritySet.value = false
        priority.value = null
        
        isFiltered.value = false
        
    }

    function resetStatus() {

        isFiltered.value = false
        status.value = null
        isStatusSet.value = false
        renderTicketsByFilter()

    }

    function resetPriority() {

        isFiltered.value = false
        priority.value = null
        isPrioritySet.value = false
        renderTicketsByFilter()

    }

</script>
<template>
    <div v-if="isLoading" class="absolute inset-0 flex justify-self-center self-center self-center text-3xl text-slate-500">Loading tickets...</div>

    <div v-else-if="hasFetchedOnce"> <!-- Kailangan toh gawing wrapper sa if statements para ichecheck lang yung length ng tickets array kung tapos na mag fetch -->

        <div class="mx-2 mt-2" v-if="ticketStore.tickets.length === 0"> <!-- Truthy ang array kahit empty pa yung loob kaya hindi gagana yung condition na !ticketStore.tickets -->
            <div v-if="!isFiltered">
                <div class="absolute inset-0 flex justify-self-center self-center text-3xl text-slate-500">
                    <div class="grid grid-cols-1 gap-y-4">
                        <p class="flex justify-self-center">No tickets available.</p>
                        <p class="flex justify-self-center">Create your first ticket</p>
                        <Plus @click="() => {router.push({ name: 'main' })}" class="flex justify-self-center cursor-pointer"/>
                    </div>  
                </div>     
            </div>

            <div class="flex flex-col gap-2">

                <div class="flex items-center gap-2">

                    <div class="flex group w-fit ">

                        <button type="button" class="px-3 py-2 border border-slate-300 rounded-lg text-sm 5xl:text-2xl">
                        Set status
                        </button>

                        <div class="absolute translate-y-[2px] 5xl:-translate-y-[1px] translate-x-[6px] p-[2px] flex w-fit opacity-0 invisible items-center justify-evenly gap-x-[2px] bg-white border border-slate-200 rounded-xl shadow-md group-hover:opacity-100 group-hover:visible">
                            
                            <button
                                v-for="option in statusOptions"
                                :key="option"
                                type="button"
                                @click="() => {

                                    status = option
                                    isStatusSet = true

                                    renderTicketsByFilter()

                                }"
                                class="px-3 py-1.5 text-xs 5xl:text-2xl rounded-md text-nowrap hover:bg-slate-200"
                            >
                                {{ option }}
                            </button>

                        </div>

                    </div>

                </div>

                <div class="flex items-center gap-2">

                    <div class="flex group w-fit ">

                        <button type="button" class="px-3 py-2 border border-slate-300 rounded-lg text-sm 5xl:text-2xl">
                        Set priority
                        </button>

                        <div class="absolute translate-y-[2px] 5xl:-translate-y-[1px] translate-x-[6px] p-[2px] flex w-fit opacity-0 invisible items-center justify-evenly gap-x-[2px] bg-white border border-slate-200 rounded-xl shadow-md group-hover:opacity-100 group-hover:visible">
                            
                            <button
                                v-for="option in priorityOptions"
                                :key="option"
                                type="button"
                                @click="() => {

                                    priority = option
                                    isPrioritySet = true

                                    renderTicketsByFilter()

                                }"
                                class="px-3 py-1.5 text-xs 5xl:text-2xl rounded-md text-nowrap hover:bg-slate-200"
                            >
                                {{ option }}
                            </button>

                        </div>

                    </div>

                </div>
                
                <div class="flex items-center gap-2">
                    <div v-if="isStatusSet" class="flex text-xs 5xl:text-2xl text-slate-500 items-center h-fit bg-slate-300 pl-[2px] rounded-full">
                        <p class="flex px-[2px] justify-center 5xl:-translate-y-[2px]">{{ status }}</p>
                        <CircleX class="flex ml-auto cursor-pointer 5xl:w-10 5xl:h-10" @click="resetStatus"/>
                    </div>

                    <div v-if="isPrioritySet" class="flex text-xs 5xl:text-2xl text-slate-500 items-center h-fit bg-slate-300 pl-[2px] rounded-full">
                        <p class="flex px-[2px] justify-center 5xl:-translate-y-[2px]">{{ priority }}</p>
                        <CircleX class="flex ml-auto cursor-pointer 5xl:w-10 5xl:h-10" @click="resetPriority"/>
                    </div>
                </div>

            </div>

            <div class="5xl:text-4xl mt-2 grid grid-cols-1 min-md:grid-cols-3 min-lg:grid-cols-5 min-lg:col-span-5 min-md:justify-between items-center min-md:col-span-3 justify-center border border-everGreen text-everGreen rounded-xl pointer-events-none py-2">

                <p class="justify-self-center">Title</p>
                <p class="max-md:hidden min-md:justify-self-center">Creator</p>
                <p class="max-md:hidden min-md:justify-self-center">Assignee</p>
                <p class="max-lg:hidden min-lg:justify-self-center">Status</p>
                <p class="max-lg:hidden min-lg:justify-self-center">Priority</p>


            </div>

            <div v-if="isFiltered" class="mt-40">
                <div>
                    <p class="pointer-events-none text-center text-black text-xl 5xl:text-3xl text-slate-800">No tickets available for this query.</p> 
                    <button @click="resetFilter" class="flex mt-2 justify-self-center 5xl:text-3xl text-slate-500 hover:underline decoration-darkSpruce underline-offset-2">Reset</button>
                </div>
            </div>
  
            

        </div>
        
        <div v-else-if="ticketStore.tickets.length > 0" class="mx-2 mt-2">
            
            <div class="flex flex-col gap-2">

                <div class="flex items-center gap-2">

                    <div class="flex group w-fit ">

                        <button type="button" class="px-3 py-2 border border-slate-300 rounded-lg text-sm 5xl:text-2xl">
                        Set status
                        </button>

                        <div class="absolute translate-y-[2px] 5xl:-translate-y-[1px] translate-x-[6px] p-[2px] flex w-fit opacity-0 invisible items-center justify-evenly gap-x-[2px] bg-white border border-slate-200 rounded-xl shadow-md group-hover:opacity-100 group-hover:visible">
                            
                            <button
                                v-for="option in statusOptions"
                                :key="option"
                                type="button"
                                @click="() => {

                                    status = option
                                    isStatusSet = true

                                    renderTicketsByFilter()

                                }"
                                class="px-3 py-1.5 text-xs 5xl:text-2xl rounded-md text-nowrap hover:bg-slate-200"
                            >
                                {{ option }}
                            </button>

                        </div>

                    </div>

                </div>

                <div class="flex items-center gap-2">

                    <div class="flex group w-fit ">

                        <button type="button" class="px-3 py-2 border border-slate-300 rounded-lg text-sm 5xl:text-2xl">
                        Set priority
                        </button>

                        <div class="absolute translate-y-[2px] 5xl:-translate-y-[1px] translate-x-[6px] p-[2px] flex w-fit opacity-0 invisible items-center justify-evenly gap-x-[2px] bg-white border border-slate-200 rounded-xl shadow-md group-hover:opacity-100 group-hover:visible">
                            
                            <button
                                v-for="option in priorityOptions"
                                :key="option"
                                type="button"
                                @click="() => {

                                    priority = option
                                    isPrioritySet = true

                                    renderTicketsByFilter()

                                }"
                                class="px-3 py-1.5 text-xs 5xl:text-2xl rounded-md text-nowrap hover:bg-slate-200"
                            >
                                {{ option }}
                            </button>

                        </div>

                    </div>

                </div>
                
                <!-- <button class="flex w-fit cursor-pointer border border-slate-500 py-2 px-3 rounded-xl" @click="renderTicketsByFilter">Filter</button> -->

                <div class="flex items-center gap-2">

                    <div v-if="isStatusSet" class="flex text-xs 5xl:text-2xl text-slate-500 items-center h-fit bg-slate-300 pl-[2px] rounded-full">
                        <p class="flex px-[2px] justify-center 5xl:-translate-y-[2px]">{{ status }}</p>
                        <CircleX class="flex ml-auto cursor-pointer 5xl:w-10 5xl:h-10" @click="resetStatus"/>
                    </div>

                    <div v-if="isPrioritySet" class="flex text-xs 5xl:text-2xl text-slate-500 items-center h-fit bg-slate-300 pl-[2px] rounded-full">
                        <p class="flex px-[2px] justify-center 5xl:-translate-y-[2px]">{{ priority }}</p>
                        <CircleX class="flex ml-auto cursor-pointer 5xl:w-10 5xl:h-10" @click="resetPriority"/>
                    </div>

                </div>

            </div>

            <div class="grid grid-cols-1 min-md:grid-cols-3 gap-2 mt-2">

                <div class="5xl:text-4xl grid grid-cols-1 min-md:grid-cols-3 min-lg:grid-cols-5 min-lg:col-span-5 min-md:justify-between items-center min-md:col-span-3 justify-center border border-everGreen text-everGreen rounded-xl pointer-events-none py-2">

                    <p class="justify-self-center">Title</p>
                    <p class="max-md:hidden min-md:justify-self-center">Creator</p>
                    <p class="max-md:hidden min-md:justify-self-center">Assignee</p>
                    <p class="max-lg:hidden min-lg:justify-self-center">Status</p>
                    <p class="max-lg:hidden min-lg:justify-self-center">Priority</p>
                    
                </div>
                
                <div v-for="ticket in ticketStore.tickets" :key="ticket.id" class="group min-md:col-span-3 min-lg:col-span-5">
                    <RouterLink :to="{name: 'ticket-detail', params: { id: ticket.id }}" class="5xl:text-3xl grid min-md:grid min-md:grid-cols-3 min-md:col-span-3 min-lg:grid-cols-5 min-lg:col-span-5 items-center justify-items-center p-2 cursor-default text-slate-500 group-hover:bg-everGreen rounded-xl group-hover:text-white">    
                        <p class="col-start-1">{{ ticket.title }}</p>
                        <p class="max-md:hidden col-start-2">{{ ticket.creator.name }}</p>
                        <p v-if="ticket.assignee" class="max-md:hidden rounded-xl col-start-3">{{ ticket.assignee.name }}</p>
                        <p v-else class="max-md:hidden rounded-xl col-start-2 p-2 col-start-3">Unassigned</p>
                        <p class="max-lg:hidden col-start-4">{{ ticket.status }}</p>
                        <p class="max-lg:hidden col-start-5">{{ ticket.priority }}</p>
                        
                    </RouterLink>
                </div>

            </div>
        </div>

    </div>

</template>