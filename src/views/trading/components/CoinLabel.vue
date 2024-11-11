<script setup>
defineProps({
  option: String,
})
</script>

<template>
  <div>{{ JSON.parse(option).instId }}</div>
</template>

<style scoped></style>
