<script setup>
defineProps({
  coin: Object,
  showStock: Boolean,
})
</script>

<template>
  <div class="flex items-center py-4 md:py-8 px-2 md:px-4 border border-solid border-slate-200 rounded-2xl gap-x-4">
    <img class="size-12 md:size-16" :src="coin.image" />
    <div class="space-y-2 w-[100px] md:w-[200px] truncate">
      <div class="text-sm md:text-2xl font-bold">{{ coin.instId.replace('USDT', '') }}</div>
      <div class="text-sm text-slate-400/80">vol: {{ coin.volume }}</div>
    </div>
    <div class="flex-1 flex items-center justify-center gap-x-8">
      <div class="text-sm md:text-2xl">${{ coin.lastPrice.toFixed(5) }}</div>
      <img v-if="showStock" class="w-[60px] md:w-[120px]" src="/stock.svg" />
    </div>
    <div
      class="text-xs md:text-xl"
      :style="{
        color: coin.change24h > 0 ? '#5ac820' : 'red',
      }"
    >
      {{ `${coin.change24h > 0 ? '+' : ''}${coin.priceChangePercent}%` }}
    </div>
  </div>
</template>
