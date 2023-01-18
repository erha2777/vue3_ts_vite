import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
// import {  createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import PlayList from '../views/PlayList.vue'
import SearchResult from '../views/SearchResult.vue'
import PersonalFm from '../views/PersonalFm.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/palyList/:id',
        name: 'palyList',
        component: PlayList,
    },
    {
        path: '/searchResult/:keyword',
        name: 'searchResult',
        component: SearchResult,
    },
    {
        path: '/personalFm/',
        name: 'personalFm',
        component: PersonalFm,
    },
]

const router = createRouter({
    //   history: createWebHistory(process.env.BASE_URL), // history模式
    history: createWebHashHistory(), // hash模式
    routes,
})

export default router
