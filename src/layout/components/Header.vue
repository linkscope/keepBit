<script setup>
import { NMenu, NButton, NIcon, NDropdown, NDrawer } from 'naive-ui'
import { Earth16Regular, ArrowDownload16Regular, List16Regular } from '@vicons/fluent'
import { loadLanguageAsync } from '@/i18n'
import { languageList } from './model.js'

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()
const drawerModal = ref(false)

const handleSelectLocale = async (lang) => {
  await loadLanguageAsync(lang)
  localStorage.setItem('keepBit_lang', lang)
  locale.value = lang
}

const menuList = computed(() => [
  {
    label: t('header.menuList.home'),
    key: '/',
  },
  {
    label: t('header.menuList.market'),
    key: '/market',
  },
  {
    label: t('header.menuList.trading'),
    key: '/trading',
  },
  {
    label: t('header.menuList.quantitative'),
    key: '/quantitative',
    children: [
      {
        label: t('header.menuList.strategy'),
        key: '/strategy',
      },
      {
        label: t('header.menuList.deal'),
        key: '/deal',
      },
      {
        label: t('header.menuList.dealContracts'),
        key: '/dealContracts',
      },
    ],
  },
  {
    label: t('header.menuList.explorationAndLearning'),
    key: '/explorationAndLearning',
    children: [
      // {
      //   label: t('header.menuList.announcementCenter'),
      //   key: '/announcementCenter',
      // },
      // {
      //   label: t('header.menuList.keepBitAcademy'),
      //   key: '/keepBitAcademy',
      // },
      // {
      //   label: t('header.menuList.kycCertificationArea'),
      //   key: '/kycCertificationArea',
      // },
      // {
      //   label: t('header.menuList.channelRecruitment'),
      //   key: '/channelRecruitment',
      // },
      {
        label: t('header.menuList.brokerCooperation'),
        key: '/article/agencyPlan',
      },
      // {
      //   label: t('header.menuList.inviteFriends'),
      //   key: '/inviteFriends',
      // },
      // {
      //   label: t('header.menuList.vipService'),
      //   key: '/vipService',
      // },
      {
        label: t('header.menuList.about'),
        key: '/about',
      },
    ],
  },
])
const userInfo = ref(null)

const handleUserOption = (key) => {
  if (key === 'logout') {
    localStorage.removeItem('accessToken')
    location.reload()
    return
  }
  router.push(key)
}

onMounted(async () => {
  // const token = localStorage.getItem('accessToken')
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzeXN0ZW0iLCJpc3MiOiJLZWVwQml0VGVhY2giLCJVc2VyTmFtZSI6IjM3OTY5NjY3IiwiVXNlcklkIjoiMTg0MzIyNzc1OTcxMjY3MjYiLCJUZW5hbnRJZCI6IjkyNDI3NzIxMjk1NzkwNzciLCJzdWIiOiJwYXNzd29yZCIsIm5iZiI6MTczMTQzNDk0NywiZXhwIjoxNzMxNTIxMzQ3LCJpYXQiOjE3MzE0MzQ5NDd9.p4nGVVmx9iQgB1mUjKvg9ZPfMz8ssNtyk7KiRjbJUog'
  // if (!token) {
  //   return
  // }
  const response = await fetch('https://test.keepbit.top/app_api/v1/User/GetMyInfo', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json()
  if (!data.Success) {
    message.error('获取用户信息失败，请刷新重试')
    return
  }

  userInfo.value = data.ResData
})
</script>

<template>
  <header class="sticky z-[99] top-0 hidden lg:flex p-4 bg-[#76e43b] items-center">
    <router-link to="/" class="flex items-center gap-x-4">
      <img class="size-10" src="/logo.png" />
      <span class="font-bold text-lg">KeepBit</span>
    </router-link>
    <NMenu
      class="ml-40 flex-1 text-base"
      mode="horizontal"
      :theme-overrides="{
        itemTextColorActiveHorizontal: 'white',
        itemTextColorHoverHorizontal: 'white',
      }"
      :default-value="route.path"
      responsive
      :options="menuList"
      @update:value="router.push($event)"
    />
    <div class="flex items-center gap-x-8">
      <template v-if="userInfo">
        <NDropdown
          trigger="hover"
          :options="[
            { label: '个人资料', key: '/user' },
            { label: '资产总览', key: '/assets' },
            { label: '退出登录', key: 'logout' },
          ]"
          @select="handleUserOption"
        >
          <img class="size-8 rounded-full" :src="userInfo.ProfileUrl" />
        </NDropdown>
      </template>
      <template v-else>
        <router-link to="/login">
          <NButton size="large" class="bg-white rounded-md">{{ t('login.title') }}</NButton>
        </router-link>
        <router-link to="register">
          <NButton text>{{ t('register.title') }}</NButton>
        </router-link>
      </template>
      <NButton text class="text-3xl" @click="router.push('/download')">
        <NIcon>
          <ArrowDownload16Regular />
        </NIcon>
      </NButton>
      <NDropdown trigger="hover" :options="languageList" @select="handleSelectLocale">
        <NButton text class="text-3xl">
          <NIcon>
            <Earth16Regular />
          </NIcon>
        </NButton>
      </NDropdown>
    </div>
  </header>

  <header class="sticky top-0 z-[99] flex items-center justify-between p-4 bg-[#76e43b] lg:hidden">
    <div class="flex items-center gap-x-4">
      <img class="size-10" src="/logo.png" />
      <span class="font-bold text-lg">KeepBit</span>
    </div>
    <div class="flex items-center gap-x-4">
      <NButton text class="text-3xl" @click="router.push('/download')">
        <NIcon>
          <ArrowDownload16Regular />
        </NIcon>
      </NButton>
      <NDropdown trigger="hover" :options="languageList" @select="handleSelectLocale">
        <NButton text class="text-3xl">
          <NIcon>
            <Earth16Regular />
          </NIcon>
        </NButton>
      </NDropdown>
      <NButton text class="text-3xl" @click="drawerModal = true">
        <NIcon>
          <List16Regular />
        </NIcon>
      </NButton>
    </div>
    <NDrawer v-model:show="drawerModal" placement="right" :width="300">
      <div class="h-full overflow-hidden flex flex-col gap-y-4 p-4">
        <template v-if="userInfo">
          <div class="mx-auto">
            <img class="size-8 rounded-full" :src="userInfo.ProfileUrl" />
          </div>
          <NButton size="large" type="primary" class="rounded-md" @click="router.push('/user')">个人资料</NButton>
          <NButton size="large" @click="router.push('/assets')">资产总览</NButton>
          <NButton size="large" @click="handleUserOption('logout')">退出登录</NButton>
        </template>
        <template v-else>
          <NButton size="large" type="primary" class="rounded-md" @click="router.push('/login')">{{
            t('login.title')
          }}</NButton>
          <NButton size="large" @click="router.push('/register')">{{ t('register.title') }}</NButton>
        </template>
        <NMenu
          class="flex-1"
          :default-value="route.path"
          responsive
          :options="menuList"
          @update:value="router.push($event)"
        />
      </div>
    </NDrawer>
  </header>
</template>
