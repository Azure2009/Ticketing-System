<script setup lang="ts">

    import { ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useTicketStore } from '../stores/ticket'
    import { useAuthStore } from '../stores/auth'
    import { useCommentStore } from '../stores/comment'
    import { FilePenLine, User as agentIcon, UserShield as adminIcon } from '@lucide/vue'

    const isBeingEdited = ref(false)

    const ticketStore = useTicketStore()
    const authStore = useAuthStore()
    const commentStore = useCommentStore()

    const router = useRouter()
    const url = useRoute()

    const id = Number(url.params.id)

    const status = ref(null)
    const priority = ref(null)
    const assigned_to = ref('')
    const successMessage = ref('')
    const deleteMessage = ref('')
    const errorMessage = ref('')
    const comment = ref('')

    async function handleEdit() {

        isBeingEdited.value = false

        const assignee_id = assigned_to.value === ''? null : assigned_to.value // since ang input na text type ay empty string by default, naisip ko na kung sakaling di kasama sa inedit nng user yung 
        // pag asign ng assignee o kaya in-empty niya, dapat ma convert sa null dahil naka nullable tayo dun sa update controller ng ticket.

        try {
            
            await ticketStore.update(id, assignee_id, priority.value, status.value)

            successMessage.value = 'Ticket successfully updated.'

        } catch (error: any) {

            errorMessage.value = error.response?.data?.message

        }

    }

    async function handleDelete() {

        try {

            const confirmed = confirm('Are you sure you want to delete this ticket?')
            
            if (confirmed) {

                await ticketStore.delete_ticket(id)

                router.push({ name: 'tickets' })

            }

        } catch (error: any) {
            
            errorMessage.value = error.response?.data?.message

        }

    }

    function showForm() {
        isBeingEdited.value = true
    }

    async function handlePost() {

       try {

        if (comment) {

            await commentStore.store(comment.value, id)
            await commentStore.index(id)
            comment.value = ''

        }
        
       } catch (error: any) {

            console.log(error)

       }


    }

    onMounted(async () => {

        await ticketStore.show(id)
        await commentStore.index(id)

        console.log(deleteMessage.value)

    })

</script>

