<script setup lang="ts">

    import { useRouter } from 'vue-router'

    const router = useRouter()

    async function redirectToLogin() {

        await router.push( {name: 'login'} )

    }

</script>

<template>

    <div class="absolute inset-0 bg-everGreen text-white py-4">

        <!-- Header -->

        <div class="relative flex justify-center items-center border border-darkSpruce-darker p-2 rounded-xl mx-50">

            <p class="text-3xl font-mono">Ticketing System</p>

            <button v-on:click="redirectToLogin" class="relative ml-auto bg-darkSpruce rounded-xl p-2 hover:bg-darkSpruce-darker transition-bg duration-200">Get started</button>

        </div>

        <div class="mx-25">

            <!-- Divider -->

            <div class="relative flex items-center mt-10 gap-x-4">
                <div class="flex-1 h-px bg-darkSpruce-darker"></div>
                <p class="text-white">Tech Stack</p>
                <div class="flex-1 h-px bg-darkSpruce-darker"></div>
            </div>

                <p class="flex text-slate-500">* Hover over icons to see more details</p>

            <div class="relative mt-20 grid grid-cols-2 divide-x-2 divide-dashed divide-darkSpruce-darker border border-darkSpruce-darker rounded-xl">

                <div class="flex justify-center col-start-1">
                    Information
                </div>

                <div class="flex justify-center col-start-2">
                    Connect With Me

                </div>


            </div>

        </div>

    </div>
</template>