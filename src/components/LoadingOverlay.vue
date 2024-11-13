<template>
  <div v-if="modelValue" class="overlay">
    <slot>
      <!-- 默认加载动画，带闪动效果 -->
      <img class="animate-cool" src="/title_icon.png" alt="Loading" />
    </slot>
  </div>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(['update:modelValue']);

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});
</script>

<style>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

@keyframes coolAnimation {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
}

.animate-cool {
  animation: coolAnimation 1.5s infinite;
  width: 100px; /* 控制图片大小 */
  height: 100px;
}
</style>
