<template>
  <nav> <!-- 웹사이트의 네비게이션 영역 -->
    <router-link to="/">이관형의 노트</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  /**스크롤을 내려도 네비게이션 바가 항상 top0에 고정 */
  position: sticky; /**일반 흐름에 따라 배치되다가 스크롤이 특정 임계점에 도달하면 fixed처럼 동작 */
  top: 0;
  background-color: white;
  z-index: 100; /**다른 요소들 위에 표시 */
}

/**네비게이션 내의 모든 링크(<a>, <router-rink>)에 적용 */
nav a {
  font-weight: bold;
  color: #42b983;
  font-size: 1.5rem; /**글꼴 크기를 루트 글꼴 크기의 1.5배로 설정 */
  text-decoration: none; /**밑줄 제거 */
  padding: 5px 15px; /* 상하 5px, 좌우 15px의 패딩을 추가 */
  border-radius: 4px; /* 모서리를 둥글게 만듬 */
  transition: background-color 0.3s, color 0.3s; /**호버 효과를 위한 부드러운 전환 효과 */
}

nav a:hover {
background-color: #eaeaea;
}

/**현재 활성화된 라우터와 정확하게 일치하는 링크에 적용되는 스타일 */
nav a.router-link-exact-active {
  color: #42b983;
}
</style>
