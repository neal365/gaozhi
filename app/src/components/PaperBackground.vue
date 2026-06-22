<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  bgColor: string
  lineColor: string
  lineHeight: number
  paperWidth: number
}>()

const svgContent = computed(() => {
  const cellSize = props.lineHeight
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${cellSize}' height='${cellSize}'%3E%3Cdefs%3E%3Cpattern id='grid-paper' patternUnits='userSpaceOnUse' width='${cellSize}' height='${cellSize}'%3E%3Cpath d='M ${cellSize} 0 L 0 0 0 ${cellSize}' fill='none' stroke='${encodeURIComponent(props.lineColor)}' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid-paper)'/%3E%3C/svg%3E`
})
</script>

<template>
  <div 
    class="absolute inset-0 paper-container"
    :style="{ backgroundColor: bgColor }"
  >
    <div 
      class="absolute inset-0 paper-lines"
      :style="{ backgroundImage: `url(${svgContent})` }"
    />
    <div class="absolute inset-0 paper-texture" />
    <div 
      class="relative mx-auto h-full overflow-hidden"
      :style="{ width: `${paperWidth}px`, maxWidth: '100%' }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.paper-container {
  min-height: 100vh;
}

.paper-lines {
  background-repeat: repeat-y;
}
</style>
