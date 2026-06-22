<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  bgColor: string
  lineColor: string
  lineHeight: number
  paperWidth: number
}>()

// 田字格大小 = 4倍的行高（20×20 = 4个格子 × 5行高 = 20）
const gridSize = computed(() => props.lineHeight * 4)

const paperStyle = computed(() => {
  const size = gridSize.value
  const smallSize = props.lineHeight
  const color = props.lineColor
  
  return {
    backgroundImage: `
      /* 大格子边框（田字格） */
      linear-gradient(${color}, ${color} 1px, transparent 1px, transparent 100%),
      linear-gradient(90deg, ${color}, ${color} 1px, transparent 1px, transparent 100%),
      /* 小格子分割线（米字格的对角线效果用中心十字线代替） */
      linear-gradient(${color}, ${color} 1px, transparent 1px, transparent 100%),
      linear-gradient(90deg, ${color}, ${color} 1px, transparent 1px, transparent 100%)
    `,
    backgroundSize: `
      ${size}px ${size}px,
      ${size}px ${size}px,
      ${smallSize}px ${smallSize}px,
      ${smallSize}px ${smallSize}px
    `,
    backgroundPosition: `
      -1px -1px,
      -1px -1px,
      -1px -1px,
      -1px -1px
    `,
    backgroundColor: props.bgColor
  }
})
</script>

<template>
  <div 
    class="paper-container"
    :style="paperStyle"
  >
    <slot />
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
  background-repeat: repeat;
}
</style>