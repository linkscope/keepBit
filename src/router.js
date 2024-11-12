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
        {
          path: 'download',
          name: 'Download',
          component: () => import('@/views/download/index.vue'),
        },
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/views/login/index.vue'),
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('@/views/register/index.vue'),
        },
        {
          path: 'user',
          name: 'User',
          component: () => import('@/views/user/index.vue'),
        },
        {
          path: 'assets',
          name: 'Assets',
          component: () => import('@/views/assets/index.vue'),
        },
        {
          path: 'article/agreement',
          name: 'Agreement',
          component: () => import('@/views/article/agreement.vue'),
        },
        {
          path: 'article/serviceAgreement',
          name: 'ServiceAgreement',
          component: () => import('@/views/article/serviceAgreement.vue'),
        },
        {
          path: 'article/privacyPolicyIndex',
          name: 'PrivacyPolicyIndex',
          component: () => import('@/views/article/privacyPolicyIndex.vue'),
        },
        {
          path: 'article/disclaimer',
          name: 'Disclaimer',
          component: () => import('@/views/article/disclaimer.vue'),
        },
        {
          path: 'article/userBehaviorCode',
          name: 'UserBehaviorCode',
          component: () => import('@/views/article/userBehaviorCode.vue'),
        },
        {
          path: 'article/easyMoneyClause',
          name: 'EasyMoneyClause',
          component: () => import('@/views/article/easyMoneyClause.vue'),
        },
        {
          path: 'article/agencyPlan',
          name: 'AgencyPlan',
          component: () => import('@/views/article/agencyPlan.vue'),
        },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
