<script setup lang="ts">
import { ref, computed } from 'vue'

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

const colsPerLine = ref(20)
const rowsPerPage = ref(20)
const activeCell = ref<{ row: number; col: number } | null>(null)

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${colsPerLine.value}, ${props.lineHeight}px)`,
  gridTemplateRows: `repeat(${rowsPerPage.value}, ${props.lineHeight}px)`,
}))

function getCellIndex(row: number, col: number): number {
  return row * colsPerLine.value + col
}

function getCellText(row: number, col: number): string {
  const index = getCellIndex(row, col)
  return props.modelValue[index] || ''
}

function handleCellClick(row: number, col: number) {
  activeCell.value = { row, col }
}

function handleCellInput(e: Event, row: number, col: number) {
  const target = e.target as HTMLDivElement
  let text = target.innerText || ''
  
  if (text.length > 1) {
    text = text.slice(-1)
    target.innerText = text
  }
  
  const index = getCellIndex(row, col)
  const currentText = getCellText(row, col)
  
  if (text !== currentText) {
    const newValue = props.modelValue.slice(0, index) + text + props.modelValue.slice(index + 1)
    emit('update:modelValue', newValue)
    emit('save')
    
    if (text && !currentText) {
      const nextCol = col + 1
      if (nextCol < colsPerLine.value) {
        activeCell.value = { row, col: nextCol }
      } else if (row + 1 < rowsPerPage.value) {
        activeCell.value = { row: row + 1, col: 0 }
      }
    }
  }
}

function handleCellKeydown(e: KeyboardEvent, row: number, col: number) {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault()
    emit('save')
    return
  }
  
  if (e.key === 'Enter') {
    e.preventDefault()
    const nextRow = row + 1
    if (nextRow < rowsPerPage.value) {
      activeCell.value = { row: nextRow, col: 2 }
      const index = getCellIndex(nextRow, 2)
      const newValue = props.modelValue.slice(0, index) + '  ' + props.modelValue.slice(index)
      emit('update:modelValue', newValue)
      emit('save')
    }
    return
  }
  
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    const nextCol = col + 1
    if (nextCol < colsPerLine.value) {
      activeCell.value = { row, col: nextCol }
    }
    return
  }
  
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    const prevCol = col - 1
    if (prevCol >= 0) {
      activeCell.value = { row, col: prevCol }
    }
    return
  }
  
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    const prevRow = row - 1
    if (prevRow >= 0) {
      activeCell.value = { row: prevRow, col }
    }
    return
  }
  
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    const nextRow = row + 1
    if (nextRow < rowsPerPage.value) {
      activeCell.value = { row: nextRow, col }
    }
    return
  }
  
  if (e.key === 'Backspace') {
    e.preventDefault()
    const index = getCellIndex(row, col)
    const currentText = getCellText(row, col)
    
    if (!currentText) {
      if (col > 0) {
        const prevIndex = getCellIndex(row, col - 1)
        const newValue = props.modelValue.slice(0, prevIndex) + '' + props.modelValue.slice(prevIndex + 1)
        emit('update:modelValue', newValue)
        emit('save')
        activeCell.value = { row, col: col - 1 }
      } else if (row > 0) {
        const prevIndex = getCellIndex(row - 1, colsPerLine.value - 1)
        const newValue = props.modelValue.slice(0, prevIndex) + '' + props.modelValue.slice(prevIndex + 1)
        emit('update:modelValue', newValue)
        emit('save')
        activeCell.value = { row: row - 1, col: colsPerLine.value - 1 }
      }
    } else {
      const newValue = props.modelValue.slice(0, index) + '' + props.modelValue.slice(index + 1)
      emit('update:modelValue', newValue)
      emit('save')
    }
    return
  }
  
  if (e.key === 'Delete') {
    e.preventDefault()
    const index = getCellIndex(row, col)
    const newValue = props.modelValue.slice(0, index) + '' + props.modelValue.slice(index + 1)
    emit('update:modelValue', newValue)
    emit('save')
    return
  }
}

function handlePaste(e: ClipboardEvent) {
  e.preventDefault()
}
</script>

<template>
  <div
    class="editor-grid"
    :style="gridStyle"
  >
    <template v-for="row in rowsPerPage" :key="row">
      <div
        v-for="col in colsPerLine"
        :key="`${row}-${col}`"
        class="editor-cell"
        contenteditable="true"
        spellcheck="false"
        :class="{ active: activeCell?.row === row - 1 && activeCell?.col === col - 1 }"
        @click="handleCellClick(row - 1, col - 1)"
        @input="(e) => handleCellInput(e, row - 1, col - 1)"
        @keydown="(e) => handleCellKeydown(e, row - 1, col - 1)"
        @paste="handlePaste"
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
    </template>
  </div>
</template>

<style scoped>
.editor-grid {
  outline: none;
}

.editor-cell {
  outline: none;
  text-align: center;
  vertical-align: middle;
  cursor: text;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'KaiTi', 'STKaiti', 'SimSun', 'SimHei', serif;
  caret-color: currentColor;
  overflow: hidden;
  white-space: pre;
}

.editor-cell:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.editor-cell.active {
  background-color: rgba(180, 140, 100, 0.15);
}

.editor-cell:focus {
  outline: none;
}

.editor-cell::selection,
.editor-cell::-moz-selection {
  background-color: rgba(180, 140, 100, 0.3);
}

.editor-cell:empty::before {
  content: '';
  visibility: hidden;
}
</style>
