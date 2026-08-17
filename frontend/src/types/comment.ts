export interface Comment {

    id: number,
    user_id: number,
    ticket_id: number,
    body: string
    creator: { id: number, name: string, email: string, role: string }, 
    ticket: { id: number, title: string},
    created_at: string 

}