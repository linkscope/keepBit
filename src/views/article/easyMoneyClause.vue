<template>
  <div class="bg-gray-100 text-gray-800">

    <!-- 页头 -->
    <header class="bg-white-600 text-black py-6">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-bold">{{ t('easyMoneyClause.title') }}</h1>
      </div>
    </header>

    <!-- 协议正文 -->
    <main class="py-16 px-4 sm:px-6 lg:px-12">
      <div class="container mx-auto bg-white p-8 rounded-lg shadow-lg">

        <!-- 1. 轻松赚钱 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('easyMoneyClause.section1Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section1Text1') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section1Text2') }}
          </p>
        </section>

        <!-- 2. 订阅易赚 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('easyMoneyClause.section2Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section2Text1') }}
          </p>
          <ul class="list-decimal pl-6 mt-2 text-lg text-gray-700">
            <li>{{ t('easyMoneyClause.section2Item1') }}</li>
            <li>{{ t('easyMoneyClause.section2Item2') }}</li>
            <li>{{ t('easyMoneyClause.section2Item3') }}</li>
          </ul>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section2Text2') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section2Text3') }}
          </p>
        </section>

        <!-- 3. 轻松赚取奖励 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('easyMoneyClause.section3Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section3Text1') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section3Text2') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section3Text3') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section3Text4') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section3Text5') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section3Text6') }}
          </p>
        </section>

        <!-- 4. 救赎 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('easyMoneyClause.section4Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section4Text1') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section4Text2') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section4Text3') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section4Text4') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section4Text5') }}
          </p>
        </section>

        <!-- 5. 停止、暂停或取消您的 Easy Earn 交易 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('easyMoneyClause.section5Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section5Text1') }}
          </p>
          <ul class="list-decimal pl-6 mt-2 text-lg text-gray-700">
            <li>{{ t('easyMoneyClause.section5Item1') }}</li>
            <li>{{ t('easyMoneyClause.section5Item2') }}</li>
            <li>{{ t('easyMoneyClause.section5Item3') }}</li>
            <li>{{ t('easyMoneyClause.section5Item4') }}</li>
            <li>{{ t('easyMoneyClause.section5Item5') }}</li>
          </ul>
        </section>

        <!-- 6. 技术免责声明 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('easyMoneyClause.section6Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section6Text1') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section6Text2') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section6Text3') }}
          </p>
        </section>

        <!-- 7. 一般条款 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('easyMoneyClause.section7Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section7Text1') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section7Text2') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('easyMoneyClause.section7Text3') }}
          </p>
        </section>

        <div class="text-center mt-16">
          <p class="text-lg text-gray-700">{{ t('easyMoneyClause.footer') }}</p>
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
