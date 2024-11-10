<template>
  <div class="bg-gray-100 text-gray-800">

    <!-- 页头 -->
    <header class="bg-white-600 text-black py-6">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-bold">{{ t('serviceAgreement.title') }}</h1>
      </div>
    </header>

    <!-- 协议正文 -->
    <main class="py-16 px-4 sm:px-6 lg:px-12">
      <div class="container mx-auto bg-white p-8 rounded-lg shadow-lg">

        <section class="mb-12">
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section1Text1') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section1Text2') }}
          </p>
        </section>

        <!-- 1. 解释和定义 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section2Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section2Text1') }}
          </p>
          <ul class="list-disc pl-6 mt-2 text-lg text-gray-700">
            <li>{{ t('serviceAgreement.section2Item1') }}</li>
            <li>{{ t('serviceAgreement.section2Item2') }}</li>
            <li>{{ t('serviceAgreement.section2Item3') }}</li>
            <li>{{ t('serviceAgreement.section2Item4') }}</li>
            <li>{{ t('serviceAgreement.section2Item5') }}</li>
          </ul>
        </section>

        <!-- 2. 保证金账户中的资产 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section3Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section3Text1') }}
          </p>
        </section>

        <!-- 3. 追加保证金 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section4Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section4Text1') }}
          </p>
        </section>

        <!-- 4. 不足资金的处理 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section5Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section5Text1') }}
          </p>
        </section>

        <!-- 5. 资产损失 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section6Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section6Text1') }}
          </p>
        </section>

        <!-- 6. 保证金要求变动 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section7Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section7Text1') }}
          </p>
        </section>

        <!-- 7. 保证金要求修改 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section8Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section8Text1') }}
          </p>
        </section>

        <!-- 8. 保证金遵守要求 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section9Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section9Text1') }}
          </p>
        </section>

        <!-- 9. 风险控制 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section10Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section10Text1') }}
          </p>
        </section>

        <!-- 10. 头寸和资产估值 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section11Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section11Text1') }}
          </p>
        </section>

        <!-- 11. 保证金清算 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section12Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section12Text1') }}
          </p>
        </section>

        <!-- 12. 订单拒绝 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section13Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section13Text1') }}
          </p>
        </section>

        <!-- 13. 清算通知 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section14Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section14Text1') }}
          </p>
        </section>

        <!-- 14. 清算责任 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section15Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section15Text1') }}
          </p>
        </section>

        <!-- 15. 自动清算 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section16Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section16Text1') }}
          </p>
        </section>

        <!-- 16. 清算选择 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section17Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section17Text1') }}
          </p>
        </section>

        <!-- 17. 卖空风险 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section18Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section18Text1') }}
          </p>
        </section>

        <!-- 18. 保证金清算权 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section19Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section19Text1') }}
          </p>
        </section>

        <!-- 19. 清算后的责任 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section20Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section20Text1') }}
          </p>
        </section>

        <!-- 20. 清算冻结权 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section21Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section21Text1') }}
          </p>
        </section>

        <!-- 21. 市场保护 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('serviceAgreement.section22Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('serviceAgreement.section22Text1') }}
          </p>
        </section>

        <div class="text-center mt-16">
          <p class="text-lg text-gray-700">{{ t('serviceAgreement.footer') }}</p>
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
