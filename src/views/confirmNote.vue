<template>
    <div class="edit-note">
      <h1 class="text-2xl font-bold mb-4">✏️ 노트 수정</h1>
      <form @submit.prevent="saveNote" class="space-y-4">
        <div class="form-group">
          <label for="title" class="input-text">제목</label>
          <input 
            type="text" 
            id="title"
            v-model="title"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="노트 제목을 입력하세요"
            required
          />
        </div>
        <div class="form-group">
          <label for="content" class="input-text">내용</label>
          <textarea 
            id="content"
            v-model="content"
            rows="10"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="노트 내용을 입력하세요"
            required
            style="white-space: pre-wrap;"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="image" class="input-text">이미지 업로드</label>
          <div class="upload-container">
          <input 
            type="file" 
            ref="fileInput"
            @change="handleFileChange" 
            accept="image/*" 
            class="file-input"
          />
          </div>
        </div>
  
        <!-- 이미지 미리보기 -->
        <div v-if="previewImage" class="preview-container">
          <img :src="previewImage" class="preview-image" />
          <button @click="removePreviewImage" class="remove-btn">취소</button>
        </div>
  
        <div class="flex space-x-3">
          <button 
            type="submit" 
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            저장하기
          </button>
          
          <button 
            type="button" 
            @click="goBack" 
            class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            취소
          </button>
        </div>
      </form>
    </div>
</template>

