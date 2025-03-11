<template>
    <div>
      <h1 class="text-xl font-bold mb-4">📖  {{ note.title }}</h1>
      <div v-if="note">
        <p class="mt-2" style="white-space: pre-wrap;">{{ note.content }}</p>
        <img v-if="note.image" :src="note.image" alt="노트 이미지" class="note-imgae" />
      </div>
      <div v-else>
        <p>노트를 찾을 수 없습니다.</p>
      </div>
      <button
        @click="deleteNote"
        class="delete-button">
          <img src="@/assets/img/trash-icon.png" alt="삭제">
      </button>
    </div>
    <div>
      <button
        @click="goToConfirmNote(noteId)"
        class="edit-button">
        <PencilIcon class="w-4 h-4 mr-1" /> 수정
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  
  const route = useRoute();
  const router = useRouter();
  const store = useStore();

  // 현재 노트 id 파라미터에서 가져오기
  const noteId = route.params.noteId as string;
  
  // Vuex getter를 사용하여 노트 정보 가져오기
  const note = computed(() => store.getters.getNoteById(noteId));

  // 노트 삭제
  const deleteNote = () => {
    if (confirm('정말로 이 노트를 삭제하시겠습니까?')){
      console.log(noteId)
      router.push({name: 'home'}).then(() => {
        store.dispatch('deleteNote',{id: noteId});
      });
    }
  }

  const goToConfirmNote = (id:string) => {
    router.push(`/confirm/${id}`);
  }
  </script>

<style scoped>
.delete-button {
  background-color: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  margin: 0 auto; /* 버튼 자체를 중앙에 배치 */ 
}

.delete-button:hover {
  transform: scale(1.5);
}

.delete-button img {
  width: 40px; /* 이미지 크기 */
  height: 40px;
}

.edit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  color: #fff;
  background-color: #42b983;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #47bb8b;
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

</style>
  