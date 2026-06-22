<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue: string
  fontFamily: string
  fontSize: number
  lineHeight: number
  textColor: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'save'): void
}>()

const editorRef = ref<HTMLDivElement | null>(null)

function handleInput(e: Event) {
  const target = e.target as HTMLDivElement
  emit('update:modelValue', target.innerText || '')
  emit('save')
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault()
    emit('save')
  }
  
  if (e.key === 'Enter') {
    e.preventDefault()
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode('\n'))
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    emit('update:modelValue', editorRef.value?.innerText || '')
    emit('save')
  }
}

function handleClick(e: MouseEvent) {
  const editor = editorRef.value
  if (!editor) return
  
  editor.focus()
  
  nextTick(() => {
    const selection = window.getSelection()
    if (!selection) return
    
    const range = document.caretRangeFromPoint?.(e.clientX, e.clientY)
    if (range) {
      selection.removeAllRanges()
      selection.addRange(range)
    }
  })
}

function focusEditor() {
  nextTick(() => {
    editorRef.value?.focus()
  })
}

watch(() => props.modelValue, (newValue) => {
  if (editorRef.value && editorRef.value.innerText !== newValue) {
    editorRef.value.innerText = newValue
  }
}, { immediate: true })

onMounted(() => {
  if (props.modelValue) {
    editorRef.value!.innerText = props.modelValue
  }
  focusEditor()
})

defineExpose({ focusEditor })
</script>

<template>
  <div class="editor-wrapper">
    <div
      ref="editorRef"
      class="editor-content"
      contenteditable="true"
      spellcheck="false"
      @click="handleClick"
      @input="handleInput"
      @keydown="handleKeydown"
      :style="{
        fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}px`,
        color: textColor
      }"
      :data-placeholder="modelValue ? '' : '点击开始书写...'"
    />
  </div>
</template>

<style scoped>
.editor-wrapper {
  width: 100%;
  min-height: calc(100vh - 120px);
  padding: 0;
  margin: 0;
  padding-top: 72px;
}

.editor-content {
  outline: none;
  min-height: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  white-space-collapse: preserve;
  text-wrap: preserve;
  word-break: break-word;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'KaiTi', 'STKaiti', 'SimSun', 'SimHei', serif;
  padding: 0;
  margin: 0;
}

.editor-content:empty::before {
  content: attr(data-placeholder);
  color: rgba(0, 0, 0, 0.2);
  pointer-events: none;
  font-style: italic;
}

.editor-content:focus {
  outline: none;
}

/* 光标样式 */
.editor-content {
  caret-color: currentColor;
}

/* 选中文本样式 */
.editor-content ::selection,
.editor-content::-moz-selection {
  background-color: rgba(180, 140, 100, 0.3);
}
</style>