<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
</script>

<template>
  <Header />
  <router-view />
  <Footer v-if="!['/login', '/register'].includes(route.path)" />
</template>
