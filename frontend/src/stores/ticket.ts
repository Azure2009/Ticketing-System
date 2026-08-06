import { defineStore } from "pinia";
import { ref } from 'vue';
import { store as apiStore, index as apiIndex } from '../api/ticket';
import type { Ticket } from '../types/ticket'

export const useTicketStore = defineStore('ticket', () => {

    const ticket = ref(null)
    const tickets = ref<Ticket[]>([])

    async function store(title: string, description: string, priority: null | string) {

        ticket.value = await apiStore(title, description, priority)

    }

    async function index() {

        tickets.value = await apiIndex()

    }

    return { ticket, tickets, store, index }

})


