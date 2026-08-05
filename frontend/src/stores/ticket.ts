import { defineStore } from "pinia";
import { ref } from 'vue';
import { store as apiStore } from '../api/ticket';


export const useTicketStore = defineStore('ticket', () => {

    const ticket = ref(null)

    async function store(title: string, description: string, priority: null | string) {

        ticket.value = await apiStore(title, description, priority)

    }

    return { ticket, store }

})
