<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  bgColor: string
  lineColor: string
  lineHeight: number
  paperWidth: number
}>()

const gridStyle = computed(() => {
  const size = props.lineHeight
  const color = props.lineColor
  const lightColor = adjustColor(color, 50)
  
  return {
    backgroundImage: `
      linear-gradient(to bottom, ${color} 2px, transparent 2px),
      linear-gradient(to right, ${color} 2px, transparent 2px),
      linear-gradient(to bottom, ${lightColor} 1px, transparent 1px),
      linear-gradient(to right, ${lightColor} 1px, transparent 1px)
    `,
    backgroundSize: `${size}px ${size}px, ${size}px ${size}px, ${size}px ${size}px, ${size}px ${size}px`,
    backgroundPosition: '0 0, 0 0, 0 0, 0 0',
    backgroundColor: props.bgColor
  }
})

function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount)
  const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount)
  const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
</script>

<template>
  <div class="paper-container" :style="gridStyle">
    <div class="paper-inner" :style="{ maxWidth: `${paperWidth}px` }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.paper-container {
  width: 100%;
  min-height: calc(100vh - 72px - 50px);
  background-repeat: repeat;
  padding: 0;
}

.paper-inner {
  margin: 0 auto;
  min-height: 100%;
}
</style>