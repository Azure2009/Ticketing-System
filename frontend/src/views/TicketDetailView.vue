<script setup lang="ts">

    import { onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { useTicketStore } from '../stores/ticket'

    const ticketStore = useTicketStore()
    const url = useRoute()

    const id = Number(url.params.id)

    onMounted(async () => {

        await ticketStore.show(id)

    })

</script>
<template>
    <div class="p-4">
        <p v-if="ticketStore.ticketInView">This is ticket no. {{ ticketStore.ticketInView.id }}</p>
        <p v-if="!ticketStore.ticketInView">Loading please wait...</p>
    </div>
</template>