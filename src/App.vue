<script setup>
import {
  NConfigProvider,
  zhCN,
  dateZhCN,
  zhTW,
  dateZhTW,
  viVN,
  dateViVN,
  thTH,
  dateThTH,
  koKR,
  dateKoKR,
  jaJP,
  dateJaJP,
  idID,
  dateIdID,
  enUS,
  dateEnUS,
} from 'naive-ui'
const { locale } = useI18n()

const localeValue = computed(() => {
  switch (locale.value) {
    case 'zhCN':
      return {
        locale: zhCN,
        date: dateZhCN,
      }
    case 'zhTW':
      return {
        locale: zhTW,
        date: dateZhTW,
      }
    case 'enUS':
    case 'msMS':
      return {
        locale: enUS,
        date: dateEnUS,
      }
    case 'viVN':
      return {
        locale: viVN,
        date: dateViVN,
      }
    case 'thTH':
      return {
        locale: thTH,
        date: dateThTH,
      }
    case 'koKR':
      return {
        locale: koKR,
        date: dateKoKR,
      }
    case 'jaJP':
      return {
        locale: jaJP,
        date: dateJaJP,
      }
    case 'idID':
      return {
        locale: idID,
        date: dateIdID,
      }
    default:
      return {
        locale: enUS,
        date: dateEnUS,
      }
  }
})
</script>

<template>
  <NConfigProvider :locale="localeValue.locale" :date-locale="localeValue.date">
    <router-view />
  </NConfigProvider>
</template>
