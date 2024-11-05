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
      ],
    },
  ],
})
