<template>
  <!-- 只在请求时显示遮罩 -->
  <LoadingOverlay v-model="isLoading" />

  <div class="lg:flex lg:h-[calc(100%-75px)]">
    <div class="hidden lg:flex flex-1 bg-black flex-col items-center relative text-white font-bold text-[60px]">
      <div class="absolute left-0 w-full top-[10%] text-center">{{ t('register.welcome[0]') }}</div>
      <img class="h-full object-cover" src="/register_bg.png" />
    </div>
    <div class="flex-1 bg-white flex flex-col justify-center items-center">
      <div class="lg:w-[550px] space-y-8 m-4">
        <div class="text-4xl font-bold">{{ t('register.title') }}</div>
        <NTabs
            size="large"
            animated
            pane-wrapper-style="margin: 0 -4px"
            pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
          <NTabPane name="email" :tab="t('register.tabs[0]')">
            <div class="border-2 border-[#76E43B] p-4 px-10 lg:py-10 lg:px-16 rounded-xl space-y-4">
              <template v-if="step === 1">
                <NForm :modelValue="formData">
                  <NFormItem :label="t('register.email.label[0]')" class="text-4xl">
                    <NInput v-model:value="formData.email" :placeholder="t('register.email.placeholder[0]')" />
                  </NFormItem>
                  <NFormItem :label="t('register.email.label[1]')">
                    <NInput v-model:value="formData.inviteCode" :placeholder="t('register.email.placeholder[1]')" />
                  </NFormItem>
                </NForm>
                <NButton class="bg-[#76e43b] rounded-lg w-full h-12 text-lg font-bold" @click="checkEmailAndSendCode">{{
                    t('register.title')
                  }}</NButton>
                <div class="text-center">
                  {{ t('register.announce') }}
                  <span class="text-[#76e43b]" @click="goToPage('link1')">{{ t('register.according[0]') }}</span>
                  <span class="text-[#76e43b]" @click="goToPage('link2')">{{ t('register.according[1]') }}</span>
                </div>
              </template>
              <template v-else>
                <NForm :modelValue="formData">
                  <NFormItem :label="t('register.verifyCode.label')" class="text-4xl">
                    <NInput v-model:value="formData.verifyCode" :placeholder="t('register.verifyCode.placeholder')" />
                  </NFormItem>
                  <NFormItem :label="t('register.password.label')">
                    <NInput v-model:value="formData.password" :placeholder="t('register.password.placeholder')" />
                  </NFormItem>
                </NForm>
                <!-- 密码校验 -->
                <div v-for="(rule, index) in passwordRules" :key="index" class="flex items-center gap-x-2">
                  <NIcon :class="rule.valid(formData.password) ? 'text-xl text-green-500' : 'text-xl text-red-500'">
                    <CheckmarkCircle16Filled v-if="rule.valid(formData.password)" />
                    <ErrorCircle16Filled v-else />
                  </NIcon>
                  <span>{{ rule.text }}</span>
                </div>
                <NButton class="bg-[#76e43b] rounded-lg w-full h-12 text-lg font-bold" @click="register">{{
                    t('register.title')
                  }}</NButton>
                <div class="text-center">
                  {{ t('register.announce') }}
                  <span class="text-[#76e43b]" @click="goToPage('link1')">{{ t('register.according[0]') }}</span>
                  <span class="text-[#76e43b]" @click="goToPage('link2')">{{ t('register.according[1]') }}</span>
                </div>
              </template>
            </div>
          </NTabPane>
        </NTabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { NTabs, NTabPane, NForm, NFormItem, NInput, NButton, NIcon, useMessage } from 'naive-ui'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import { ErrorCircle16Filled, CheckmarkCircle16Filled } from '@vicons/fluent'
import { useRouter } from 'vue-router'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

const router = useRouter()
const message = useMessage()
const { t } = useI18n()
const formData = reactive({
  email: '',
  password: '',
  inviteCode: '',
  verifyCode: '',
})
const step = ref(1)
const verifyCodeKey = ref('')
const isLoading = ref(false)

const passwordRules = [
  {
    valid: (password) => /^(?=.*[a-z])/.test(password),
    text: t('register.password.rule1'),
  },
  {
    valid: (password) => /.*\d.*/.test(password),
    text: t('register.password.rule2'),
  },
  {
    valid: (password) => /.*[^\w\s].*/.test(password),
    text: t('register.password.rule3'),
  },
  {
    valid: (password) => /^.{8,32}$/.test(password),
    text: t('register.password.rule4'),
  },
]

const checkEmailAndSendCode = async () => {
  if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
    message.error(t('register.email.invalid'))
    return
  }
  isLoading.value = true
  try {
    const checkEmailResponse = await axios.get(`https://test.keepbit.top/app_api/v1/User/CheckEmailRegistered?email=${encodeURIComponent(formData.email)}`)
    if (checkEmailResponse.data.Success && !checkEmailResponse.data.ResData.IsRegistered) {
      const sendCodeResponse = await axios.get(`https://test.keepbit.top/app_api/v1/Utils/SendCodeByEmailAnonymous?type=1&email=${encodeURIComponent(formData.email)}`)
      if (sendCodeResponse.data.Success) {
        message.success(t('register.verifyCode.sent'))
        step.value = 2
        verifyCodeKey.value = sendCodeResponse.data.ResData
      } else {
        message.error(sendCodeResponse.data.ErrMsg)
      }
    } else {
      message.error(checkEmailResponse.data.ErrMsg)
    }
  } catch (error) {
    message.error(t('register.error'))
  } finally {
    isLoading.value = false
  }
}

const register = async () => {
  if (!/^(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,32}$/.test(formData.password)) {
    message.error(t('register.password.invalid'))
    return
  }
  const encryptedPassword = CryptoJS.MD5(formData.password).toString()
  const payload = {
    auth_type: 2,
    Account: formData.email,
    Password: encryptedPassword,
    VerifyCode: formData.verifyCode,
    VerifyCodeKey: verifyCodeKey.value,
    InviteCode: formData.inviteCode,
  }
  isLoading.value = true
  try {
    const response = await axios.post('https://test.keepbit.top/app_api/v1/Register/Register', payload)
    if (response.data.Success) {
      message.success(t('register.success'))
      await router.push('/login')
    } else {
      message.error(response.data.ErrMsg || t('register.error'))
    }
  } catch (error) {
    message.error(t('register.error'))
  } finally {
    isLoading.value = false
  }
}
</script>
