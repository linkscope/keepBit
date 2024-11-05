<script setup>
import { loadLanguageAsync } from '@/i18n'
const { t, locale } = useI18n()

const handleLocale = async (lang) => {
  await loadLanguageAsync(lang)
  locale.value = lang
}
</script>

<template>
  <header>Header, {{ t('message') }}</header>
  <div @click="handleLocale('zhCN')">中文</div>
  <div @click="handleLocale('zhTW')">繁体中文</div>
  <div @click="handleLocale('enUS')">英语</div>
  <div @click="handleLocale('msMS')">马来语</div>
  <div @click="handleLocale('thTH')">泰语</div>
  <div @click="handleLocale('viVN')">越南语</div>
  <div @click="handleLocale('idID')">印度尼西亚语</div>
  <div @click="handleLocale('koKR')">韩语</div>
  <div @click="handleLocale('jaJP')">日语</div>
</template>
