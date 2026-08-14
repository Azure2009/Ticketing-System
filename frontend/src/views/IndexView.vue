<script setup lang="ts">

    import { useRouter } from 'vue-router'

    const router = useRouter()

    async function redirectToLogin() {

        await router.push( {name: 'login'} )

    }

</script>
<template>
    <div class="relative p-4">
    <button v-on:click="redirectToLogin" class="flex text-white cursor-pointer bg-blue-500 rounded-xl p-2 hover:bg-blue-600">Get started</button>
    </div>
</template>