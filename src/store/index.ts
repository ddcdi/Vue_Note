import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import {v4 as uuidv4} from 'uuid';

interface Note {
    id: string;
    title: string;
    content: string;
    image: string | null; // 여기에 Base64 문자열이 저장
    thumbnail: string;
    createAt: string | null;
}

interface State {
    notes: Note[];
    nextId: number;
}

export default createStore<State>({
    state: {
        notes: [
            { id: '1', title: '첫 번째 노트', content: '첫 번째 내용',image: null,thumbnail: '첫',createAt: null},
            { id: '2', title: '두 번째 노트', content: '두 번째 내용',image: null,thumbnail: '두',createAt: null},
            { id: '3', title: '세 번째 노트', content: '세 번째 내용',image: null,thumbnail: '세',createAt: null}
        ],
        nextId: 4
    },

    getters: {
        // 모든 노트 가져오기 (노트 목록에 보내는 용)
        allNotes: (state) => {
            return state.notes
        },
        // ID로 단일 노트 가져오기
        getNoteById: (state) => (id: string): Note | undefined => {
            console.log('비교 중:', id);
            return state.notes.find(note => note.id === id);
        }
    },

    mutations: {
        // 노트 추가
        ADD_NOTE(state,{title, content, image, thumbnail}){
            const newNote = {
                id: uuidv4(), // 고유 ID
                title,
                content,
                image,
                thumbnail,
                createAt: new Date().toISOString()
            };
            state.notes.push(newNote);
            state.nextId++
        },

        // 노트 수정
        UPDATE_NOTE(state,{id,title,content,image,thumbnail}){
            // 해당 id를 가진 노드 객체 찾고 ===을 통해 정적 할당
            const note = state.notes.find(note => note.id === id); // parseInt()를 사용해 id를 정수로 변화하여 타입 불일치 방지

            if (note){
                note.title = title;
                note.content = content;
                note.image = image;
                note.thumbnail = thumbnail;
            }
        },

        // 노트 삭제
        DELETE_NOTE(state,{id}){
            // 해당 id를 가진 노드 객체의 인덱스를 찾기
            const index = state.notes.findIndex(note => note.id === id);
            if (index !== -1){
                state.notes.splice(index,1) // index 부터 1개 삭제
            }
        }

    },
    
    actions: {
        // 노드 추가 액션
        addNote({ commit },{title,content,image,thumbnail}){
            commit('ADD_NOTE', {title,content,image,thumbnail});
            console.log('저장할 이미지:', image)
            console.log('썸넹일 이미지',thumbnail)
            return this.state.nextId -1; // 추가된 노트의 id 반환
        },
        
        // 노드 수정 액션
        updateNote({commit},{id,title,content,image,thumbnail}){
            commit('UPDATE_NOTE',{id,title,content,image,thumbnail});
        },

        // 노드 삭제 액션
        deleteNote({commit},{id}){
            commit('DELETE_NOTE',{id});
        }
    },
    plugins: [
        createPersistedState({
          key: 'notes-app', // localStorage에 저장될 키 이름
          paths: ['notes', 'nextId'] // 저장할 상태 경로
        })
      ]
})