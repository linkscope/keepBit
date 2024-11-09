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
          path: 'trading',
          name: 'Trading',
          component: () => import('@/views/trading/index.vue'),
        },
        {
          path: 'market',
          name: 'Market',
          component: () => import('@/views/market/index.vue'),
        },
        {
          path: 'strategy',
          name: 'Strategy',
          component: () => import('@/views/strategy/index.vue'),
        },
        {
          path: 'deal',
          name: 'Deal',
          component: () => import('@/views/deal/index.vue'),
        },
        {
          path: 'dealContracts',
          name: 'DealContracts',
          component: () => import('@/views/dealContracts/index.vue'),
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
