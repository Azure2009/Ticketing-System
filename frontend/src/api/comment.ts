import api from './axios'
import {type Comment} from '../types/comment'

export async function index(id: number): Promise<Comment[]> {

    const res = await api.get(`/tickets/${id}/comments`)

    return res.data

}

export async function store(body: string, id: number): Promise<Comment> {

    const res = await api.post(`/tickets/${id}/comments`, {

        body

    })

    return res.data

}


