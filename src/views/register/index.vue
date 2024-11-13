<script setup>
import { ref, reactive } from 'vue';
import { NTabs, NTabPane, NForm, NFormItem, NInput, NButton, NIcon, useMessage } from 'naive-ui';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { ErrorCircle16Filled } from '@vicons/fluent';
import { useRouter } from 'vue-router'
import LoadingOverlay from '@/components/LoadingOverlay.vue'; // 引入遮罩组件

const router = useRouter()
const message = useMessage();
const { t } = useI18n();
const formData = reactive({
  email: '',
  password: '',
  inviteCode: '',
  verifyCode: '', // 邮箱验证码
});
const step = ref(1);
const verifyCodeKey = ref(''); // 验证码Key
const isLoading = ref(false); // 控制遮罩显示状态

const checkEmailAndSendCode = async () => {
  // 校验邮箱格式
  if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
    message.error('请输入有效的邮箱地址');
    return;
  }
  isLoading.value = true; // 显示遮罩层
  try {
    // 发送请求校验邮箱是否已注册
    const checkEmailResponse = await axios.get(
        `https://test.keepbit.top/app_api/v1/User/CheckEmailRegistered?email=${encodeURIComponent(formData.email)}`
    );

    if (checkEmailResponse.data.Success && !checkEmailResponse.data.ResData.IsRegistered) {
      // 如果邮箱未注册，则发送验证码
      const sendCodeResponse = await axios.get(
          `https://test.keepbit.top/app_api/v1/Utils/SendCodeByEmailAnonymous?type=1&email=${encodeURIComponent(
              formData.email
          )}`
      );

      if (sendCodeResponse.data.Success) {
        message.success('验证码已发送至您的邮箱');
        step.value = 2; // 进入验证码和密码输入步骤
        verifyCodeKey.value = sendCodeResponse.data.ResData; // 保存验证码Key
      } else {
        message.error(sendCodeResponse.data.ErrMsg);
      }
    } else {
      message.error(checkEmailResponse.data.ErrMsg);
    }
  } catch (error) {
    message.error('请求出错，请稍后重试');
  } finally {
    isLoading.value = false; // 隐藏遮罩层
  }
};

const register = async () => {
  // 校验密码格式
  if (!/^(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,32}$/.test(formData.password)) {
    message.error('密码格式不正确');
    return;
  }

  // MD5加密密码
  const encryptedPassword = CryptoJS.MD5(formData.password).toString();

  // 构造请求参数
  const payload = {
    auth_type: 2,
    Account: formData.email,
    Password: encryptedPassword, // 使用加密后的密码
    VerifyCode: formData.verifyCode,
    VerifyCodeKey: verifyCodeKey.value, // 使用获取验证码时的 VerifyCodeKey
    InviteCode: formData.inviteCode,
  };
  isLoading.value = true; // 显示遮罩层
  try {
    // 发送注册请求
    const response = await axios.post('https://test.keepbit.top/app_api/v1/Register/Register', payload);

    if (response.data.Success) {
      message.success('注册成功');
      await router.push('/login')// 跳转到登录页面
    } else {
      message.error(response.data.ErrMsg || '注册失败');
    }
  } catch (error) {
    message.error('请求出错，请稍后重试');
  } finally {
    isLoading.value = false; // 隐藏遮罩层
  }
};
</script>

<template>
  <!-- 只在请求时显示遮罩 -->
  <LoadingOverlay v-model="isLoading" />

  <div class="lg:flex lg:h-[calc(100%-75px)]">
    <div class="hidden lg:block flex-1 bg-black flex-col relative text-white font-bold text-[60px]">
      <div class="absolute left-0 w-full top-[10%] text-center">{{ t('register.welcome[0]') }}</div>
      <img class="w-full" src="/register_bg.png" />
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
                  {{ t('register.announce') }}<span class="text-[#76e43b]">{{ t('register.according[0]') }}</span
                ><span class="text-[#76e43b]">{{ t('register.according[1]') }}</span>
                </div>
              </template>
              <template v-else>
                <NForm :modelValue="formData">
                  <NFormItem label="验证码" class="text-4xl">
                    <NInput v-model:value="formData.verifyCode" placeholder="请输入验证码" />
                  </NFormItem>
                  <NFormItem label="密码">
                    <NInput v-model:value="formData.password" placeholder="请输入密码" />
                  </NFormItem>
                </NForm>
                <div v-if="!/^.{8,32}$/.test(formData.password)" class="flex items-center gap-x-2">
                  <NIcon class="text-xl text-red-500">
                    <ErrorCircle16Filled />
                  </NIcon>
                  长度为8-32个字符
                </div>
                <div v-if="!/.*[a-z].*/.test(formData.password)" class="flex items-center gap-x-2">
                  <NIcon class="text-xl text-red-500">
                    <ErrorCircle16Filled />
                  </NIcon>
                  1个小写字母(a-z)
                </div>
                <div v-if="!/.*\d.*/.test(formData.password)" class="flex items-center gap-x-2">
                  <NIcon class="text-xl text-red-500">
                    <ErrorCircle16Filled />
                  </NIcon>
                  1个数字
                </div>
                <div v-if="!/.*[^\w\s].*/.test(formData.password)" class="flex items-center gap-x-2">
                  <NIcon class="text-xl text-red-500">
                    <ErrorCircle16Filled />
                  </NIcon>
                  1个符号(如!@#$%^&*)
                </div>
                <NButton class="bg-[#76e43b] rounded-lg w-full h-12 text-lg font-bold" @click="register">{{
                    t('register.title')
                  }}</NButton>
                <div class="text-center">
                  {{ t('register.announce') }}<span class="text-[#76e43b]">{{ t('register.according[0]') }}</span
                ><span class="text-[#76e43b]">{{ t('register.according[1]') }}</span>
                </div>
              </template>
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
