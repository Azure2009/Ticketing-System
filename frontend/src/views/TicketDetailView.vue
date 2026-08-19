<script setup lang="ts">

    import { ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useTicketStore } from '../stores/ticket'
    import { useAuthStore } from '../stores/auth'
    import { useCommentStore } from '../stores/comment'
    import { FilePenLine, User as agentIcon, UserShield as adminIcon } from '@lucide/vue'

    let statusOptions = [ 'open', 'in progress', 'resolved', 'closed' ]

    let priorityOptions = [ 'low', 'medium', 'high', 'urgent' ]

    const isBeingEdited = ref(false)

    const ticketStore = useTicketStore()
    const authStore = useAuthStore()
    const commentStore = useCommentStore()

    const router = useRouter()
    const url = useRoute()

    const id = Number(url.params.id)

    const status = ref<null | string>(null)
    const priority = ref<null | string >(null)
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

            setTimeout(() => {

                successMessage.value = ''

            }, 3000)

        } catch {

            errorMessage.value = 'Ticket update failed. Please try again.'

            setTimeout(() => {

                errorMessage.value = ''

            }, 3000)

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

        status.value = ticketStore.ticketInView!.status

        priority.value = ticketStore.ticketInView!.priority

    }

    async function handlePost() {

       try {

        if (comment) {

            await commentStore.store(comment.value, id)
            await commentStore.index(id)
            comment.value = ''
            

        }
        
       } catch (error: any) {

            error.response?.data?.message ?? 'Cannot post ticket'

       }


    }

    onMounted(async () => {

        await ticketStore.show(id)
        await commentStore.index(id)
        
    })

</script>

<template>

    <div class="bg-slate-100">
        <!-- i configure ang pointer events to none ng loader para kahit nasa top layer siya di niya ma bloblock yung mga nasa ilalim -->
        <div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none text-black text-3xl">
            <div v-if="!ticketStore.ticketInView && !deleteMessage">Loading please wait...</div>
        </div>


        <div v-if="ticketStore.ticketInView" class="relative p-6 cursor-default">

            <button         
            v-if="authStore.user?.role === 'admin' && !deleteMessage"
            class="flex mb-4 text-slate-500 border border-slate-500  rounded-xl p-2 hover:text-red-500 hover:border-red-500 hover:transition-[text,border] duration-200 "
            @click="handleDelete"        
            >

            Delete this ticket

            </button>

            <p class="justify-self-center text-darkCoffee font-mono text-xl font-bold mb-4">Ticket</p>

            <!-- Ticket display ko -->

            <div class=" grid grid-cols-3 border border-darkCoffee rounded-xl mx-36 mb-6 p-4 bg-white">

                <div class="col-start-1 col-span-2 row-span-2 border border-darkCoffee rounded-xl p-4 row-start-1 gap-x-4">

                    <div class="">

                        <p class="text-5xl">{{ ticketStore.ticketInView?.title }}</p>
                        <p class="text-slate-500 mt-4">Created By: {{ ticketStore.ticketInView?.creator.name }}</p> 

                    </div>

                    <div class="mt-10">                    
                        <p class="text-xl font-bold">Description</p>
                        <p class="mt-2 ml-10">{{ ticketStore.ticketInView?.description }}</p>
                    </div>    

                </div>

                
                <div class="flex col-start-3 row-start-1">
                    
                    <button         
                    v-if="(authStore.user?.role === 'agent' || authStore.user?.role === 'admin') && !isBeingEdited && !deleteMessage"
                    class="group flex ml-auto mb-auto text-darkCoffee cursor-default rounded-xl p-2 hover:text-white transition-text duration-200 hover:bg-darkCoffee transition-bg duration-200"
                    @click="showForm"        
                    >
                        <FilePenLine/>
                        <div class="absolute pointer-events-none translate-x-8 flex border-2 w-42 border-slate-300 bg-black text-white text-[10px] px-px opacity-0 invisible group-hover:opacity-100 visible group-hover:transition-opacity duration-200">Set status, priority, and assignee id</div>
                    </button>

                </div>

                <div v-if="!isBeingEdited" class="gap-y-4 col-start-3 row-start-2 justify-self-center text-2xl">

                    <div class="flex items-center">
                        <p>Status:</p>
                        <p class="ml-2 font-mono text-lg">{{ ticketStore.ticketInView?.status }}</p>
                    </div>

                    <div class="flex items-center">
                        <p>Priority:</p>
                        <p class="ml-2 font-mono text-lg">{{ ticketStore.ticketInView?.priority }}</p>
                    </div>
                    
                    <p>Assigned to:</p>
                    <p class="font-mono text-lg">{{ ticketStore.ticketInView?.assignee?.name ?? 'Unassigned' }}</p>                        
                    

                    <p v-if="successMessage" class="text-green-500">{{ successMessage }}</p>
                    <p v-else-if="errorMessage" class="text-xl text-red-500">{{ errorMessage }}</p>
                    
                </div>

                <!-- Kapag ineedit ng user ko -->

                <div v-if="isBeingEdited" class="col-start-3 row-start-1 ml-auto text-2xl transition-opacity duration-200">

                    <div class="flex">
                        <button @click="() => {

                            isBeingEdited = false
                            
                        }"
                        class="decoration-darkCoffee decoration-2 underline-offset-2 hover:underline"
                        >
                        Cancel
                        </button>

                        <button @click="handleEdit" class="ml-4 decoration-darkCoffee decoration-2 underline-offset-2 hover:underline">Save</button>
                    </div>

                </div>

                <div v-if="isBeingEdited" class="relative col-start-3 row-start-2 justify-self-center text-2xl transition-opacity duration-200">

                    <p>Set status</p>

                    <div class="flex rounded-xl p-2 justify-evenly text-xs">
                                                                                    
                        <button
                            v-for="option in statusOptions"
                            :key="option"
                            type="button"
                            @click="status = option"                            
                            v-bind:class="[
                                'rounded-xl p-2 transition-colors duration-150',
                                status === option? 'bg-darkCoffee text-white' : 'hover:bg-slate-200'
                            ]">
                            {{ option }}
                        </button>

                    </div>

                    <p>Set priority</p>
                            
                    <div class="flex rounded-xl p-2 justify-evenly text-xs">
                        <button
                            v-for="option in priorityOptions"
                            :key="option"
                            type="button"
                            @click="priority = option"                            
                            v-bind:class="[
                                'rounded-xl p-2 transition-colors duration-150',
                                priority === option ? 'bg-darkCoffee text-white' : 'hover:bg-slate-200'
                            ]">                    
                            {{ option }}
                        </button>

                    </div>
                    
                    <p>Assigned to:</p>
                    <input v-model="assigned_to" type="text" placeholder="Enter assignee ID"  class="outline outline-black rounded-xl p-2">                    
                    
                </div>

            </div>

            <!-- Comment section -->

            <p class="justify-self-center text-darkCoffee font-mono text-xl font-bold mt-10 mb-4">Comments</p>

            <div class=" p-6 border border-darkCoffee rounded-xl mx-36 bg-white">

                <div v-if="commentStore.comments.length > 0" class="grid grid-col-1 gap-y-10">

                    <div v-for="comment in commentStore.comments" :key="comment.id" class="text-xl">
                        
                        <div class="flex">
                            <p class="font-bold mr-2">{{ comment.creator.name }}</p>
                            <adminIcon v-if="comment.creator.role == 'admin'"/>
                            <agentIcon v-else/>
                            <p class="ml-2 text-slate-500">{{ new Date(comment.created_at).toLocaleString() }}</p>
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