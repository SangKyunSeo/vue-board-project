import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/MainHome.vue')
  },
  {
    path: '/writeBoard',
    name: 'WriteBoard',
    component: () => import(/* webpackChunkName: "about" */ '../views/WriteBoard.vue')
  },
  {
    path: '/freeBoard',
    name: 'FreeBoard',
    component: () => import(/* webpackChunkName: "about" */ '../views/FreeBoard.vue')
  },
  {
    path: '/anonyBoard',
    name: 'AnonyBoard',
    component: () => import(/* webpackChunkName: "about" */ '../views/AnonyBoard.vue')
  },
  {
    path: '/freeBoardDetail',
    name: 'FreeBoardDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/board/FreeBoardDetail.vue')
  },
  {
    path: '/anonyBoardDetail',
    name: 'AnonyBoardDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/board/AnonyBoardDetail.vue')
  },
  {
    path: '/search',
    name: 'SearchResult',
    component: () => import(/* webpackChunkName: "about" */ '../views/search/SearchResult.vue')
  },
  {
    path: '/gameBoard',
    name: 'GameBoard',
    component: () => import(/* webpackChunkName: "about" */ '../views/board/GameBoardMain.vue')
  },
  {
    path: '/myPage',
    name: 'MyPage',
    component: () => import(/* webpackChunkName: "about" */ '../views/myPage/MyPageMain.vue')
  }
]
  
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
