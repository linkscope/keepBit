<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NTabs, NTabPane, NForm, NFormItem, NInput, NButton, NDivider, useMessage } from 'naive-ui'
import axios from 'axios'
import md5 from 'crypto-js/md5'

const { t } = useI18n()
const router = useRouter()
const message = useMessage()
const formData = reactive({
  email: '',
  password: '',
})
const errorMessage = ref('') // 错误消息

const goToJoinPage = () => {
  router.push('/register') // Replace '/join' with the actual route you want to navigate to
}

// 登录方法
const handleLogin = async () => {
  try {
    const encryptedPassword = md5(formData.password).toString()
    const response = await axios.post('https://test.keepbit.top/app_api/v1/Login/UserLogin', {
      userName: formData.email,
      pwd: encryptedPassword,
    })

    if (response.data.Success) {
      message.success(t('message.loginSuccess'))
      // 将 AccessToken 存入本地存储
      localStorage.setItem('accessToken', response.data.ResData.AccessToken)
      await router.push('/') // 跳转到首页
      location.reload()
    } else {
      errorMessage.value = response.data.ErrMsg || '登录失败，请检查您的邮箱和密码'
    }
  } catch (error) {
    console.error('登录请求出错', error)
    errorMessage.value = '登录失败，请稍后再试'
  }
}
function handleForgetPassword() {
  // 跳转到忘记密码页面
  router.push('/findPassword');
}
</script>

<template>
  <div class="lg:flex lg:h-[calc(100%-75px)]">
    <div class="hidden lg:flex flex-1 bg-black flex-col items-center justify-center text-white font-bold text-[60px]">
      <div>{{ t('login.welcome[0]') }}</div>
      <div>{{ t('login.welcome[1]') }}</div>
      <div class="relative mt-16">
        <div class="hidden lg:block absolute left-0 top-0 size-full">
          <img class="w-full" src="/home_hero_bg.png" />
        </div>
        <img class="w-[500px]" src="/home_hero.png" />
      </div>
    </div>
    <div class="flex-1 bg-white flex flex-col justify-center items-center">
      <div class="lg:w-[550px] space-y-8 m-4">
        <div class="text-4xl font-bold">{{ t('login.title') }}</div>
        <NTabs size="large" animated>
          <NTabPane name="email" :tab="t('login.tabs[0]')">
            <div class="border-2 border-[#76E43B] p-4 px-10 lg:py-10 lg:px-16 rounded-xl space-y-4">
              <NForm :modelValue="formData">
                <NFormItem :label="t('login.email.label[0]')">
                  <NInput v-model:value="formData.email" :placeholder="t('login.email.placeholder[0]')" />
                </NFormItem>
                <NFormItem :label="t('login.email.label[1]')">
                  <NInput
                    type="password"
                    v-model:value="formData.password"
                    :placeholder="t('login.email.placeholder[1]')"
                  />
                </NFormItem>
                <!-- 错误信息 -->
                <div v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</div>
              </NForm>
              <div
                  class="text-right text-[#5bc17f] cursor-pointer"
                  @click="handleForgetPassword"
              >
                {{ t('login.forget') }}
              </div>
              <NButton class="bg-[#76e43b] rounded-lg w-full h-12 text-lg font-bold" @click="handleLogin">{{ t('login.title') }}</NButton>
              <NDivider class="text-sm text-slate-400">{{ t('login.other') }}</NDivider>
              <div class="flex items-center justify-center gap-x-4">
                <div class="p-2 rounded-full bg-green-400 border border-green-200 flex items-center justify-center">
                  <img class="size-8" src="/google.png" />
                </div>
                <div class="p-2 rounded-full bg-green-400 border border-green-200 flex items-center justify-center">
                  <img class="size-8" src="/apple.png" />
                </div>
                <div class="p-2 rounded-full bg-green-400 border border-green-200 flex items-center justify-center">
                  <img class="size-8" src="/telegram.svg" />
                </div>
                <div class="p-2 rounded-full bg-green-400 border border-green-200 flex items-center justify-center">
                  <img class="size-8" src="/facebook.svg" />
                </div>
              </div>
              <div class="text-center">
                {{ t('login.noAccount') }}<span class="text-[#76e43b]" @click="goToJoinPage">{{ t('login.join') }}</span>
              </div>
            </div>
          </NTabPane>
        </NTabs>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-form-item .n-form-item-label) {
  @apply text-base;
}
:deep(.n-input-wrapper) {
  @apply h-12 py-2 px-4;
}
:deep(.n-input__border) {
  @apply rounded-lg;
}
</style>
