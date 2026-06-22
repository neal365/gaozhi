<script setup lang="ts">
import { computed } from 'vue'
import { FileText, Clock, Save } from 'lucide-vue-next'
import { formatTime } from '../utils/helpers'

const props = defineProps<{
  wordCount: number
  writingTime: number
  lastSaveTime: Date | null
  showStatusBar: boolean
}>()

const formattedTime = computed(() => formatTime(props.writingTime))

const currentTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
  <Transition name="slide-up">
    <div 
      v-if="showStatusBar"
      class="status-bar fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-line-light"
    >
      <div class="max-w-5xl mx-auto px-6 py-2 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <FileText :size="16" />
            <span>{{ wordCount }} 字</span>
          </div>
          
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <Clock :size="16" />
            <span>{{ formattedTime }}</span>
          </div>
        </div>
        
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <Clock :size="16" />
            <span>{{ currentTime }}</span>
          </div>
          
          <div v-if="lastSaveTime" class="flex items-center gap-2 text-sm text-gray-500">
            <Save :size="16" />
            <span>已保存</span>
          </div>
          <div v-else class="flex items-center gap-2 text-sm text-gray-400">
            <Save :size="16" />
            <span>未保存</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
