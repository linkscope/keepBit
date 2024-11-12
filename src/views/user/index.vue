<script setup>
import { useMessage } from 'naive-ui'

const message = useMessage()
const router = useRouter()
const userInfo = ref(null)

onMounted(async () => {
  // const token = localStorage.getItem('accessToken')
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzeXN0ZW0iLCJpc3MiOiJLZWVwQml0VGVhY2giLCJVc2VyTmFtZSI6IjM3OTY5NjY3IiwiVXNlcklkIjoiMTg0MzIyNzc1OTcxMjY3MjYiLCJUZW5hbnRJZCI6IjkyNDI3NzIxMjk1NzkwNzciLCJzdWIiOiJwYXNzd29yZCIsIm5iZiI6MTczMTQzNDk0NywiZXhwIjoxNzMxNTIxMzQ3LCJpYXQiOjE3MzE0MzQ5NDd9.p4nGVVmx9iQgB1mUjKvg9ZPfMz8ssNtyk7KiRjbJUog'
  // if (!token) {
  //   message.warning('请先登录')
  //   router.push('/login')
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
  <div class="lg:w-[1200px] mx-4 lg:mx-auto my-8 space-y-4">
    <div class="border border-slate-200 rounded-xl p-8 space-y-4">
      <div class="text-2xl font-bold">基本信息</div>
      <div class="flex items-center gap-x-4">
        <img class="size-[68px] rounded-full" :src="userInfo?.ProfileUrl" />
        <div>
          <div class="text-sm text-slate-500">昵称</div>
          <div class="text-2xl">{{ userInfo?.Nickname }}</div>
        </div>
      </div>
      <div class="flex flex-col gap-y-4 lg:flex-row lg:items-center justify-around">
        <div>
          <div class="text-slate-500 text-sm">UID</div>
          <div class="text-base">{{ userInfo?.Uid }}</div>
        </div>
        <div>
          <div class="text-slate-500 text-sm">用户VIP等级</div>
          <div class="text-base">VIP.0</div>
        </div>
        <div>
          <div class="text-slate-500 text-sm">邮箱</div>
          <div class="text-base">{{ userInfo?.email }}</div>
        </div>
        <div>
          <div class="text-slate-500 text-sm">手机</div>
          <div class="text-base">{{ userInfo?.mobile || '-' }}</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="flex-1 border border-slate-200 p-4 flex items-center justify-between rounded-xl">
        <div class="space-y-2">
          <div class="text-2xl font-bold">身份认证</div>
          <div class="text-sm text-slate-500 h-10">以个人身份进行交易，提供个人信息</div>
          <div class="text-green-500">去认证-></div>
        </div>
        <img class="size-[80px]" src="/authorization.png" />
      </div>
      <div class="flex-1 border border-slate-200 p-4 flex items-center justify-between rounded-xl">
        <div class="space-y-2">
          <div class="text-2xl font-bold">安全管理</div>
          <div class="text-sm text-slate-500 h-10">帮助您提供账户安全的功能设置</div>
          <div class="text-green-500">去设置-></div>
        </div>
        <img class="size-[80px]" src="/security.png" />
      </div>
    </div>
  </div>
</template>