<template>

    <div class="bg-slate-100">
        <div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none text-black text-3xl">
            <div v-if="!ticketStore.ticketInView && !deleteMessage">Loading please wait...</div>
        </div>


        <div v-if="ticketStore.ticketInView" class="relative p-6">

            <button         
            v-if="authStore.user?.role === 'admin' && !isBeingEdited && !deleteMessage"
            class="flex mb-4 text-slate-500 cursor-pointer border border-slate-500  rounded-xl p-2 hover:text-darkCoffee hover:border-darkCoffee hover:transition-[text,border] duration-200 "
            @click="handleDelete"        
            >

            Delete this ticket

            </button>

            <p class="justify-self-center text-darkCoffee font-mono text-xl font-bold mb-4">Ticket</p>

            <!-- Ticket display ko -->

            <div v-if="!isBeingEdited" class="grid grid-cols-3 border border-darkCoffee rounded-xl mx-36 mb-6 p-4 bg-white">

                <div v-if="!isBeingEdited" class="col-start-1 col-span-2 row-span-2 border border-darkCoffee rounded-xl p-4 row-start-1 gap-x-4">

                    <div class="">

                        <p class="text-5xl">{{ ticketStore.ticketInView?.title }}</p>
                        <p class="text-slate-500 mt-4">Created By: {{ ticketStore.ticketInView?.creator.name }}</p> 

                    </div>

                    <div class="mt-10">                    
                        <p class="text-xl font-bold">Description</p>
                        <p class="mt-2 ml-10">{{ ticketStore.ticketInView?.description }}</p>
                    </div>    

                </div>

                <button         
                v-if="authStore.user?.role === 'agent' || authStore.user?.role === 'admin' && !isBeingEdited && !deleteMessage"
                class="flex col-start-3 row-start-1 ml-auto mb-auto text-darkCoffee cursor-pointer rounded-xl"
                @click="showForm"        
                >
                    <FilePenLine/>
                </button>

                <div class="col-start-3 row-start-2 justify-self-center text-2xl">

                    <div class="flex items-center">
                        <p>Status:</p>
                        <p class="ml-2 font-mono text-lg">{{ ticketStore.ticketInView?.status }}</p>
                    </div>

                    <div class="flex items-center">
                        <p>Priority:</p>
                        <p class="ml-2 font-mono text-lg">{{ ticketStore.ticketInView?.priority }}</p>
                    </div>

                    <div class="flex items-center">
                        <p>Assigned to:</p>
                        <p class="ml-2 font-mono text-lg">{{ ticketStore.ticketInView?.assignee?.name ?? 'Unassigned' }}</p>
                    </div>
                    
                </div>

            </div>

            <!-- Editing form -->

            <form v-if="isBeingEdited === true && !deleteMessage" @submit.prevent="handleEdit" class="">
                
                <div class="flex">

                    <select class="mt-4 focus:outline-none" id="status" v-model="status">          
                        <option :value="null" disabled selected>Set status (default: open)</option>          
                        <option class="text-white bg-green-500" value="open">open</option>
                        <option class="text-white bg-yellow-500" value="in_progress">in_progress</option>
                        <option class="text-white bg-orange-500" value="resolved">resolved</option>
                        <option class="text-white bg-red-500" value="closed">closed</option>
                    </select>

                </div>

                <div class="flex">

                    <select class="mt-4 focus:outline-none" id="priority" v-model="priority">                              
                        <option :value="null" disabled selected>Set priority (default: medium)</option>          
                        <option class="text-white bg-green-500" value="low">low</option>
                        <option class="text-white bg-yellow-500" value="medium">medium</option>
                        <option class="text-white bg-orange-500" value="high">high</option>
                        <option class="text-white bg-red-500" value="urgent">urgent</option>
                    </select>

                </div>

                <div class="flex my-4 items-center">
                    <label for="assigned_to">Assigned to</label>
                    <input type="text" id="assigned_to" v-model="assigned_to" placeholder="Enter assignee's id" class="ml-2 p-2 border border-blue-500 rounded-xl bg-white focus:outline-blue-500 rounded-xl">            
                </div>

                <div class="flex gap-x-4">
                    <button v-on:click="isBeingEdited = false" class="relative flex text-white cursor-pointer bg-blue-500 rounded-xl p-2 hover:bg-blue-600">Cancel</button>
                    <button type="submit" class="relative flex text-white cursor-pointer bg-blue-500 rounded-xl p-2 hover:bg-blue-600">Save</button>
                </div>

            </form>

            <p v-if="successMessage" class="text-green-500">Ticket successfully updated</p>


            <!-- Comment section -->

            <p class="justify-self-center text-darkCoffee font-mono text-xl font-bold mt-10 mb-4">Comments</p>

            <div class=" p-6 border border-darkCoffee rounded-xl mx-36 bg-white">

                <div v-if="commentStore.comments.length > 0" class="grid grid-col-1 gap-y-10">

                    <div v-for="comment in commentStore.comments" :key="comment.id" class="text-xl">
                        
                        <div class="flex">
                            <p class="font-bold mr-2">{{ comment.creator.name }}</p>
                            <adminIcon v-if="comment.creator.role == 'admin'"/>
                            <agentIcon v-else/>
                        </div>

                        <p>{{ comment.body }}</p>
                        
                    </div>
                </div>

                <div v-else class="text-slate-500 justify-self-center">
                    <p>No comments yet</p>
                </div>

                <form @submit.prevent="handlePost" class="mt-4 bg-slate-200 rounded-xl p-2">
                    <textarea v-model="comment" id="comment" placeholder="Post a comment" class="w-full p-2 resize-none rounded-xl outline-none"></textarea>
                    <button type="submit" class="flex ml-auto mr-2 border bg-darkCoffee text-white rounded-xl mt-2 py-[1] px-4 text-slate-500 cursor-pointer">Post</button>
                </form>            
                
            </div>
            
        </div>

    </div>

</template>