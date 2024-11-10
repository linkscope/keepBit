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
  <div class="py-16 lg:w-[1280px] mx-auto px-4 lg:px-0 space-y-8">
    <div class="font-bold text-[40px]">{{ t('about.advantage.title') }}</div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="border border-slate-200/80 rounded-2xl py-4 px-8">
        <div class="flex items-center justify-between">
          <div class="text-lg lg:text-2xl font-bold">{{ t('about.advantage.list[0].title') }}</div>
          <img class="size-[100px] lg:size-[200px]" src="/about_advantage1.png" />
        </div>
        <div class="text-slate-400 text-base lg:text-2xl">
          {{ t('about.advantage.list[0].desc') }}
        </div>
      </div>
      <div class="border border-slate-200/80 rounded-2xl py-4 px-8">
        <div class="flex items-center justify-between">
          <div class="text-lg lg:text-2xl font-bold">{{ t('about.advantage.list[1].title') }}</div>
          <img class="size-[100px] lg:size-[200px]" src="/about_advantage2.png" />
        </div>
        <div class="text-slate-400 text-base lg:text-2xl">
          {{ t('about.advantage.list[1].desc') }}
        </div>
      </div>
      <div class="border border-slate-200/80 rounded-2xl py-4 px-8">
        <div class="flex items-center justify-between">
          <div class="text-lg lg:text-2xl font-bold">{{ t('about.advantage.list[2].title') }}</div>
          <img class="size-[100px] lg:size-[200px]" src="/about_advantage3.png" />
        </div>
        <div class="text-slate-400 text-base lg:text-2xl">
          {{ t('about.advantage.list[2].desc') }}
        </div>
      </div>
      <div class="border border-slate-200/80 rounded-2xl py-4 px-8">
        <div class="flex items-center justify-between">
          <div class="text-lg lg:text-2xl font-bold">{{ t('about.advantage.list[3].title') }}</div>
          <img class="size-[100px] lg:size-[200px]" src="/about_advantage4.png" />
        </div>
        <div class="text-slate-400 text-base lg:text-2xl">
          {{ t('about.advantage.list[3].desc') }}
        </div>
      </div>
    </div>
    <div class="font-bold text-[40px]">{{ t('about.contact.title') }}</div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="border border-slate-200/80 rounded-2xl py-8 flex flex-col items-center gap-y-4">
        <img class="size-[80px]" src="/about_contact1.png" />
        <div class="text-2xl font-bold">{{ t('about.contact.list[0]') }}</div>
        <div class="text-lg font-bold">service@keepbit.top</div>
      </div>
      <div class="border border-slate-200/80 rounded-2xl py-8 flex flex-col items-center gap-y-4">
        <img class="size-[80px]" src="/about_contact2.png" />
        <div class="text-2xl font-bold">{{ t('about.contact.list[1]') }}</div>
        <div class="text-lg font-bold">service@keepbit.top</div>
      </div>
      <div class="border border-slate-200/80 rounded-2xl py-8 flex flex-col items-center gap-y-4">
        <img class="size-[80px]" src="/about_contact3.png" />
        <div class="text-2xl font-bold">{{ t('about.contact.list[2]') }}</div>
        <div class="text-lg font-bold">service@keepbit.top</div>
      </div>
    </div>
  </div>
</template>
