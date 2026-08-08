<script setup lang="ts">

    import { onMounted } from 'vue'
    import { useTicketStore } from '../stores/ticket'
    import { RouterLink } from 'vue-router'

    const ticketStore = useTicketStore()

    onMounted(async () => {

        await ticketStore.index()

    })

</script>
<template>

    <div class="p-4">
        <p>My tickets</p>
        <p v-if="!ticketStore.tickets">Loading tickets...</p>
        <ul class="ml-20 grid grid-cols-1 gap-y-2 w-300 p-2 bg-slate-200 border border-blue-500 rounded-xl items-center" v-if="ticketStore.tickets">

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