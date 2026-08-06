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

    <p>My tickets</p>
    <ul class="grid grid-cols-1 gap-y-2 w-100 p-2 bg-slate-200 border border-blue-500 rounded-xl">

        <li class="grid grid cols-6" v-for="ticket in ticketStore.tickets" :key="ticket.id">
            
            <p class="text-blue-500 col-start-1">{{ ticket.title }}</p>
            <p v-if="ticket.assignee" class="ml-auto bg-green-500 rounded-xl col-start-2">Assigned to: {{ ticket.assignee.name }}</p>
            <p v-else class="ml-auto bg-gray-500 rounded-xl col-start-2">Unassigned</p>
            <p class="mr-4 col-start-3">Priority: {{ ticket.priority }}</p>
            <p class="col-start-4">Created by: {{ ticket.creator.name }}</p>
            <p class="col-start-5">Status: {{ ticket.status }}</p>
            
            <RouterLink :to="{name: 'ticket-detail', params: { id: ticket.id}}" class="col-start-6"><button>...</button></RouterLink>

        </li>
    </ul>

</template>