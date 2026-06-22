<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'

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

const cellSize = computed(() => props.lineHeight)

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
    insertNewLineWithIndent()
  }
  
  if (e.key === 'Backspace') {
    handleBackspace(e)
  }
}

function insertNewLineWithIndent() {
  const selection = window.getSelection()
  if (!selection || !selection.rangeCount) return
  
  const editor = editorRef.value
  if (!editor) return
  
  const indent = '　　'
  const text = editor.innerText || ''
  const cursorPos = getCursorPosition(editor)
  const lines = text.split('\n')
  
  const currentLineIndex = lines.findIndex((_, i) => {
    const lineLength = lines.slice(0, i + 1).reduce((acc, l) => acc + l.length + 1, 0)
    return lineLength > cursorPos
  })
  
  const lineStart = lines.slice(0, currentLineIndex).reduce((acc, l) => acc + l.length + 1, 0)
  const lineEnd = lineStart + (lines[currentLineIndex]?.length || 0)
  
  let newText = ''
  if (cursorPos <= lineStart) {
    newText = text.slice(0, lineStart) + '\n' + indent + text.slice(lineStart)
  } else if (cursorPos >= lineEnd) {
    newText = text.slice(0, lineEnd) + '\n' + indent + text.slice(lineEnd)
  } else {
    newText = text.slice(0, cursorPos) + '\n' + indent + text.slice(cursorPos)
  }
  
  editor.innerText = newText
  emit('update:modelValue', newText)
  emit('save')
  
  nextTick(() => {
    const newCursorPos = cursorPos + 1 + indent.length
    setCursorPosition(editor, newCursorPos)
  })
}

function handleBackspace(e: KeyboardEvent) {
  const editor = editorRef.value
  if (!editor) return
  
  const text = editor.innerText || ''
  const cursorPos = getCursorPosition(editor)
  
  if (cursorPos > 0) {
    const prevChar = text[cursorPos - 1]
    if (prevChar === '\n') {
      e.preventDefault()
      const lines = text.split('\n')
      const lineIndex = lines.findIndex((_, i) => {
        const lineLength = lines.slice(0, i + 1).reduce((acc, l) => acc + l.length + 1, 0)
        return lineLength > cursorPos
      })
      
      if (lineIndex > 0) {
        const newText = lines.slice(0, lineIndex - 1).join('\n') + lines[lineIndex - 1] + lines[lineIndex] + lines.slice(lineIndex + 1).join('\n')
        
        editor.innerText = newText
        emit('update:modelValue', newText)
        emit('save')
        
        nextTick(() => {
          setCursorPosition(editor, cursorPos - 1 - (lines[lineIndex - 1]?.length || 0))
        })
      }
    }
  }
}

function getCursorPosition(element: HTMLElement): number {
  const selection = window.getSelection()
  if (!selection || !selection.rangeCount) return 0
  
  const range = selection.getRangeAt(0)
  const preCaretRange = range.cloneRange()
  preCaretRange.selectNodeContents(element)
  preCaretRange.setEnd(range.endContainer, range.endOffset)
  
  const tempDiv = document.createElement('div')
  tempDiv.appendChild(preCaretRange.cloneContents())
  return tempDiv.textContent?.length || 0
}

function setCursorPosition(element: HTMLElement, position: number) {
  const selection = window.getSelection()
  if (!selection) return
  
  const range = document.createRange()
  range.selectNodeContents(element)
  
  let charCount = 0
  let node: Node | null = element.firstChild
  
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const textNode = node as Text
      if (charCount + textNode.length >= position) {
        range.setStart(textNode, position - charCount)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
        return
      }
      charCount += textNode.length
    }
    node = node.nextSibling
  }
  
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}

function handleClick(e: MouseEvent) {
  const editor = editorRef.value
  if (!editor) return
  
  editor.focus()
  
  const selection = window.getSelection()
  if (!selection) return
  
  const range = document.caretRangeFromPoint(e.clientX, e.clientY)
  if (range) {
    selection.removeAllRanges()
    selection.addRange(range)
  }
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
})

onMounted(() => {
  focusEditor()
})

defineExpose({ focusEditor })
</script>

<template>
  <div class="editor-wrapper" @click="handleClick">
    <div
      ref="editorRef"
      class="editor-content editor-cursor"
      contenteditable="true"
      spellcheck="false"
      @input="handleInput"
      @keydown="handleKeydown"
      :style="{
        fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}px`,
        color: textColor,
        minHeight: '100%',
        letterSpacing: `${cellSize - fontSize * 0.8}px`
      }"
      :data-placeholder="modelValue ? '' : '点击格子开始书写...'"
    />
  </div>
</template>

<style scoped>
.editor-wrapper {
  padding: 40px;
  min-height: calc(100vh - 120px);
  cursor: text;
  letter-spacing: 20px;
}

.editor-content {
  outline: none;
  min-height: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  cursor: text;
  font-size: 28px;
  line-height: 48px;
  letter-spacing: 20px;
  text-align: left;
  padding-left: 0;
  margin-left: 0;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  writing-mode: horizontal-tb;
  font-family: 'KaiTi', 'STKaiti', 'SimHei', sans-serif;
}

.editor-content:empty::before {
  content: attr(data-placeholder);
  color: #aaa;
  pointer-events: none;
  font-size: 28px;
  line-height: 48px;
  letter-spacing: 20px;
}

.editor-content:focus {
  outline: none;
}

.editor-cursor {
  caret-color: currentColor;
  caret-shape: bar;
}

.editor-content::selection {
  background-color: rgba(139, 115, 85, 0.3);
}
</style>
