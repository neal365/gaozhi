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
  
  return {
    backgroundImage: `
      linear-gradient(to bottom, ${color} 1px, transparent 1px)
    `,
    backgroundSize: `100% ${size}px`,
    backgroundPosition: '0 0',
    backgroundColor: props.bgColor
  }
})
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
  background-repeat: repeat-y;
  padding: 0;
}

.paper-inner {
  margin: 0 auto;
  min-height: 100%;
}
</style>