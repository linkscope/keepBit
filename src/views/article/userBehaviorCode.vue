<template>
  <div class="bg-gray-100 text-gray-800">

    <!-- 页头 -->
    <header class="bg-white-600 text-black py-6">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-bold">{{ t('userBehaviorCode.title') }}</h1>
      </div>
    </header>

    <!-- 协议正文 -->
    <main class="py-16 px-4 sm:px-6 lg:px-12">
      <div class="container mx-auto bg-white p-8 rounded-lg shadow-lg">

        <!-- 1. 行为准则 -->
        <section class="mb-12">
          <p class="mt-4 text-lg text-gray-700">
            {{ t('userBehaviorCode.section1Text1') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('userBehaviorCode.section1Text2') }}
          </p>
          <ul class="list-decimal pl-6 mt-2 text-lg text-gray-700">
            <li>{{ t('userBehaviorCode.section1Item1') }}</li>
            <li>{{ t('userBehaviorCode.section1Item2') }}</li>
            <li>{{ t('userBehaviorCode.section1Item3') }}</li>
            <li>{{ t('userBehaviorCode.section1Item4') }}</li>
            <li>{{ t('userBehaviorCode.section1Item5') }}</li>
            <li>{{ t('userBehaviorCode.section1Item6') }}</li>
            <li>{{ t('userBehaviorCode.section1Item7') }}</li>
            <li>{{ t('userBehaviorCode.section1Item8') }}</li>
            <li>{{ t('userBehaviorCode.section1Item9') }}</li>
            <li>{{ t('userBehaviorCode.section1Item10') }}</li>
          </ul>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('userBehaviorCode.section1Text3') }}
          </p>
        </section>

        <div class="text-center mt-16">
          <p class="text-lg text-gray-700">{{ t('userBehaviorCode.footer') }}</p>
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
