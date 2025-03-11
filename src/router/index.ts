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
    path: '/note/:noteId',  
    component: () => import("@/views/readNote.vue"),
    props: true
    },
    {
  name: 'confirmNote',
    path: '/confirm/:noteId',  
    component: () => import("@/views/confirmNote.vue"),
    props: true
    }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router
