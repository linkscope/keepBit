import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/home/index.vue'),
        },
        {
          path: 'market',
          name: 'Market',
          component: () => import('@/views/market/index.vue'),
        },
        {
          path: 'about',
          name: 'About',
          component: () => import('@/views/about/index.vue'),
        },
      ],
    },
  ],
})
