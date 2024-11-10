<template>
  <div class="bg-gray-100 text-gray-800">

    <!-- 页头 -->
    <header class="bg-white-600 text-black py-6">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-bold">{{ t('agreement.title') }}</h1>
        <p class="text-lg mt-2">{{ t('agreement.subtitle') }}</p>
      </div>
    </header>

    <!-- 协议正文 -->
    <main class="py-16 px-4 sm:px-6 lg:px-12">
      <div class="container mx-auto bg-white p-8 rounded-lg shadow-lg">

        <!-- 1. 服务条款 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('agreement.termsOfService') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agreement.effectDate') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agreement.importantNotice') }}
          </p>
        </section>

        <!-- 2. 一般的 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('agreement.general') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agreement.generalText') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agreement.readTerms') }}
          </p>
        </section>

        <!-- 3. 合格条件 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('agreement.qualification') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agreement.qualificationText') }}
          </p>
          <ul class="list-disc pl-6 mt-2 text-lg text-gray-700">
            <li>{{ t('agreement.qualificationItem1') }}</li>
            <li>{{ t('agreement.qualificationItem2') }}</li>
            <li>{{ t('agreement.qualificationItem3') }}</li>
            <li>{{ t('agreement.qualificationItem4') }}</li>
          </ul>
        </section>

        <!-- 4. 账户 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('agreement.account') }}</h2>
          <p class="mt-4 text-lg text-gray-700">{{ t('agreement.createAccount') }}</p>
          <p class="mt-4 text-lg text-gray-700">{{ t('agreement.accountInfo') }}</p>
          <p class="mt-4 text-lg text-gray-700">{{ t('agreement.phoneEmail') }}</p>
        </section>

        <!-- 5. 服务 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('agreement.services') }}</h2>
          <p class="mt-4 text-lg text-gray-700">{{ t('agreement.servicesListIntro') }}</p>
          <ul class="list-disc pl-6 mt-2 text-lg text-gray-700">
            <li>{{ t('agreement.service1') }}</li>
            <li>{{ t('agreement.service2') }}</li>
            <li>{{ t('agreement.service3') }}</li>
            <li>{{ t('agreement.service4') }}</li>
            <li>{{ t('agreement.service5') }}</li>
          </ul>
        </section>

        <!-- 6. 数字资产风险 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('agreement.digitalAssetRisk') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agreement.digitalAssetRiskText') }}
          </p>
        </section>

        <!-- 7. 费用 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('agreement.fees') }}</h2>
          <p class="mt-4 text-lg text-gray-700">{{ t('agreement.feesText') }}</p>
        </section>

        <!-- 8. 修改和终止 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('agreement.modificationsAndTerminations') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agreement.modificationsText') }}
          </p>
        </section>

        <!-- 9. 用户声明 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('agreement.userDeclaration') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agreement.userDeclarationText') }}
          </p>
        </section>

        <div class="text-center mt-16">
          <p class="text-lg text-gray-700">{{ t('agreement.thankYou') }}</p>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
const { t } = useI18n()
</script>

<style scoped>
/* 可以在这里添加额外的自定义样式 */
</style>
