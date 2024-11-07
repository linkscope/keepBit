<script setup>
const { t } = useI18n()
</script>

<template>
  <div class="py-8 bg-black relative">
    <img class="absolute top-0 left-0 size-full" src="/about_bg.png" />
    <div class="lg:w-[1280px] p-4 lg:p-0 mx-auto flex flex-col items-center gap-y-8">
      <img class="size-[100px]" src="/logo.png" />
      <div class="text-white font-bold text-[64px]">{{ t('about.title') }}</div>
      <div class="text-base lg:text-2xl text-slate-600">{{ t('about.subtitle') }}</div>
    </div>
    <img class="relative left-0 right-0" src="/about_earth.png" />
  </div>
  <div class="py-16 lg:w-[1280px] mx-auto p-4 lg:p-0 space-y-8">
    <div class="font-bold text-[40px]">我们的优势</div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="border border-slate-200/80 rounded-2xl py-4 px-8">
        <div class="flex items-center justify-between">
          <div class="text-lg lg:text-2xl font-bold">安全可靠的交易平台</div>
          <img class="size-[100px] lg:size-[200px]" src="/about_adventage1.png" />
        </div>
        <div class="text-slate-400 text-base lg:text-2xl">
          行业领先安全技术与合规化专业运营，保障用户实时体验可靠、顺畅、安全的交易环境！
        </div>
      </div>
      <div class="border border-slate-200/80 rounded-2xl py-4 px-8">
        <div class="flex items-center justify-between">
          <div class="text-lg lg:text-2xl font-bold">丰富的交易选择</div>
          <img class="size-[100px] lg:size-[200px]" src="/about_adventage2.png" />
        </div>
        <div class="text-slate-400 text-base lg:text-2xl">
          多样的交易方式与众多的合作伙伴，为用户提供丰富的交易手段和交易标的选择，同时也保障了充分的交易流动性。
        </div>
      </div>
      <div class="border border-slate-200/80 rounded-2xl py-4 px-8">
        <div class="flex items-center justify-between">
          <div class="text-lg lg:text-2xl font-bold">生态合作伙伴</div>
          <img class="size-[100px] lg:size-[200px]" src="/about_adventage3.png" />
        </div>
        <div class="text-slate-400 text-base lg:text-2xl">
          KeepBit生态合作伙伴即刻获得多类型战略支持，共享KeepBit平台的生态价值与数字货币时代红利
        </div>
      </div>
      <div class="border border-slate-200/80 rounded-2xl py-4 px-8">
        <div class="flex items-center justify-between">
          <div class="text-lg lg:text-2xl font-bold">一站式交易服务</div>
          <img class="size-[100px] lg:size-[200px]" src="/about_adventage4.png" />
        </div>
        <div class="text-slate-400 text-base lg:text-2xl">
          KeepBit为全球数十个国家、100+万用户7x24小时提供多语言、高品质服务！
        </div>
      </div>
    </div>
    <div class="font-bold text-[40px]">联系我们</div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="border border-slate-200/80 rounded-2xl py-8 flex flex-col items-center">
        <img class="size-[80px]" src="/about_contact1.png" />
        <div class="text-2xl font-bold">商务合作</div>
        <div class="text-lg font-bold">1234564@163.com</div>
      </div>
      <div class="border border-slate-200/80 rounded-2xl py-8 flex flex-col items-center">
        <img class="size-[80px]" src="/about_contact2.png" />
        <div class="text-2xl font-bold">媒体合作</div>
        <div class="text-lg font-bold">1234564@163.com</div>
      </div>
      <div class="border border-slate-200/80 rounded-2xl py-8 flex flex-col items-center">
        <img class="size-[80px]" src="/about_contact3.png" />
        <div class="text-2xl font-bold">运营支持</div>
        <div class="text-lg font-bold">1234564@163.com</div>
      </div>
    </div>
  </div>
</template>
