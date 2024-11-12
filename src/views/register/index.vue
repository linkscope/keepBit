<script setup>
import { NTabs, NTabPane, NForm, NFormItem, NInput, NButton } from 'naive-ui'

const { t } = useI18n()
const formData = reactive({
  email: '',
  password: '',
})
</script>

<template>
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
              <NForm :modelValue="formData">
                <NFormItem :label="t('register.email.label[0]')" class="text-4xl">
                  <NInput :placeholder="t('register.email.placeholder[0]')" />
                </NFormItem>
                <NFormItem :label="t('register.email.label[1]')">
                  <NInput :placeholder="t('register.email.placeholder[1]')" />
                </NFormItem>
              </NForm>
              <NButton class="bg-[#76e43b] rounded-lg w-full h-12 text-lg font-bold">{{ t('register.title') }}</NButton>
              <div class="text-center">
                {{ t('register.announce') }}<span class="text-[#76e43b]">{{ t('register.according[0]') }}</span
                ><span class="text-[#76e43b]">{{ t('register.according[1]') }}</span>
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
