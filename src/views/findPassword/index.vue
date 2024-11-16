<template>
  <!-- 只在请求时显示遮罩 -->
  <LoadingOverlay v-model="isLoading" />

  <div class="lg:flex lg:h-[calc(100%-75px)]">
    <div class="hidden lg:flex flex-1 bg-black flex-col items-center relative text-white font-bold text-[60px]">
      <div class="absolute left-0 w-full top-[10%] text-center">{{ t('findPassword.welcome[0]') }}</div>
      <img class="h-full object-cover" src="/register_bg.png" />
    </div>
    <div class="flex-1 bg-white flex flex-col justify-center items-center">
      <div class="lg:w-[550px] space-y-8 m-4">
        <div class="text-4xl font-bold">{{ t('findPassword.title') }}</div>
        <NTabs
            size="large"
            animated
            pane-wrapper-style="margin: 0 -4px"
            pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
          <NTabPane name="email" :tab="t('findPassword.tabs[0]')">
            <div class="border-2 border-[#76E43B] p-4 px-10 lg:py-10 lg:px-16 rounded-xl space-y-4">
              <template v-if="step === 1">
                <NForm :modelValue="formData">
                  <NFormItem :label="t('findPassword.email.label[0]')" class="text-4xl">
                    <NInput v-model:value="formData.email" :placeholder="t('findPassword.email.placeholder[0]')" />
                  </NFormItem>
                </NForm>
                <NButton class="bg-[#76e43b] rounded-lg w-full h-12 text-lg font-bold" @click="checkEmailAndSendCode">{{
                    t('findPassword.title')
                  }}</NButton>
              </template>
              <template v-else>
                <NForm :modelValue="formData">
                  <NFormItem :label="t('findPassword.password.label')">
                    <NInput v-model:value="formData.password" :placeholder="t('findPassword.password.placeholder')" />
                  </NFormItem>
                  <!-- 密码校验 -->
                  <div v-for="(rule, index) in passwordRules" :key="index" class="flex items-center gap-x-2">
                    <NIcon :class="rule.valid(formData.password) ? 'text-xl text-green-500' : 'text-xl text-red-500'">
                      <CheckmarkCircle16Filled v-if="rule.valid(formData.password)" />
                      <ErrorCircle16Filled v-else />
                    </NIcon>
                    <span>{{ rule.text }}</span>
                  </div>
                  <NFormItem :label="t('findPassword.confirmPassword.label')">
                    <NInput v-model:value="formData.confirmPassword" :placeholder="t('findPassword.confirmPassword.placeholder')" />
                  </NFormItem>
                  <NFormItem :label="t('findPassword.verifyCode.label')" class="text-4xl">
                    <NInput v-model:value="formData.verifyCode" :placeholder="t('findPassword.verifyCode.placeholder')" />
                  </NFormItem>
                </NForm>
                <NButton class="bg-[#76e43b] rounded-lg w-full h-12 text-lg font-bold" @click="findPassword">{{
                    t('findPassword.title')
                  }}</NButton>
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
  confirmPassword: ''
})
const step = ref(1)
const verifyCodeKey = ref('')
const isLoading = ref(false)

const passwordRules = [
  {
    valid: (password) => /^(?=.*[a-z])/.test(password),
    text: t('findPassword.password.rule1'),
  },
  {
    valid: (password) => /.*\d.*/.test(password),
    text: t('findPassword.password.rule2'),
  },
  {
    valid: (password) => /.*[^\w\s].*/.test(password),
    text: t('findPassword.password.rule3'),
  },
  {
    valid: (password) => /^.{8,32}$/.test(password),
    text: t('findPassword.password.rule4'),
  },
]

const checkEmailAndSendCode = async () => {
  if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
    message.error(t('findPassword.email.invalid'))
    return
  }
  isLoading.value = true
  try {
    const checkEmailResponse = await axios.get(`https://test.keepbit.top/app_api/v1/User/CheckEmailRegistered?email=${encodeURIComponent(formData.email)}`)
    if (!checkEmailResponse.data.Success && checkEmailResponse.data.ErrCode === "1") {
      const sendCodeResponse = await axios.get(`https://test.keepbit.top/app_api/v1/Utils/SendCodeByEmailAnonymous?type=1&email=${encodeURIComponent(formData.email)}`)
      if (sendCodeResponse.data.Success) {
        message.success(t('findPassword.verifyCode.sent'))
        step.value = 2
        verifyCodeKey.value = sendCodeResponse.data.ResData
      } else {
        message.error(sendCodeResponse.data.ErrMsg)
      }
    } else {
      message.error("该邮箱未注册!")
    }
  } catch (error) {
    message.error(t('findPassword.error'))
  } finally {
    isLoading.value = false
  }
}

const findPassword = async () => {
  if (!/^(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,32}$/.test(formData.password)) {
    message.error(t('findPassword.password.invalid'))
    return
  }

  // 校验新密码与确认密码是否一致
  if (formData.password !== formData.confirmPassword) {
    message.error(t('findPassword.password.notMatch'))
    return
  }
  
  const encryptedPassword = CryptoJS.MD5(formData.password).toString()
  const payload = {
    Account: formData.email,
    NewPwd: encryptedPassword,
    VerifyCode: formData.verifyCode,
    VerifyCodeKey: verifyCodeKey.value,
    Type: 0
  }
  isLoading.value = true
  try {
    const response = await axios.post('https://test.keepbit.top/app_api/v1/User/ForgetPasswordReset', payload)
    if (response.data.Success) {
      message.success(t('findPassword.success'))
      await router.push('/login')
    } else {
      message.error(response.data.ErrMsg || t('findPassword.error'))
    }
  } catch (error) {
    message.error(t('findPassword.error'))
  } finally {
    isLoading.value = false
  }
}

const goToPage = (link) => {
  if (link === 'link1') {
    router.push('/article/agreement') // Replace with your actual route for link1
  } else if (link === 'link2') {
    router.push('/article/privacyPolicyIndex') // Replace with your actual route for link2
  }
}
</script>
