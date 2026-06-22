<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  bgColor: string
  lineColor: string
  lineHeight: number
  paperWidth: number
}>()

const paperStyle = computed(() => {
  const size = props.lineHeight
  const color = props.lineColor
  
  return {
    backgroundImage: `
      /* 横向线条 */
      linear-gradient(to bottom, ${color} 1px, transparent 1px)
    `,
    backgroundSize: `100% ${size}px`,
    backgroundPosition: `0 ${size - 1}px`,
    backgroundColor: props.bgColor
  }
})
</script>

<template>
  <div 
    class="paper-container"
    :style="paperStyle"
  >
    <!-- 左侧红色边线装饰 -->
    <div class="red-margin-line" />
    
    <!-- 纸张内容区域 -->
    <div 
      class="paper-content"
      :style="{ width: `${paperWidth}px` }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.paper-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 100vh;
  background-repeat: repeat-x;
  overflow-x: hidden;
}

.red-margin-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(180, 80, 80, 0.6) 0%,
    rgba(200, 100, 100, 0.5) 10%,
    rgba(180, 80, 80, 0.6) 20%,
    rgba(200, 100, 100, 0.5) 30%,
    rgba(180, 80, 80, 0.6) 40%,
    rgba(200, 100, 100, 0.5) 50%,
    rgba(180, 80, 80, 0.6) 60%,
    rgba(200, 100, 100, 0.5) 70%,
    rgba(180, 80, 80, 0.6) 80%,
    rgba(200, 100, 100, 0.5) 90%,
    rgba(180, 80, 80, 0.6) 100%
  );
  pointer-events: none;
  z-index: 1;
}

.paper-content {
  position: relative;
  margin: 0 auto;
  min-height: 100vh;
  padding-left: 20px;
  box-sizing: border-box;
}
</style>