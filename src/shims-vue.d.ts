// *.vue 확장자를 가진 모든 파일을 모듈로 선언
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }