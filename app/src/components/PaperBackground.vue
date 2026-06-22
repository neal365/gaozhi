<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  bgColor: string
  lineColor: string
  lineHeight: number
  paperWidth: number
}>()

const svgContent = computed(() => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cpattern id='lined-paper' patternUnits='userSpaceOnUse' width='100%25' height='${props.lineHeight}'%3E%3Cline x1='0' y1='${props.lineHeight - 1}' x2='100%25' y2='${props.lineHeight - 1}' stroke='${encodeURIComponent(props.lineColor)}' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23lined-paper)'/%3E%3C/svg%3E`
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
