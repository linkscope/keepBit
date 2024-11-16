<template>
  <div class="bg-gray-100 text-gray-800">
    <!-- 页头 -->
    <header class="bg-white-600 text-black py-6">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-bold">{{ t('howRegister.title') }}</h1>
      </div>
    </header>

    <!-- 协议正文 -->
    <main class="py-16 px-4 sm:px-6 lg:px-12">
      <div class="container mx-auto bg-white p-8 rounded-lg shadow-lg">

        <!-- 1. 新手指南 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('howRegister.section1Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('howRegister.section1Text1') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('howRegister.section1Text2') }}
          </p>
        </section>

        <!-- 2. App 版本 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('howRegister.section2Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section2Text1') }}</p>
          <div class="mt-8 flex justify-between gap-4">
            <!-- 图片1 -->
            <div class="w-1/4">
              <img
                  v-if="$i18n.locale === 'zhCN'"
                  src="/howRegisterImag1.png"
                  alt="ima1"
                  class="w-full h-auto"
              />
              <img
                  v-else
                  src="/howRegisterImag_en1.png"
                  alt="ima1"
                  class="w-full h-auto"
              />
            </div>

            <!-- 图片2 -->
            <div class="w-1/4">
              <img
                  v-if="$i18n.locale === 'zhCN'"
                  src="/howRegisterImag2.png"
                  alt="ima2"
                  class="w-full h-auto"
              />
              <img
                  v-else
                  src="/howRegisterImag_en2.png"
                  alt="ima2"
                  class="w-full h-auto"
              />
            </div>

            <!-- 图片3 -->
            <div class="w-1/4">
              <img
                  v-if="$i18n.locale === 'zhCN'"
                  src="/howRegisterImag3.png"
                  alt="ima3"
                  class="w-full h-auto"
              />
              <img
                  v-else
                  src="/howRegisterImag_en3.png"
                  alt="ima3"
                  class="w-full h-auto"
              />
            </div>
          </div>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section2Text2') }}</p>
          <ul class="list-decimal pl-6 mt-2 text-lg text-gray-700">
            <li>{{ t('howRegister.section2Item1') }}</li>
            <li>{{ t('howRegister.section2Item2') }}</li>
            <ul class="list-disc pl-6">
              <li>{{ t('howRegister.section2Item3') }}</li>
              <li>{{ t('howRegister.section2Item4') }}</li>
              <li>{{ t('howRegister.section2Item5') }}</li>
              <li>{{ t('howRegister.section2Item6') }}</li>
            </ul>
            <li>{{ t('howRegister.section2Text3') }}</li>
          </ul>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section2Text4') }}</p>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section2Text5') }}</p>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section2Text6') }}</p>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section2Text7') }}</p>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section2Text8') }}</p>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section2Text9') }}</p>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section2Text10') }}</p>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section2Text11') }}</p>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section2Text12') }}</p>
        </section>

        <!-- 3. Web 版本 -->
        <section class="mb-12">
          <h2 class="text-3xl font-semibold text-black-600">{{ t('howRegister.section3Title') }}</h2>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section3Text1') }}</p>
          <div class="mt-8">
            <img
                v-if="$i18n.locale === 'zhCN'"
                src="/howRegisterImag4.png"
                alt="ima"
                class="w-full h-auto mb-8"
            />
            <img
                v-else
                src="/howRegisterImag_en4.png"
                alt="ima"
                class="w-full h-auto mb-8"
            />
          </div>
          <div class="mt-8">
            <img
                v-if="$i18n.locale === 'zhCN'"
                src="/howRegisterImag5.png"
                alt="ima"
                class="w-full h-auto mb-8"
            />
            <img
                v-else
                src="/howRegisterImag_en5.png"
                alt="ima"
                class="w-full h-auto mb-8"
            />
          </div>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section3Text2') }}</p>
          <ul class="list-decimal pl-6 mt-2 text-lg text-gray-700">
            <li>{{ t('howRegister.section3Item1') }}</li>
            <li>{{ t('howRegister.section3Item2') }}</li>
            <ul class="list-disc pl-6">
              <li>{{ t('howRegister.section3Item3') }}</li>
              <li>{{ t('howRegister.section3Item4') }}</li>
              <li>{{ t('howRegister.section3Item5') }}</li>
              <li>{{ t('howRegister.section3Item6') }}</li>
            </ul>
            <li>{{ t('howRegister.section3Text3') }}</li>
          </ul>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section3Text4') }}</p>
          <p class="mt-4 text-lg text-gray-700">{{ t('howRegister.section3Text5') }}</p>
        </section>

      </div>
    </main>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
/* 自定义样式 */
/* 确保图片按比例缩放并保持一致 */
img {
  object-fit: contain;
  max-height: 550px; /* 调整图片的最大高度 */
}
</style>
