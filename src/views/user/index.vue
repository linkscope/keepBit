<script setup>
import { useMessage } from 'naive-ui'

const message = useMessage()
const router = useRouter()
const userInfo = ref(null)
const { t } = useI18n()
onMounted(async () => {
  const token = localStorage.getItem('accessToken')

  if (!token) {
    message.warning(t('user.pleaseLogin'))
    await router.push('/login')
    return
  }
  const response = await fetch('https://test.keepbit.top/app_api/v1/User/GetMyInfo', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json()
  if (!data.Success) {
    message.error(t('user.getUserInfoFail'))
      return
  }

  userInfo.value = data.ResData
})
</script>

<template>
  <div class="lg:w-[1200px] mx-4 lg:mx-auto my-8 space-y-4">
    <div class="border border-slate-200 rounded-xl p-8 space-y-4">
      <div class="text-2xl font-bold">{{ t('user.basicInfo') }}</div>  <!-- Updated for multi-language -->
      <div class="flex items-center gap-x-4">
        <img class="size-[68px] rounded-full" :src="userInfo?.ProfileUrl" />
        <div>
          <div class="text-sm text-slate-500">{{ t('user.nickname') }}</div>  <!-- Updated for multi-language -->
          <div class="text-2xl">{{ userInfo?.Nickname }}</div>
        </div>
      </div>
      <div class="flex flex-col gap-y-4 lg:flex-row lg:items-center justify-around">
        <div>
          <div class="text-slate-500 text-sm">{{ t('user.uid') }}</div>  <!-- Updated for multi-language -->
          <div class="text-base">{{ userInfo?.Uid }}</div>
        </div>
        <div>
          <div class="text-slate-500 text-sm">{{ t('user.vipLevel') }}</div>  <!-- Updated for multi-language -->
          <div class="text-base">VIP.0</div>
        </div>
        <div>
          <div class="text-slate-500 text-sm">{{ t('user.email') }}</div>  <!-- Updated for multi-language -->
          <div class="text-base">{{ userInfo?.email }}</div>
        </div>
        <div>
          <div class="text-slate-500 text-sm">{{ t('user.mobile') }}</div>  <!-- Updated for multi-language -->
          <div class="text-base">{{ userInfo?.mobile || '-' }}</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="flex-1 border border-slate-200 p-4 flex items-center justify-between rounded-xl">
        <div class="space-y-2">
          <div class="text-2xl font-bold">{{ t('user.identityVerification') }}</div>  <!-- Updated for multi-language -->
          <div class="text-sm text-slate-500 h-10">{{ t('user.identityDesc') }}</div>  <!-- Updated for multi-language -->
          <div class="text-green-500">{{ t('user.goVerify') }}</div>  <!-- Updated for multi-language -->
        </div>
        <img class="size-[80px]" src="/authorization.png" />
      </div>
      <div class="flex-1 border border-slate-200 p-4 flex items-center justify-between rounded-xl">
        <div class="space-y-2">
          <div class="text-2xl font-bold">{{ t('user.securityManagement') }}</div>  <!-- Updated for multi-language -->
          <div class="text-sm text-slate-500 h-10">{{ t('user.securityDesc') }}</div>  <!-- Updated for multi-language -->
          <div class="text-green-500">{{ t('user.goSettings') }}</div>  <!-- Updated for multi-language -->
        </div>
        <img class="size-[80px]" src="/security.png" />
      </div>
    </div>
  </div>
</template>
