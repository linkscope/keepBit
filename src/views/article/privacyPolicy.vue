<template>
  <div class="bg-gray-100 text-gray-800">

    <!-- 页头 -->
    <header class="bg-white-600 text-black py-6">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-bold">{{ t('privacyPolicy.title') }}</h1>
      </div>
    </header>

    <!-- 协议正文 -->
    <main class="py-16 px-4 sm:px-6 lg:px-12">
      <div class="container mx-auto bg-white p-8 rounded-lg shadow-lg">

        <!-- 1. 概述 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('privacyPolicy.section1Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section1Text1') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section1Text2') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section1Text3') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section1Text4') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section1Text5') }}
          </p>
        </section>

        <!-- 2. 定义 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('privacyPolicy.section2Title') }}</h2>
          <ul class="list-disc pl-6 mt-2 text-lg text-gray-700">
            <li>{{ t('privacyPolicy.section2Item1') }}</li>
            <li>{{ t('privacyPolicy.section2Item2') }}</li>
            <li>{{ t('privacyPolicy.section2Item3') }}</li>
            <li>{{ t('privacyPolicy.section2Item4') }}</li>
            <li>{{ t('privacyPolicy.section2Item5') }}</li>
          </ul>
        </section>

        <!-- 3. 我们收集哪些个人信息？ -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('privacyPolicy.section3Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section3Text1') }}
          </p>
          <ul class="list-disc pl-6 mt-2 text-lg text-gray-700">
            <li>{{ t('privacyPolicy.section3Item1') }}</li>
            <li>{{ t('privacyPolicy.section3Item2') }}</li>
            <li>{{ t('privacyPolicy.section3Item3') }}</li>
            <li>{{ t('privacyPolicy.section3Item4') }}</li>
            <li>{{ t('privacyPolicy.section3Item5') }}</li>
          </ul>
        </section>

        <!-- 4. 我们如何处理个人信息？ -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('privacyPolicy.section4Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section4Text1') }}
          </p>
          <ul class="list-disc pl-6 mt-2 text-lg text-gray-700">
            <li>{{ t('privacyPolicy.section4Item1') }}</li>
            <li>{{ t('privacyPolicy.section4Item2') }}</li>
            <li>{{ t('privacyPolicy.section4Item3') }}</li>
            <li>{{ t('privacyPolicy.section4Item4') }}</li>
            <li>{{ t('privacyPolicy.section4Item5') }}</li>
            <li>{{ t('privacyPolicy.section4Item6') }}</li>
            <li>{{ t('privacyPolicy.section4Item7') }}</li>
          </ul>
        </section>

        <!-- 5. 我们如何使用 Cookie 和跟踪技术？ -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('privacyPolicy.section5Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section5Text1') }}
          </p>
          <ul class="list-disc pl-6 mt-2 text-lg text-gray-700">
            <li>{{ t('privacyPolicy.section5Item1') }}</li>
            <li>{{ t('privacyPolicy.section5Item2') }}</li>
            <li>{{ t('privacyPolicy.section5Item3') }}</li>
            <li>{{ t('privacyPolicy.section5Item4') }}</li>
          </ul>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section5Text2') }}
          </p>
        </section>

        <!-- 6. 我们会分享个人信息吗？ -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('privacyPolicy.section6Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section6Text1') }}
          </p>
          <ul class="list-disc pl-6 mt-2 text-lg text-gray-700">
            <li>{{ t('privacyPolicy.section6Item1') }}</li>
            <li>{{ t('privacyPolicy.section6Item2') }}</li>
            <li>{{ t('privacyPolicy.section6Item3') }}</li>
            <li>{{ t('privacyPolicy.section6Item4') }}</li>
            <li>{{ t('privacyPolicy.section6Item5') }}</li>
          </ul>
        </section>

        <!-- 7. 我们为什么保留个人信息？ -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('privacyPolicy.section7Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section7Text1') }}
          </p>
        </section>

        <!-- 8. 我们如何保护您的个人信息？ -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('privacyPolicy.section8Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section8Text1') }}
          </p>
        </section>

        <!-- 9. 儿童可以使用服务吗？ -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('privacyPolicy.section9Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section9Text1') }}
          </p>
        </section>

        <!-- 10. 第三方网站和社交媒体平台 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('privacyPolicy.section10Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section10Text1') }}
          </p>
        </section>

        <!-- 11. 其他 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('privacyPolicy.section11Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section11Text1') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section11Text2') }}
          </p>
        </section>

        <!-- 12. 联系我们 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('privacyPolicy.section12Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('privacyPolicy.section12Text1') }}
          </p>
        </section>

        <div class="text-center mt-16">
          <p class="text-lg text-gray-700">{{ t('privacyPolicy.footer') }}</p>
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
