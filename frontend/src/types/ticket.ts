export interface Ticket {

    id: number,
    title: string,
    description: string,
    user_id: number,
    assigned_to: number | null,
    status: string,
    priority: string,
    creator: {id: number; name:string; email:string},
    assignee: {id: number; name:string; email:string} | null

}

