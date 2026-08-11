<script setup lang="ts">

    import { ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useTicketStore } from '../stores/ticket'
    import { useAuthStore } from '../stores/auth'

    const isBeingEdited = ref(false)

    const ticketStore = useTicketStore()
    const authStore = useAuthStore()

    const router = useRouter()
    const url = useRoute()

    const id = Number(url.params.id)

    const status = ref(null)
    const priority = ref(null)
    const assigned_to = ref('')
    const successMessage = ref('')
    const deleteMessage = ref('')
    const errorMessage = ref('')

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

    function rerouteToTicketList() {

        router.push({ name: 'tickets' })

    }

    function showForm() {
        isBeingEdited.value = true
    }

    onMounted(async () => {

        await ticketStore.show(id)
        console.log(deleteMessage.value)

    })

</script>

<template>
    <div class="relative p-4 justify-center">

        <p v-if="!ticketStore.ticketInView && !deleteMessage">Loading please wait...</p>
        <div v-if="!isBeingEdited">
        <p>{{ ticketStore.ticketInView?.title }}</p>
        <p>{{ ticketStore.ticketInView?.description }}</p>
        <p>{{ ticketStore.ticketInView?.status }}</p>
        <p>{{ ticketStore.ticketInView?.priority }}</p>
        <p>{{ ticketStore.ticketInView?.assignee?.name }}</p>
        </div> 

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

        <div class="flex gap-x-4">
            <button         
            v-if="authStore.user?.role === 'agent' || authStore.user?.role === 'admin' && !isBeingEdited && !deleteMessage"
            class="flex mt-20 text-white cursor-pointer bg-blue-500 rounded-xl p-2 hover:bg-blue-600"
            v-on:click="showForm"        
            >
            Edit
            </button>

            <button         
            v-if="authStore.user?.role === 'admin' && !isBeingEdited && !deleteMessage"
            class="flex mt-20 text-white cursor-pointer bg-red-500 rounded-xl p-2 hover:bg-blue-600"
            v-on:click="handleDelete"        
            >
            Delete
            </button>
        </div>

        <button class="flex ml-auto text-white cursor-pointer bg-blue-500 rounded-xl p-2 hover:bg-blue-600" v-on:click="rerouteToTicketList">My tickets</button>
        
    </div>
</template>