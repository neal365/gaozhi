<script setup lang="ts">
import { ref } from 'vue'
import { 
  Type, 
  Palette, 
  Maximize2, 
  Minimize2, 
  Download, 
  Save, 
  FileText,
  Plus,
  ChevronDown
} from 'lucide-vue-next'
import type { ThemeType, FontStyle } from '../types'

defineProps<{
  currentTheme: ThemeType
  themes: { name: string; value: ThemeType; description: string }[]
  currentFontStyle: FontStyle
  fonts: { name: string; value: FontStyle; description: string; className: string }[]
  isFullscreen: boolean
  showToolbar: boolean
}>()

const emit = defineEmits<{
  (e: 'setTheme', theme: ThemeType): void
  (e: 'setFontStyle', font: FontStyle): void
  (e: 'toggleFullscreen'): void
  (e: 'save'): void
  (e: 'export'): void
  (e: 'newDoc'): void
}>()

const showThemeMenu = ref(false)
const showFontMenu = ref(false)
const showExportMenu = ref(false)

function toggleThemeMenu() {
  showThemeMenu.value = !showThemeMenu.value
  showFontMenu.value = false
  showExportMenu.value = false
}

function toggleFontMenu() {
  showFontMenu.value = !showFontMenu.value
  showThemeMenu.value = false
  showExportMenu.value = false
}

function toggleExportMenu() {
  showExportMenu.value = !showExportMenu.value
  showThemeMenu.value = false
  showFontMenu.value = false
}

function selectTheme(theme: ThemeType) {
  emit('setTheme', theme)
  showThemeMenu.value = false
}

function selectFont(font: FontStyle) {
  emit('setFontStyle', font)
  showFontMenu.value = false
}

function closeMenus() {
  showThemeMenu.value = false
  showFontMenu.value = false
  showExportMenu.value = false
}
</script>

<template>
  <Transition name="slide-down">
    <div 
      v-if="showToolbar"
      class="toolbar fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-line-light shadow-sm"
    >
      <div class="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xl font-bold text-accent tracking-wide">FlowState</span>
          <span class="text-sm text-gray-500">心流写作</span>
        </div>
        
        <div class="flex items-center gap-2">
          <button
            class="toolbar-btn relative"
            @click="toggleThemeMenu"
          >
            <Palette :size="20" />
            <span class="btn-text">主题</span>
            <ChevronDown :size="14" class="ml-1" />
            
            <Transition name="dropdown">
              <div 
                v-if="showThemeMenu"
                class="dropdown-menu absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-line-light py-1"
                @click.stop
              >
                <button
                  v-for="theme in themes"
                  :key="theme.value"
                  class="dropdown-item w-full px-4 py-2 text-left hover:bg-rice-paper"
                  :class="{ 'bg-accent/10': currentTheme === theme.value }"
                  @click="selectTheme(theme.value)"
                >
                  <div class="font-medium text-text-primary">{{ theme.name }}</div>
                  <div class="text-xs text-gray-500">{{ theme.description }}</div>
                </button>
              </div>
            </Transition>
          </button>
          
          <button
            class="toolbar-btn relative"
            @click="toggleFontMenu"
          >
            <Type :size="20" />
            <span class="btn-text">字体</span>
            <ChevronDown :size="14" class="ml-1" />
            
            <Transition name="dropdown">
              <div 
                v-if="showFontMenu"
                class="dropdown-menu absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-line-light py-1"
                @click.stop
              >
                <button
                  v-for="font in fonts"
                  :key="font.value"
                  class="dropdown-item w-full px-4 py-2 text-left hover:bg-rice-paper"
                  :class="[
                    font.className,
                    { 'bg-accent/10': currentFontStyle === font.value }
                  ]"
                  @click="selectFont(font.value)"
                >
                  <div class="font-medium text-text-primary">{{ font.name }}</div>
                  <div class="text-xs text-gray-500">{{ font.description }}</div>
                </button>
              </div>
            </Transition>
          </button>
          
          <div class="w-px h-6 bg-line-light mx-2" />
          
          <button
            class="toolbar-btn"
            @click="emit('newDoc')"
            title="新建文档"
          >
            <Plus :size="20" />
            <span class="btn-text">新建</span>
          </button>
          
          <button
            class="toolbar-btn"
            @click="emit('save')"
            title="保存"
          >
            <Save :size="20" />
            <span class="btn-text">保存</span>
          </button>
          
          <button
            class="toolbar-btn relative"
            @click="toggleExportMenu"
          >
            <Download :size="20" />
            <span class="btn-text">导出</span>
            <ChevronDown :size="14" class="ml-1" />
            
            <Transition name="dropdown">
              <div 
                v-if="showExportMenu"
                class="dropdown-menu absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-line-light py-1"
                @click.stop
              >
                <button
                  class="dropdown-item w-full px-4 py-2 text-left hover:bg-rice-paper flex items-center gap-2"
                  @click="emit('export')"
                >
                  <FileText :size="16" />
                  <span>导出为 TXT</span>
                </button>
                <button
                  class="dropdown-item w-full px-4 py-2 text-left hover:bg-rice-paper flex items-center gap-2"
                  @click="emit('export')"
                >
                  <FileText :size="16" />
                  <span>导出为 Markdown</span>
                </button>
              </div>
            </Transition>
          </button>
          
          <div class="w-px h-6 bg-line-light mx-2" />
          
          <button
            class="toolbar-btn"
            @click="emit('toggleFullscreen')"
            :title="isFullscreen ? '退出全屏' : '全屏模式'"
          >
            <Minimize2 v-if="isFullscreen" :size="20" />
            <Maximize2 v-else :size="20" />
            <span class="btn-text">{{ isFullscreen ? '退出' : '全屏' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
  
  <div 
    v-if="showThemeMenu || showFontMenu || showExportMenu"
    class="fixed inset-0 z-40"
    @click="closeMenus"
  />
</template>

<style scoped>
.toolbar-btn {
  @apply flex items-center gap-1 px-3 py-2 text-text-primary hover:bg-rice-paper rounded-lg transition-colors duration-200;
}

.btn-text {
  @apply text-sm font-medium hidden sm:inline;
}

.dropdown-menu {
  min-width: 180px;
}

.dropdown-item {
  transition: background-color 0.2s;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>
