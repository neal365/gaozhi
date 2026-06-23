<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'

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

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const colsPerLine = 20
const rowsPerPage = 20

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${colsPerLine}, ${props.lineHeight}px)`,
  gridTemplateRows: `repeat(${rowsPerPage}, ${props.lineHeight}px)`,
}))

const textareaStyle = computed(() => ({
  fontFamily: props.fontFamily,
  fontSize: `${props.fontSize}px`,
  lineHeight: `${props.lineHeight}px`,
  color: 'transparent',
  caretColor: props.textColor,
  width: `${colsPerLine * props.lineHeight}px`,
  height: `${rowsPerPage * props.lineHeight}px`,
  letterSpacing: `${props.lineHeight - props.fontSize}px`,
}))

function getCellText(row: number, col: number): string {
  const index = row * colsPerLine + col
  return props.modelValue[index] || ''
}

function handleInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('save')
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault()
    emit('save')
    return
  }

  if (e.key === 'Enter') {
    e.preventDefault()
    const target = e.target as HTMLTextAreaElement
    const pos = target.selectionStart
    const newValue = props.modelValue.slice(0, pos) + '  \n' + props.modelValue.slice(pos)
    emit('update:modelValue', newValue)
    emit('save')
    nextTick(() => {
      target.selectionStart = pos + 3
      target.selectionEnd = pos + 3
    })
    return
  }
}

function focusEditor() {
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

watch(() => props.modelValue, (newValue) => {
  if (textareaRef.value && textareaRef.value.value !== newValue) {
    const pos = textareaRef.value.selectionStart
    textareaRef.value.value = newValue
    textareaRef.value.selectionStart = pos
    textareaRef.value.selectionEnd = pos
  }
})

onMounted(() => {
  focusEditor()
})

defineExpose({ focusEditor })
</script>

<template>
  <div class="editor-wrapper">
    <div class="grid-display" :style="gridStyle">
      <div
        v-for="row in rowsPerPage"
        :key="`row-${row}`"
        class="grid-row"
      >
        <div
          v-for="col in colsPerLine"
          :key="`cell-${row}-${col}`"
          class="grid-cell"
          :style="{
            fontFamily,
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeight}px`,
            color: textColor,
            width: `${lineHeight}px`,
            height: `${lineHeight}px`
          }"
        >
          {{ getCellText(row - 1, col - 1) }}
        </div>
      </div>
    </div>
    <textarea
      ref="textareaRef"
      class="editor-textarea"
      :style="textareaStyle"
      :value="modelValue"
      spellcheck="false"
      @input="handleInput"
      @keydown="handleKeydown"
    />
  </div>
</template>

<style scoped>
.editor-wrapper {
  position: relative;
  width: fit-content;
  margin: 0 auto;
}

.grid-display {
  position: relative;
  z-index: 1;
}

.grid-row {
  display: contents;
}

.grid-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'KaiTi', 'STKaiti', 'SimSun', 'SimHei', serif;
  overflow: hidden;
  white-space: pre;
  pointer-events: none;
}

.editor-textarea {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  white-space: pre-wrap;
  word-wrap: break-word;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'KaiTi', 'STKaiti', 'SimSun', 'SimHei', serif;
}

.editor-textarea::selection {
  background-color: rgba(180, 140, 100, 0.3);
}

.editor-textarea::-moz-selection {
  background-color: rgba(180, 140, 100, 0.3);
}
</style>
