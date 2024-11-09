<template>
  <div class="bg-gray-100 text-gray-800">

    <!-- 页头 -->
    <header class="bg-white-600 text-black py-6">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-bold">{{ t('disclaimer.title') }}</h1>
      </div>
    </header>

    <!-- 协议正文 -->
    <main class="py-16 px-4 sm:px-6 lg:px-12">
      <div class="container mx-auto bg-white p-8 rounded-lg shadow-lg">

        <!-- 1. 概述 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('disclaimer.overview') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.overviewText') }}
          </p>
        </section>

        <!-- 2. 一般的 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('disclaimer.general') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.generalText') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.generalText2') }}
          </p>
        </section>

        <!-- 3. 针对美国人的具体信息 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('disclaimer.usSpecific') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.usSpecificText') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.usSpecificText2') }}
          </p>
        </section>

        <!-- 4. 加拿大居民的具体信息 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('disclaimer.canadaSpecific') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.canadaSpecificText') }}
          </p>
        </section>

        <!-- 5. 无报价 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('disclaimer.noOffer') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.noOfferText') }}
          </p>
        </section>

        <!-- 6. 没有建议 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('disclaimer.noAdvice') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.noAdviceText') }}
          </p>
        </section>

        <!-- 7. 数字资产交易和投资的风险 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('disclaimer.digitalAssetRisk') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.digitalAssetRiskText') }}
          </p>
          <ul class="list-disc pl-6 mt-2 text-lg text-gray-700">
            <li>{{ t('disclaimer.digitalAssetRiskItem1') }}</li>
            <li>{{ t('disclaimer.digitalAssetRiskItem2') }}</li>
            <li>{{ t('disclaimer.digitalAssetRiskItem3') }}</li>
            <li>{{ t('disclaimer.digitalAssetRiskItem4') }}</li>
            <li>{{ t('disclaimer.digitalAssetRiskItem5') }}</li>
            <li>{{ t('disclaimer.digitalAssetRiskItem6') }}</li>
            <li>{{ t('disclaimer.digitalAssetRiskItem7') }}</li>
          </ul>
        </section>

        <!-- 8. 无保证 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('disclaimer.noGuarantee') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.noGuaranteeText') }}
          </p>
        </section>

        <!-- 9. 责任限制 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('disclaimer.liabilityLimit') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.liabilityLimitText') }}
          </p>
        </section>

        <!-- 10. 反洗钱和反恐融资 (AML/CTF) 和监管合规 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('disclaimer.amlCtfCompliance') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.amlCtfComplianceText') }}
          </p>
        </section>

        <!-- 11. 网站和软件的可用性 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('disclaimer.websiteAvailability') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.websiteAvailabilityText') }}
          </p>
        </section>

        <!-- 12. 服务台 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('disclaimer.supportDesk') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.supportDeskText') }}
          </p>
        </section>

        <!-- 13. 隐私 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('disclaimer.privacy') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('disclaimer.privacyText') }}
          </p>
        </section>

        <div class="text-center mt-16">
          <p class="text-lg text-gray-700">{{ t('disclaimer.footer') }}</p>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* 可以在这里添加额外的自定义样式 */
</style>