<script setup lang="ts">
  import { ref,computed,onMounted,Ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import html2canvas from 'html2canvas';


  const route = useRoute();
  const router = useRouter();
  const store = useStore();

  // 현재 노트 ID 파라미터에서 가져오기
  const noteId = route.params.noteId;

  // 노트 정보 가져오기
  const note = computed(() => store.getters.getNoteById(noteId));

  // 수정할 내용을 저장할 변수
  const title = ref('')
  const content = ref('')
  const fileInput: Ref<HTMLInputElement | null> = ref(null);
  const selectedFile: Ref<File | null> = ref(null);
  const previewImage: Ref<string | null> = ref(null);
  const uploadedImageData: Ref<string | null> = ref(null); // 업로드된 이미지 데이터를 저장할 ref

  // 컴포넌트 마운트 시 현재 노트 정보 불러오기
  onMounted(() => {
    if (note.value) {
      title.value = note.value.title;
      content.value = note.value.content;
      uploadedImageData.value = note.value.image; // note.uploadedImageData가 아닌 note.image를 사용
      previewImage.value = note.value.image; // 이미지가 있다면 미리보기도 설정
      console.log('노트 로드 완료:', note.value);
    } else {
      console.error('노트를 찾을 수 없음:', noteId);
      goBack(); // 노트가 없으면 뒤로 가기
    }
  });

  // 노트 저장
  const saveNote = async() => {
    if (title.value.trim() && content.value.trim()) {
      const thumbnail = await generateThumbnail();
      console.log('생성된 썸네일:', thumbnail ? '있음' : '없음');
      console.log(thumbnail)
      const noteData = {
        id: noteId,
        title: title.value,
        content: content.value,
        // 이미지 데이터가 있으면 포함, 없으면 null
        image: uploadedImageData.value,
        thumbnail: thumbnail
      }

      // Vuex 액션 "addNote"를 사용하여 노트 저장
      store.dispatch('updateNote', noteData);
      
      // 저장 후 홈으로 이동
      router.push('/');
      
      // 성공 메시지 (필요시 토스트나 알림 구현)
      console.log('노트가 저장되었습니다.');
    }
  }

  // 파일 선택시 처리
  const handleFileChange = (event: Event) => {
    // input[type="file"]의 files 속성에서 첫 번째 파일(선택한 파일) 가져오기
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if(!file) return

    // 선택한 파일을 ref 변수에 저장 (나중에 업로드할 때 사용)
    selectedFile.value = file

    // 이미지 미리보기 생성
    const reader = new FileReader()
    reader.onload = (e:ProgressEvent<FileReader>) => {
      const base64Image = e.target?.result as string; 
      
      // 미리보기 및 저장요 데이터
      previewImage.value = base64Image;

      // 이미지 데이터 생성 및 저장 (노트 저장 시 사용될 데이터)
      uploadedImageData.value = base64Image;
    }

    // 파일을 Base64 문자열로 읽기
    reader.readAsDataURL(file)
  }

  // 썸네일 생성
  const generateThumbnail = async() => {
    console.log('썸네일 생성 시작');
    if (content.value.trim() === '' && !uploadedImageData.value){
      console.log('내용이 없어서 썸네일 생성 X');
      return null;
    }

    // 썸네일을 위한 임시 요소 생성
    const thumbnailElement = document.createElement('div');

    // 썸네일 컨테이너의 스타일 설정
    thumbnailElement.style.width = '300px';
    thumbnailElement.style.height = '200px';
    thumbnailElement.style.padding = '10px';
    thumbnailElement.style.backgroundColor = '#ffffff';
    thumbnailElement.style.position = 'fixed'; // absolute 대신 fixed 사용
    thumbnailElement.style.left = '0';
    thumbnailElement.style.top = '0';
    thumbnailElement.style.zIndex = '-1000'; // 화면에 보이지 않게 설정
    thumbnailElement.style.fontFamily = 'Arial, sans-serif';
    thumbnailElement.style.overflow = 'hidden';
    
    console.log('임시 요소 생성됨');

    // 내용 추가
    if (content.value.trim() !== '') {
      // 미리보기용 div 생성
      const contentPreview = document.createElement('div');
      // 텍스트 내용 설정 (100자 제한, 넘어갈 경우 '...' 추가)
      contentPreview.textContent = content.value.substring(0, 100) + (content.value.length > 100 ? '...' : '');
      // 내용 미리보기 스타일 설정
      contentPreview.style.fontSize = '14px';
      contentPreview.style.color = '#333';
      contentPreview.style.marginBottom = '10px';
      contentPreview.style.maxHeight = '100px';
      contentPreview.style.overflow = 'hidden';
      thumbnailElement.appendChild(contentPreview);
      console.log('텍스트 내용 추가됨');
    }
  
    // 업로드된 이미지가 있으면 추가
    if (uploadedImageData.value) {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // CORS 이슈 해결을 위해
      img.src = uploadedImageData.value;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '120px';
      img.style.objectFit = 'cover';
      thumbnailElement.appendChild(img);
      console.log('이미지 추가됨');
      
      // 이미지 로드 완료 대기
      await new Promise((resolve) => {
        img.onload = resolve;
        // 5초 후에도 로드되지 않으면 계속 진행
        setTimeout(resolve, 5000);
      });
      console.log('이미지 로드 완료');
    }
  
    // 임시 요소를 DOM에 추가
    document.body.appendChild(thumbnailElement);
    console.log('DOM에 요소 추가됨');
  
    try {
      // DOM에 추가
      document.body.appendChild(thumbnailElement);

      // html2canvas로 요소 캡처 전에 약간의 지연 추가
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // html2canvas로 요소 캡처
      console.log('html2canvas 호출 시작');
      const canvas = await html2canvas(thumbnailElement, { 
        scale: 1,
        useCORS: true,
        logging: false
      });
      if(canvas){console.log('html2canvas 캡처 완료');}
      else{console.log("캡쳐 실패")}
      
      // 임시 요소 제거
      document.body.removeChild(thumbnailElement);
      
      // 캔버스를 썸네일 크기로 조정
      const thumbnailCanvas = document.createElement('canvas');
      const ctx = thumbnailCanvas.getContext('2d');
      thumbnailCanvas.width = 100;
      thumbnailCanvas.height = 100;
      
      if(!ctx){
        console.error('2D 컨텍스트를 가져올 수 없습니다.');
        return null;
      }

      // 원본 캔버스의 비율을 유지하면서 썸네일로 변환
      ctx.drawImage(
        canvas,
        0, 0, canvas.width, canvas.height,
        0, 0, 100, 100
      );
      
      // base64 문자열로 변환 (품질 조정으로 파일 크기 최적화)
      const thumbnail = thumbnailCanvas.toDataURL('image/jpeg', 0.5);
      console.log('썸네일 생성 완료:', thumbnail.substring(0, 30) + '...');
      console.log(thumbnail)
      return thumbnail;
    } catch (err : unknown) {
      if(err instanceof Error){
        console.error('썸네일 생성 오류:', err);
        // 오류 상세 정보 출력
        console.error('오류 세부 정보:', err.message, err.stack);
      }else{
        console.error('알 수 없는 에러')
      }
      return null;
    } finally {
      // 혹시 요소가 남아있으면 제거
      if (document.body.contains(thumbnailElement)) {
        document.body.removeChild(thumbnailElement);
      }
    }
  };

  const removePreviewImage =() => {
    // 미리보기 이미지 상태 초기화
    previewImage.value = null;
    
    // 업로드된 이미지 데이터 초기화
    uploadedImageData.value = null;
    
    // 선택된 파일 초기화
    selectedFile.value = null;
    
    // 파일 입력 필드 초기화 (사용자가 같은 파일을 다시 선택할 수 있도록)
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }

  const goBack = () => {
  router.push('/');
}

</script>

<style scoped> /** 현재 컴포넌트에만 스타일 적용  */
.input-text {
  display: block; /** 블록 요소로 표시 */
  font-size: 0.875rem;
  font-weight: 500; /**폰트 두께 */
  color: #4b5563;
}

.edit-note {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/** 모든 input과 textarea 요소에 적용되는 CSS 선택자 */
input, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.preview-container {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.preview-image {
  max-width: 300px;
  max-height: 200px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

</style>