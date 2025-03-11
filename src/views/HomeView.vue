<template>
  <div class="home">
    <div class="tools">
      <div class="rowBoxRight">
        <button @click="goToNewNote" class="add-button p-2 rounded-full" 
        style="color: white;">
        <span style="font-size: 1rem; font-weight: bold; color: black;">+</span>
        </button>
      </div>
    </div>

    <div class="myNote">
      <h1 class="text-xl font-bold mb-4">📒 노트 목록</h1>
      <ul>
        <li v-for="note in notes" :key="note.id" class="content">
          <span class="noteTitle">{{ note.title }}</span>
          <div class="thumbnail-container">
            <img v-if="note.thumbnail" :src="note.thumbnail" :alt="note.title + ' 썸네일'" class="note-thumbnail">
            <div v-else class="default-thumbnail">
              {{ note.title ? note.title.charAt(0).toUpperCase() : 'N' }}
            </div>
          </div>
          <button
            @click="goToReadNote(note.id)"
            class="readButton">
            >
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";


const router = useRouter()
const store = useStore()
const notes = computed(() => store.getters.allNotes);

const goToNewNote = () => {
  router.push('/newNote')
}

const goToReadNote= (id: string) => {
  router.push({ name: 'readNote', params: { noteId: id } })
}

</script>

<style scoped>
.home {
  position: relative;
  padding: 20px;
}

/* 절대 위치 지정 */
.tools { 
  position: absolute; /* 요소를 문서의 일반 흐름에서 제거하고 가장 가까운 position이 지정된 부모 요소를 기준으로 배치 */
  top: 10px;  /* 상단에서 10px 떨어진 위치에 배치 */
  right: 20px; /**오른쪽에서 20px 떨어진 위치에 배치 */
  z-index: 10; /**다른 요소 위에 표시 */
}

/**Flex 레이아웃 */
.rowBoxRight {
  display: flex; /**Flex 레이아웃을 사용 */
  justify-content: flex-end; /**자식요소(버튼)을 컨테이너 오른쪽에 정렬 */
}

.add-button {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.myNote {
  margin-top: 50px; /**메인 콘텐츠 영역에 상단 여백주기 */
  left: 20px;
}

.content {
    display: flex; /**자식 요소들을 가로로 배치 */
    align-items: center; /**자식 요소들을 세로 중앙에 정렬 */
    border-bottom: 1px solid #e2e8f0; /**하단에 연한 회색 테두리 선 추가 */
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
.noteTitle {
  padding-left: 20px;
  margin-right: auto; /* 제목과 썸네일 사이 공간 확보 */
  order: 1; /* 제목이 첫 번째 */
}
  
.readButton {
  background-color: #42b983;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  transition: background-color 0.3s; /**배경색이 변할 때 부드럽게 전환 효과 */
  border: none; /**버튼 테두리 */
  order: 3; /* flex 아이템 순서 변경 */
}
  
.readButton:hover {
  background-color: #318761;
}

.thumbnail-container {
  margin-right: 10px; /* 썸네일과 버튼 사이 간격 */
  flex-shrink: 0;
  order: 2; /* 썸네일이 두 번째 */
}

.note-thumbnail {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eaeaea;
}

.default-thumbnail {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  color: #666;
  font-weight: bold;
  border-radius: 4px;
}
</style>