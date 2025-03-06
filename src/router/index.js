import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
  name: 'home',
      path: '/',
      component: ()=> import("@/views/HomeView.vue")
    },
    {
  name: 'newNote',
    path: '/newNote',  
    component: () => import("@/views/newNote.vue")
    },
    {
  name: 'readNote',
    path: '/readNote/note/:noteId',  
    component: () => import("@/views/readNote.vue")
    }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
