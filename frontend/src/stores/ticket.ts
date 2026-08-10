import { defineStore } from "pinia";
import { ref } from 'vue';
import { store as apiStore, index as apiIndex, show as apiShow, update as apiUpdate} from '../api/ticket';
import type { Ticket } from '../types/ticket'

export const useTicketStore = defineStore('ticket', () => {

    const ticket = ref<Ticket>()
    const tickets = ref<Ticket[]>([])
    const ticketInView = ref<Ticket | null>()

    async function store(title: string, description: string, priority: null | string) {

        ticket.value = await apiStore(title, description, priority)

    }

    async function index() {

        tickets.value = await apiIndex()

    }

    async function show(ticket_id: number) {

        ticketInView.value = null

        ticketInView.value = await apiShow(ticket_id)

    }

    async function update(ticket_id: number, assignee_id: null | string, priority: null | string, status: null | string) {

        ticket.value = await apiUpdate(ticket_id, assignee_id, priority, status)

    }

    return { ticket, tickets, ticketInView,store, index, show, update }

})


