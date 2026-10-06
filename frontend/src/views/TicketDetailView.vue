<script setup lang="ts">

    import { ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useTicketStore } from '../stores/ticket'
    import { useAuthStore } from '../stores/auth'
    import { useCommentStore } from '../stores/comment'
    import { CircleX, Maximize2, FilePenLine, User as requesterIcon, UserCog as agentIcon, UserShield as adminIcon } from '@lucide/vue'

    let statusOptions = [ 'open', 'in progress', 'resolved', 'closed' ]

    let priorityOptions = [ 'low', 'medium', 'high', 'urgent' ]

    const isBeingEdited = ref(false)
    const isFullScreen = ref(false)

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

    onMounted(() => {

        window.scrollTo(0, 0)

    })

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

    function fullScreenOn() {

        document.body.style.overflow = 'hidden'
        isFullScreen.value = true

    }

    function fullScreenOff() {

        document.body.style.overflow = ''
        isFullScreen.value = false

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

    <div class="min-h-screen bg-slate-100">
        <!-- i configure ang pointer events to none ng loader para kahit nasa top layer siya di niya ma bloblock yung mga nasa ilalim -->
        <div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none text-slate-500 text-3xl">
            <div v-if="!ticketStore.ticketInView && !deleteMessage">Loading please wait...</div>
            
        </div>


        <div v-if="ticketStore.ticketInView" class="flex flex-col items-center p-2 cursor-default mt-2">

            <p class="justify-self-center text-everGreen font-mono text-xl font-bold mb-4 min-5xl:text-5xl">Ticket</p>

            <!-- Ticket display ko -->

            <div class=" grid grid-cols-3 gap-2 border border-everGreen rounded-xl mb-6 p-4 max-5xl:w-full min-5xl:w-300 bg-white">

                <div class="col-start-1 col-span-3 relative flex flex-col gap-3 border border-everGreen rounded-xl p-2">

                    <Maximize2 @click="fullScreenOn" class="ml-auto cursor-pointer right-2 top-2 text-everGreen translate-y-[4px] w-4 h-4 min-5xl:w-10 min-5xl:h-10 transition-all duration-200 hover:w-5 hover:h-5 hover:min-5xl:w-14 hover:min-5xl:h-14"/>

                    <div class="text-center">

                        <p class="text-2xl truncate min-5xl:text-5xl mb-4">{{ ticketStore.ticketInView?.title }}</p>
                        
                        <div class="text-slate-500 min-5xl:text-3xl">
                            <p>Created By</p>
                            <p>{{ ticketStore.ticketInView?.creator.name }}</p> 
                        </div>

                    </div>

                    <div>
                        <p class="text-lg min-5xl:text-3xl font-bold">Description</p>                    
                        <p class="indent-8 truncate min-5xl:text-2xl">{{ ticketStore.ticketInView?.description }}</p>
                    </div>

                </div>

                <div v-if="!isBeingEdited" class="gap-y-4 col-start-1 col-span-3 row-start-2  text-2xl">

                    <button         
                    v-if="(authStore.user?.role === 'agent' || authStore.user?.role === 'admin') && !isBeingEdited && !deleteMessage"
                    class="group flex items-center ml-auto mb-auto text-everGreen cursor-default rounded-xl p-2 hover:text-white transition-text duration-200 hover:bg-everGreen transition-bg duration-200"
                    @click="showForm"        
                    >
                        <FilePenLine class="min-5xl:w-10 min-5xl:h-10"/>
                        <div class="absolute pointer-events-none flex border-2 min-5xl:text-xl w-fit text-nowrap -translate-x-44 min-5xl:-translate-x-84 border-slate-300 bg-black text-white text-[10px] px-px opacity-0 invisible group-hover:opacity-100 visible group-hover:transition-opacity duration-200">Set status, priority, and assignee id</div>
                    </button>


                    <div class="flex items-center">
                        <p class="min-5xl:text-4xl">Status:</p>
                        <p class="ml-2 translate-y-[2px] font-mono text-lg min-5xl:text-3xl">{{ ticketStore.ticketInView?.status }}</p>
                    </div>

                    <div class="flex items-center">
                        <p class="min-5xl:text-4xl">Priority:</p>
                        <p class="ml-2 translate-y-[2px] font-mono text-lg min-5xl:text-3xl" >{{ ticketStore.ticketInView?.priority }}</p>
                    </div>
                    
                    <div class="flex items-center">
                        <p class="min-5xl:text-4xl">Assigned to:</p>
                        <p class="ml-2 translate-y-[2px] font-mono text-lg min-5xl:text-3xl" >{{ ticketStore.ticketInView?.assignee?.name ?? 'Unassigned' }}</p>                        
                    </div>

                    <p v-if="successMessage" class="text-green-500 min-5xl:text-2xl">{{ successMessage }}</p>
                    <p v-else-if="errorMessage" class="text-xl text-red-500 min-5xl:text-2xl">{{ errorMessage }}</p>
                    
                </div>

                <!-- Kapag ineedit ng user ko -->
                <div v-if="isBeingEdited" class="grid gap-2 min-md:text-xl min-5xl:text-4xl justify-items-center gap-4 row-start-2 col-span-3">

                    <p class="flex justify-self-center text-nowrap">Set status</p>

                    <div class="flex rounded-xl p-[2px] text-nowrap gap-2 max-mobileS:justify-evenly text-xs min-md:text-sm">
                                                                                    
                        <button
                            v-for="option in statusOptions"
                            :key="option"
                            type="button"
                            @click="status = option"                            
                            v-bind:class="[
                                'rounded-xl p-2 transition-colors duration-150 min-5xl:text-2xl',
                                status === option? 'bg-everGreen text-white' : 'hover:bg-slate-200'
                            ]">
                            {{ option }}
                        </button>

                    </div>

                    <p class="flex justify-self-center text-nowrap">Set priority</p>
                            
                    <div class="flex rounded-xl pr-2 py-[2px] gap-2 text-xs min-md:text-sm">
                        <button
                            v-for="option in priorityOptions"
                            :key="option"
                            type="button"
                            @click="priority = option"                            
                            v-bind:class="[
                                'rounded-xl p-2 transition-colors duration-150 min-5xl:text-2xl',
                                priority === option ? 'bg-everGreen text-white' : 'hover:bg-slate-200'
                            ]">                    
                            {{ option }}
                        </button>

                    </div>
                    
                    <p class="text-nowrap">Assigned to:</p>

                    <input v-model="assigned_to" type="text" placeholder="Enter assignee ID"  class="outline outline-black rounded-xl p-2">                    
                    
                </div>

                <!-- Cancel and save button -->
                <div v-if="isBeingEdited" class="col-start-1 col-span-3 row-start-5 min-md:text-xl">

                    <div class="flex w-fit ml-auto">
                        <button @click="() => {

                            isBeingEdited = false
                            
                        }"
                        class="decoration-everGreen decoration-2 underline-offset-2 hover:underline min-5xl:text-4xl"
                        >
                        Cancel
                        </button>

                        <button @click="handleEdit" class="ml-4 decoration-everGreen decoration-2 underline-offset-2 hover:underline min-5xl:text-4xl">Save</button>
                    </div>

                </div>

            </div>

            <!-- Kapag finullscreen yung initial details -->

            <div v-if="isFullScreen" class="fixed inset-0 flex justify-center items-center mx-2">

                <div class="flex flex-col text-white ring-2 p-2 bg-everGreen w-full h-fit rounded-xl">
                    
                    <CircleX @click="fullScreenOff" class="cursor-pointer flex ml-auto min-5xl:w-14 min-5xl:h-14"/>
                    
                    <div class="text-center">

                        <p class="text-2xl min-5xl:text-5xl mb-4">{{ ticketStore.ticketInView?.title }}</p>
                        
                        <div class="min-5xl:text-3xl">
                            <p>Created By</p>
                            <p>{{ ticketStore.ticketInView?.creator.name }}</p> 
                        </div>

                    </div>

                    <div class="p-2">
                          
                        <p class="text-lg font-bold min-5xl:text-4xl">Description</p>                    
                        
                        <div class="border-4 border-everGreen-darker p-2">
                            <p class=" indent-8 break-words text-wrap min-5xl:text-3xl">{{ ticketStore.ticketInView?.description }}</p>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Comment section -->

            <p class="flex text-everGreen font-mono text-xl font-bold mt-10 mb-4 min-5xl:text-5xl">Comments</p>

            <div class="p-2 border max-5xl:w-full w-1/2 border-everGreen rounded-xl bg-white">

                <div v-if="commentStore.comments.length > 0" class="grid grid-col-1 gap-y-10">

                    <div v-for="comment in commentStore.comments" :key="comment.id" class="text-xl">
                        
                        <div class="flex items-center">
                            <div class="flex items-center gap-x-[4px]">
                                <p class="text-xs min-md:text-lg w-fit text-nowrap font-bold min-5xl:text-3xl">{{ comment.creator.name }}</p>
                                <adminIcon v-if="comment.creator.role == 'admin'" class="w-4 h-4 min-md:w-6 min-md:h-6 mr-2 min-5xl:w-10 min-5xl:h-10 mr-2"/>
                                <agentIcon v-else-if="comment.creator.role == 'agent'" class="w-4 h-4 min-md:w-6 min-md:h-6 mr-2 min-5xl:w-10 min-5xl:h-10 mr-2"/>
                                <requesterIcon v-else class="w-4 h-4 min-md:w-6 min-md:h-6 mr-2 min-5xl:w-10 min-5xl:h-10 mr-2"/>
                            </div>
                            <p class="text-xs min-lg:text-base min-5xl:text-2xl min-md:mr-auto text-nowrap max-md:ml-auto text-slate-500">{{ new Date(comment.created_at).toLocaleString() }}</p>
                        </div>

                        <p class="text-sm min-3xl:text-base min-5xl:text-2xl">{{ comment.body }}</p>
                        
                    </div>
                </div>

                <div v-else class="text-slate-500 justify-self-center min-5xl:text-2xl">
                    <p>No comments yet</p>
                </div>

                <form @submit.prevent="handlePost" class="mt-4 bg-slate-200 rounded-xl p-2">
                    <textarea v-model="comment" id="comment" placeholder="Post a comment" class="w-full p-2 resize-none rounded-xl outline-none min-5xl:text-2xl"></textarea>
                    <button type="submit" class="flex ml-auto mr-2 border bg-everGreen text-white rounded-xl mt-2 py-[1] px-4 text-slate-500 cursor-pointer min-5xl:text-2xl">Post</button>
                </form>            
                
            </div>

            <button         
            v-if="authStore.user?.role === 'admin' && !deleteMessage"
            class="flex w-fit mb-4 mt-4 text-slate-500 border border-slate-500 min-5xl:text-3xl rounded-xl p-2 hover:text-red-500 hover:border-red-500 hover:transition-[text,border] duration-200 "
            @click="handleDelete"        
            >

            Delete this ticket

            </button>
            
        </div>

    </div>

</template>