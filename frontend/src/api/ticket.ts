import api from "./axios";

export async function store(title: string, description: string, priority: null | string) {

    const res = await api.post('/create-ticket', {

        title,
        description,
        priority

    })

    return res.data

} 