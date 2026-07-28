<script setup lang="ts">

import { onMounted } from 'vue'
import api from './api/axios'

onMounted(() => {

  api.get('/user')
  .then(res => console.log('Success:', res.data))
  .catch(err => console.log('Status:', err.response?.status, err.message))


})

</script>

<template>
  <p>Initial Commit</p>
</template>

<style scoped></style>
