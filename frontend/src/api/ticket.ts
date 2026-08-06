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

export async function index(): Promise<Ticket[]> {

    const res = await api.get('/tickets')

    return res.data

}

