import { defineStore } from 'pinia'
import { ref } from 'vue'
import { store as apiStore, index as apiIndex } from '../api/comment'
import { type Comment } from '../types/comment'

export const useCommentStore = defineStore('comment', () => {

    const comment = ref<Comment>()
    const comments = ref<Comment[]>([])


    async function store(body: string, id: number) {

        comment.value = await apiStore(body, id)

    }

    async function index(id: number) {

        comments.value = await apiIndex(id)

    }

    return { comment, comments, store, index }

})