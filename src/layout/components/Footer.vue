<script setup>
import { NIcon } from 'naive-ui'
import { ChevronDown16Regular, ChevronUp16Regular } from '@vicons/fluent'
const { t } = useI18n()
const clientWidth = document.body.clientWidth
const showServiceList = ref(clientWidth > 1280)
const showUserSupport = ref(clientWidth > 1280)
const showCompany = ref(clientWidth > 1280)
const showExplanation = ref(clientWidth > 1280)
</script>

<template>
  <footer class="p-12 bg-[#78e43f]">
    <div class="lg:w-[1280px] mx-auto flex flex-col lg:flex-row gap-32">
      <div class="space-y-6">
        <div to="/" class="flex items-center gap-x-4">
          <img class="size-10" src="/logo.png" />
          <span class="font-bold text-lg">{{ t('footer.logo') }}</span>
        </div>
        <div class="flex items-center flex-wrap gap-4">
          <a href="https://www.facebook.com/groups/keepbit.official/" target="_blank">
            <img class="size-6" src="/facebook.svg" alt="Facebook" />
          </a>
          <a href="https://x.com/i/communities/1782021388393730502" target="_blank">
            <img class="size-6" src="/x.svg" alt="Twitter" />
          </a>
          <a href="https://t.me/Keepbit2024" target="_blank">
            <img class="size-6" src="/telegram.svg" alt="Telegram" />
          </a>
          <a href="https://www.tiktok.com/@keepbit_official?_t=8mYSfzCAVMm&_r=1" target="_blank">
            <img class="size-6" src="/TikTok.png" alt="TikTok" />
          </a>
          <a href="https://www.youtube.com/@Keepbit_official" target="_blank">
            <img class="size-6" src="/youtube.svg" alt="YouTube" />
          </a>
          <a href="https://whatsapp.com/channel/0029VaVXV3V0QeauC0a5RX02" target="_blank">
            <img class="size-6" src="/WhatsApp.png" alt="WhatsApp" />
          </a>
          <a href="https://www.linkedin.com/company/103665382/" target="_blank">
            <img class="size-6" src="/linkedin.svg" alt="LinkedIn" />
          </a>
        </div>
        <div class="text-white">{{ t('footer.copyright') }}</div>
      </div>
      <div class="flex lg:flex-1 flex-col lg:flex-row gap-8 justify-between">
        <div class="space-y-4 text-white">
          <div
              class="flex items-center justify-between text-black text-xl border-b lg:border-none border-b-slate-700 pb-4"
              @click="showServiceList = !showServiceList"
          >
            {{ t('footer.serviceTitle') }}
            <NIcon class="block lg:hidden">
              <ChevronUp16Regular v-if="showServiceList" />
              <ChevronDown16Regular v-else />
            </NIcon>
          </div>
          <template v-if="showServiceList">
            <a href="/#/article/app-download" class="block">{{ t('footer.appDownload') }}</a>
            <a href="/#/market" class="block">{{ t('footer.market') }}</a>
            <a href="/#/article/serviceAgreement" class="block">{{ t('footer.serviceAgreement') }}</a>
          </template>
        </div>
        <div class="space-y-4 text-white">
          <div
              class="flex items-center justify-between text-black text-xl border-b lg:border-none border-b-slate-700 pb-4"
              @click="showUserSupport = !showUserSupport"
          >
            {{ t('footer.userSupportTitle') }}
            <NIcon class="block lg:hidden">
              <ChevronUp16Regular v-if="showUserSupport" />
              <ChevronDown16Regular v-else />
            </NIcon>
          </div>
          <template v-if="showUserSupport">
            <a
                href="https://wa.me/60176012341?text=Tips%20layanan%20pelanggan%20resmi%20Whatsapp%3A%20Klik%20untuk%20melanjutkan%20percakapan.%20Ikuti%20saran%20instruktur%20Anda.%20Anda%20bisa%20mendapatkan%20Rp%20500.000-2.000.000%20per%20hari.%20Layanan%20pelanggan%20resmi%20dapat%20dipercaya."
                class="block"
            >
              {{ t('footer.customerSupport') }}
            </a>
            <a href="/#/article/howRegister" class="block">{{ t('footer.howRegister') }}</a>
          </template>
        </div>
        <div class="space-y-4 text-white">
          <div
              class="flex items-center justify-between text-black text-xl border-b lg:border-none border-b-slate-700 pb-4"
              @click="showCompany = !showCompany"
          >
            {{ t('footer.companyTitle') }}
            <NIcon class="block lg:hidden">
              <ChevronUp16Regular v-if="showCompany" />
              <ChevronDown16Regular v-else />
            </NIcon>
          </div>
          <template v-if="showCompany">
            <a href="/#/about" class="block">{{ t('footer.aboutUs') }}</a>
            <a href="/#/article/agencyPlan" class="block">{{ t('footer.agencyPlan') }}</a>
          </template>
        </div>
        <div class="space-y-4 text-white">
          <div
              class="flex items-center justify-between text-black text-xl border-b lg:border-none border-b-slate-700 pb-4"
              @click="showExplanation = !showExplanation"
          >
            {{ t('footer.termsTitle') }}
            <NIcon class="block lg:hidden">
              <ChevronUp16Regular v-if="showExplanation" />
              <ChevronDown16Regular v-else />
            </NIcon>
          </div>
          <template v-if="showExplanation">
            <a href="/#/article/agreement" class="block">{{ t('footer.userAgreement') }}</a>
            <a href="/#/article/privacyPolicyIndex" class="block">{{ t('footer.privacyPolicyIndex') }}</a>
            <a href="/#/article/disclaimer" class="block">{{ t('footer.disclaimer') }}</a>
            <a href="/#/article/userBehaviorCode" class="block">{{ t('footer.userBehaviorCode') }}</a>
            <a href="/#/article/easyMoneyClause" class="block">{{ t('footer.easyMoneyClause') }}</a>
          </template>
        </div>
      </div>
    </div>
  </footer>
</template>
