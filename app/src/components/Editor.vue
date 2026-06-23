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
const cells = ref<{ text: string; row: number; col: number; ref: HTMLDivElement | null }[][]>([])
const colsPerLine = ref(20)
const rowsPerPage = ref(20)
const activeCell = ref<{ row: number; col: number } | null>(null)

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${colsPerLine.value}, ${props.lineHeight}px)`,
  gridTemplateRows: `repeat(${rowsPerPage.value}, ${props.lineHeight}px)`,
}))

function initGrid() {
  const newCells: typeof cells.value = []
  for (let row = 0; row < rowsPerPage.value; row++) {
    newCells[row] = []
    for (let col = 0; col < colsPerLine.value; col++) {
      const pos = row * colsPerLine.value + col
      newCells[row][col] = {
        text: props.modelValue[pos] || '',
        row,
        col,
        ref: null
      }
    }
  }
  cells.value = newCells
}

function handleCellClick(row: number, col: number) {
  activeCell.value = { row, col }
  const cell = cells.value[row]?.[col]
  if (cell?.ref) {
    cell.ref.focus()
    nextTick(() => {
      const range = document.createRange()
      range.selectNodeContents(cell.ref!)
      range.collapse(false)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    })
  }
}

function handleCellInput(e: Event, row: number, col: number) {
  const target = e.target as HTMLDivElement
  const oldText = cells.value[row][col].text
  let newText = target.innerText || ''
  
  if (newText.length > 1) {
    newText = newText.slice(-1)
    target.innerText = newText
  }
  
  if (newText && !oldText) {
    cells.value[row][col].text = newText
    
    const nextCol = col + 1
    if (nextCol < colsPerLine.value) {
      activeCell.value = { row, col: nextCol }
      focusCell(row, nextCol)
    } else if (row + 1 < rowsPerPage.value) {
      activeCell.value = { row: row + 1, col: 0 }
      focusCell(row + 1, 0)
    }
  } else if (!newText && oldText) {
    cells.value[row][col].text = ''
  } else if (newText && newText !== oldText) {
    cells.value[row][col].text = newText
  }
  
  updateContent()
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
      focusCell(nextRow, 2)
      cells.value[nextRow][2].text = ''
      updateContent()
    }
    return
  }
  
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    const nextCol = col + 1
    if (nextCol < colsPerLine.value) {
      activeCell.value = { row, col: nextCol }
      focusCell(row, nextCol)
    }
    return
  }
  
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    const prevCol = col - 1
    if (prevCol >= 0) {
      activeCell.value = { row, col: prevCol }
      focusCell(row, prevCol)
    }
    return
  }
  
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    const prevRow = row - 1
    if (prevRow >= 0) {
      activeCell.value = { row: prevRow, col }
      focusCell(prevRow, col)
    }
    return
  }
  
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    const nextRow = row + 1
    if (nextRow < rowsPerPage.value) {
      activeCell.value = { row: nextRow, col }
      focusCell(nextRow, col)
    }
    return
  }
  
  if (e.key === 'Backspace') {
    e.preventDefault()
    if (!cells.value[row][col].text) {
      if (col > 0) {
        cells.value[row][col - 1].text = ''
        activeCell.value = { row, col: col - 1 }
        focusCell(row, col - 1)
      } else if (row > 0) {
        cells.value[row - 1][colsPerLine.value - 1].text = ''
        activeCell.value = { row: row - 1, col: colsPerLine.value - 1 }
        focusCell(row - 1, colsPerLine.value - 1)
      }
    } else {
      cells.value[row][col].text = ''
      const target = e.target as HTMLDivElement
      target.innerText = ''
    }
    updateContent()
    return
  }
  
  if (e.key === 'Delete') {
    e.preventDefault()
    cells.value[row][col].text = ''
    const target = e.target as HTMLDivElement
    target.innerText = ''
    updateContent()
    return
  }
}

function focusCell(row: number, col: number) {
  nextTick(() => {
    const cell = cells.value[row]?.[col]
    if (cell?.ref) {
      cell.ref.focus()
      const range = document.createRange()
      range.selectNodeContents(cell.ref!)
      range.collapse(false)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  })
}

function updateContent() {
  const text = cells.value.flat().map(cell => cell.text).join('')
  emit('update:modelValue', text)
  emit('save')
}

watch(() => props.modelValue, (newValue) => {
  for (let row = 0; row < rowsPerPage.value; row++) {
    for (let col = 0; col < colsPerLine.value; col++) {
      const pos = row * colsPerLine.value + col
      cells.value[row]?.[col] && (cells.value[row][col].text = newValue[pos] || '')
    }
  }
}, { immediate: true })

onMounted(() => {
  initGrid()
})

defineExpose({ focusCell })
</script>

<template>
  <div
    ref="editorRef"
    class="editor-grid"
    :style="gridStyle"
  >
    <div
      v-for="row in rowsPerPage"
      :key="row"
      class="editor-row"
    >
      <div
        v-for="col in colsPerLine"
        :key="col"
        class="editor-cell"
        contenteditable="true"
        spellcheck="false"
        :class="{ active: activeCell?.row === row - 1 && activeCell?.col === col - 1 }"
        @click="handleCellClick(row - 1, col - 1)"
        @input="(e) => handleCellInput(e, row - 1, col - 1)"
        @keydown="(e) => handleCellKeydown(e, row - 1, col - 1)"
        :style="{
          fontFamily,
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}px`,
          color: textColor,
          width: `${lineHeight}px`,
          height: `${lineHeight}px`
        }"
      >
        {{ cells[row - 1]?.[col - 1]?.text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-grid {
  outline: none;
}

.editor-row {
  display: contents;
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
}

.editor-cell:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.editor-cell.active {
  background-color: rgba(180, 140, 100, 0.2);
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
