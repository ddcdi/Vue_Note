<template>
    <div>
      <h1 class="text-xl font-bold mb-4">📖 노트 보기</h1>
      <div v-if="note">
        <h2 class="text-lg font-semibold">{{ note.title }}</h2>
        <p class="mt-2">{{ note.content }}</p>
      </div>
      <div v-else>
        <p>노트를 찾을 수 없습니다.</p>
      </div>
      <button 
        @click="goBack"
        class="mt-4 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
        뒤로가기
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  
  // 노트 데이터 예시 (실제로는 API 호출 필요)
  const notes = [
    { id: 1, title: '첫 번째 노트', content: '첫 번째 노트 내용입니다.' },
    { id: 2, title: '두 번째 노트', content: '두 번째 노트 내용입니다.' },
    { id: 3, title: '세 번째 노트', content: '세 번째 노트 내용입니다.' }
  ]
  
  const route = useRoute()
  const router = useRouter()
  const note = ref(null)
  
  onMounted(() => {
    const noteId = Number(route.params.noteId)
    note.value = notes.find(n => n.id === noteId)
  })
  
  const goBack = () => {
    router.push({ name: 'NoteList' })
  }
  </script>
  