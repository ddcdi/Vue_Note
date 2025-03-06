<template>
  <div class="home">
    <h1 class="noteApp">노트 앱</h1>

    <div class="tools">
      <div class="rowBoxRight">
        <button @click="goToNewNote" class="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
          <PlusIcon class="w-6 h-6"/>
        </button>
      </div>
    </div>

    <div class="myNote">
      <h1 class="text-xl font-bold mb-4">📒 노트 목록</h1>
      <ul>
        <li v-for="note in notes" :key="note.id" class="flex items-center justify-between border-b py-2">
          <span>{{ note.title }}</span>
          <button 
            @click="goToReadNote(note.id)" 
            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            보기
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { PlusIcon } from '@heroicons/vue/24/solid'

const router = useRouter()

const notes = ref([
  { id: 1, title: '첫 번째 노트' },
  { id: 2, title: '두 번째 노트' },
  { id: 3, title: '세 번째 노트' }
])

const goToNewNote = () => {
  router.push('/newNote')
}

const goToReadNote = (id) => {
  router.push({ name: 'ReadNote', params: { noteId: id } })
}
</script>
