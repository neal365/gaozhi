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
  const gradient = `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`
  
  return {
    backgroundImage: gradient,
    backgroundSize: `${size}px ${size}px`,
    backgroundColor: props.bgColor
  }
})
</script>

<template>
  <div 
    class="paper-container"
    :style="gridStyle"
  >
    <div class="paper-texture" />
    <div 
      class="paper-content"
      :style="{ width: `${paperWidth}px`, maxWidth: '100%' }"
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
  background-repeat: repeat;
  background-position: 0 0;
}

.paper-texture {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.03;
  pointer-events: none;
}

.paper-content {
  position: relative;
  margin: 0 auto;
  min-height: 100vh;
}
</style>
