import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import TodoList from '../views/TodoList.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'App',
      component: App
    },
    {
      path: '/todolist',
      name: 'TodoList',
      component: TodoList
    }
  ]
})

export default router