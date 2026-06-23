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
  const darkColor = props.lineColor
  const lightColor = lightenColor(props.lineColor, 40)

  return {
    backgroundImage: `
      linear-gradient(to right, ${darkColor} 2px, transparent 2px),
      linear-gradient(to bottom, ${darkColor} 2px, transparent 2px),
      linear-gradient(to right, ${lightColor} 1px, transparent 1px),
      linear-gradient(to bottom, ${lightColor} 1px, transparent 1px)
    `,
    backgroundSize: `${size}px ${size}px, ${size}px ${size}px, ${size}px ${size}px, ${size}px ${size}px`,
    backgroundPosition: '0 0, 0 0, 0 0, 0 0',
    backgroundColor: props.bgColor
  }
})

function lightenColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + amount)
  const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + amount)
  const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + amount)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
</script>

<template>
  <div class="paper-wrapper">
    <div class="paper-bg" :style="gridStyle">
      <div class="paper-content" :style="{ width: `${paperWidth}px` }">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.paper-wrapper {
  width: 100%;
}

.paper-bg {
  width: 100%;
  background-repeat: repeat;
  padding: 20px 0;
}

.paper-content {
  margin: 0 auto;
}
</style>
