import api from "./axios";
import type { Ticket } from '../types/ticket'

export async function store(title: string, description: string, priority: null | string) {

    const res = await api.post('/create-ticket', {

        title,
        description,
        priority

    })

    return res.data

}

export async function index(status: null | string): Promise<Ticket[]> {

    const url = status? `/tickets?status=${status}` : '/tickets'

    const res = await api.get(url)

    return res.data

}

export async function show(ticket_id: number): Promise<Ticket> {

    const res = await api.get(`/tickets/${ticket_id}`)

    return res.data

}

export async function update(ticket_id: number, assignee_id: null | string, priority: null | string, status: null | string): Promise<Ticket> {

    const res = await api.patch(`/tickets/${ticket_id}/update`, {

        assignee_id,
        priority,
        status

    })

    return res.data

}

export async function delete_ticket(ticket_id: number) {

    const res = await api.delete(`/tickets/${ticket_id}/delete`)

    console.log(res.data)

    return res.data

}