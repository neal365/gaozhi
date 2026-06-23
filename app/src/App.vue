<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Toolbar from './components/Toolbar.vue'
import StatusBar from './components/StatusBar.vue'
import PaperBackground from './components/PaperBackground.vue'
import Editor from './components/Editor.vue'
import { useTheme } from './composables/useTheme'
import { useFont } from './composables/useFont'
import { useEditor } from './composables/useEditor'

const { currentTheme, themes, bgColor, textColor, lineColor, setTheme, loadTheme } = useTheme()
const { currentFontStyle, fonts, fontSize, fontFamily, setFontStyle, loadFontSettings } = useFont()
const { content, wordCount, writingTime, lastSaveTime, updateContent, saveCurrentDocument, createNewDoc, exportDocument } = useEditor()

const isFullscreen = ref(false)
const showToolbar = ref(true)
const showStatusBar = ref(true)

const lineHeight = 48
const paperWidth = 960

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
    showToolbar.value = false
    showStatusBar.value = false
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
    showToolbar.value = true
    showStatusBar.value = true
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen()
  }
  
  if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
    e.preventDefault()
    toggleFullscreen()
  }
}

function handleExport() {
  exportDocument('txt')
}

function handleNewDoc() {
  createNewDoc()
}

onMounted(() => {
  loadTheme()
  loadFontSettings()
  document.addEventListener('keydown', handleKeydown)
  
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

watch(bgColor, (newColor) => {
  document.body.style.backgroundColor = newColor
})
</script>

<template>
  <div class="app-container min-h-screen" :style="{ backgroundColor: bgColor }">
    <Toolbar
      :current-theme="currentTheme"
      :themes="themes"
      :current-font-style="currentFontStyle"
      :fonts="fonts"
      :is-fullscreen="isFullscreen"
      :show-toolbar="showToolbar"
      @set-theme="setTheme"
      @set-font-style="setFontStyle"
      @toggle-fullscreen="toggleFullscreen"
      @save="saveCurrentDocument"
      @export="handleExport"
      @new-doc="handleNewDoc"
    />
    
    <div 
      class="relative"
      :style="{ 
        paddingTop: showToolbar ? '72px' : '20px',
        paddingBottom: showStatusBar ? '50px' : '20px'
      }"
    >
      <PaperBackground
        :bg-color="bgColor"
        :line-color="lineColor"
        :line-height="lineHeight"
        :paper-width="paperWidth"
      >
        <Editor
          v-model="content"
          :font-family="fontFamily"
          :font-size="fontSize"
          :line-height="lineHeight"
          :text-color="textColor"
          @update:model-value="updateContent"
          @save="saveCurrentDocument"
        />
      </PaperBackground>
    </div>
    
    <StatusBar
      :word-count="wordCount"
      :writing-time="writingTime"
      :last-save-time="lastSaveTime"
      :show-status-bar="showStatusBar"
    />
  </div>
</template>

<style scoped>
.app-container {
  transition: background-color 0.3s ease;
}
</style>
