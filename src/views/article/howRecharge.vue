<template>
  <div class="container">
    <h1 class="text-center">Word 文档预览</h1>
    <div ref="docxContainer" class="docx-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { renderAsync } from 'docx-preview';

// 设置文档路径
const wordFileUrl = 'https://008dy.com/KeepBitRecharge.docx'; // 替换为实际服务器文件路径
const docxContainer = ref(null);

onMounted(async () => {
  // 获取文档并渲染
  const response = await fetch(wordFileUrl);
  const arrayBuffer = await response.arrayBuffer();
  await renderAsync(new Uint8Array(arrayBuffer), docxContainer.value);
});
</script>

<style scoped>
.container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.docx-container {
  width: 100%;
  max-width: 800px;
  height: auto;
  overflow: auto;
  border: 1px solid #ddd;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 20px;
}
</style>
