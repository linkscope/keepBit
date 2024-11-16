<template>
  <div class="container">
    <div ref="docxContainer" class="docx-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // 用于获取路由参数
import { renderAsync } from 'docx-preview';

const route = useRoute(); // 获取当前路由信息
const docxContainer = ref(null);

onMounted(async () => {
  // 从路由参数中获取文档名称
  const fileName = route.query.fileName; // 例如：KeepBitRecharge.docx

  if (!fileName) {
    console.error('未提供文件名称参数');
    return;
  }

  const wordFileUrl = `./file/${fileName}`; // 构建相对路径
  try {
    const response = await fetch(wordFileUrl);
    if (!response.ok) {
      throw new Error(`无法加载文件: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    await renderAsync(new Uint8Array(arrayBuffer), docxContainer.value);
  } catch (error) {
    console.error('渲染 Word 文档时出错:', error);
  }
});
</script>

<style scoped>
/* 父容器样式：占满屏幕 */
.container {
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  width: 100vw; /* 占满视口宽度 */
  height: 100vh; /* 占满视口高度 */
  margin: 0;
  padding: 0;
  background-color: #f9f9f9; /* 背景颜色 */
  box-sizing: border-box;
  overflow: hidden; /* 防止外部溢出 */
}

/* 文档容器样式：全屏占满 */
.docx-container {
  width: 100%; /* 宽度占满父容器 */
  height: 100%; /* 高度占满父容器 */
  overflow: auto; /* 支持滚动 */
  background-color: #fff; /* 文档背景白色 */
  box-sizing: border-box; /* 包括内边距在内计算宽高 */
  padding: 16px; /* 可选的内边距 */
}

/* 针对小屏幕的适配 */
@media (max-width: 768px) {
  .docx-container {
    padding: 12px; /* 缩小内边距适配小屏幕 */
  }
}

@media (max-width: 480px) {
  .docx-container {
    padding: 8px; /* 更小屏幕进一步缩小内边距 */
  }
}
</style>
