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
      <router-link to="/login">
        <NButton size="large" class="bg-white rounded-md">{{ t('login.title') }}</NButton>
      </router-link>
      <router-link to="register">
        <NButton text>{{ t('register.title') }}</NButton>
      </router-link>
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
      <div class="h-full overflow-hidden flex flex-col gap-y-8 p-4">
        <router-link to="/login">
          <NButton size="large" type="primary" class="rounded-md">{{ t('login.title') }}</NButton>
        </router-link>
        <router-link to="register">
          <NButton text>{{ t('register.title') }}</NButton>
        </router-link>
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
