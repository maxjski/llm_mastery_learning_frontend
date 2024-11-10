<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { extractTextFromFile } from '@/utils/fileUtils'
import { generateTopicDraft } from '@/services/topicService'
import type { TopicDraftResponse } from '@/services/topicService'
import { useCourseStore } from '@/stores/courseStore'

interface Source {
  id: string
  name: string
  type: string
  content: string | File
}

const sources = ref<Source[]>([])
const dragActive = ref(false)

const showPasteModal = ref(false)
const pastedText = ref('')

const showLinkModal = ref(false)
const linkUrl = ref('')
const linkTitle = ref('')
const textTitle = ref('')

const topicName = ref('')
const isGenerating = ref(false)

const courseStore = useCourseStore()
const selectedCourseId = ref<number | null>(null)

const emit = defineEmits<{
  'draft-generated': [draft: TopicDraftResponse]
}>()

onMounted(async () => {
  await courseStore.fetchCourses()
})

const deleteSource = (id: string) => {
  sources.value = sources.value.filter(source => source.id !== id)
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  dragActive.value = false

  const files = e.dataTransfer?.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

const handleFiles = async (files: File[]) => {
  for (const file of files) {
    if (isValidFileType(file)) {
      try {
        const extractedText = await extractTextFromFile(file)
        console.log('Extracted text:', extractedText)

        sources.value.push({
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          content: extractedText,
        })
      } catch (error) {
        alert(`Error processing file ${file.name}: ${error}`)
      }
    } else {
      alert('Invalid file type. Please upload PDF, TXT, Markdown.')
    }
  }
}

const isValidFileType = (file: File) => {
  const validTypes = ['application/pdf', 'text/plain', 'text/markdown']
  return validTypes.includes(file.type)
}

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files) {
    handleFiles(Array.from(input.files))
  }
}

const handlePasteText = () => {
  showPasteModal.value = true
}

const confirmPastedText = () => {
  if (pastedText.value.trim()) {
    sources.value.push({
      id: crypto.randomUUID(),
      name: textTitle.value.trim() || 'Pasted Text',
      type: 'text/plain',
      content: pastedText.value,
    })
    pastedText.value = ''
    textTitle.value = ''
    showPasteModal.value = false
  }
}

const handleLink = () => {
  showLinkModal.value = true
}

const confirmLink = async () => {
  if (linkUrl.value.trim()) {
    try {
      sources.value.push({
        id: crypto.randomUUID(),
        name: linkTitle.value.trim() || linkUrl.value,
        type: 'url',
        content: linkUrl.value,
      })
      linkUrl.value = ''
      linkTitle.value = ''
      showLinkModal.value = false
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      alert(`Error adding link: ${errorMessage}`)
    }
  }
}

const generateTopic = async () => {
  if (!selectedCourseId.value) {
    alert('Please select a course')
    return
  }

  if (sources.value.length === 0) {
    alert('Please add at least one source before generating a topic')
    return
  }

  if (!topicName.value.trim()) {
    alert('Please enter a topic name')
    return
  }

  isGenerating.value = true
  try {
    const draft = await generateTopicDraft(
      selectedCourseId.value,
      topicName.value,
    )
    emit('draft-generated', draft)
  } catch (error) {
    alert(
      'Error generating topic: ' +
        (error instanceof Error ? error.message : 'Unknown error'),
    )
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
  <div
    class="sources-container"
    @drop="handleDrop"
    @dragover.prevent
    @dragenter="dragActive = true"
    @dragleave="dragActive = false"
  >
    <header>
      <h1>Add learning materials</h1>
      <p>
        These materials will be used to generate a topic.
        <br />
        <span class="examples"
          >(Examples: notes, pages from textbooks, exams, questions,
          assessments, etc.)</span
        >
      </p>
    </header>

    <div class="course-selection">
      <select v-model="selectedCourseId" class="course-dropdown" required>
        <option value="" disabled selected>Select a course</option>
        <option
          v-for="course in courseStore.getCourseList"
          :key="course.id"
          :value="course.id"
        >
          {{ course.name }}
        </option>
      </select>
    </div>

    <div class="topic-name-input">
      <input
        v-model="topicName"
        type="text"
        placeholder="Enter topic name"
        class="title-input"
      />
    </div>

    <div class="input-methods">
      <label class="method-button">
        <span class="icon">📤</span>
        <div class="method-content">
          <h3>Upload Files</h3>
          <div class="sub-options">
            <span>PDF • TXT • MD</span>
          </div>
        </div>
        <input
          type="file"
          multiple
          accept=".pdf,.txt,.md"
          class="file-input"
          @change="handleFileSelect"
        />
      </label>

      <button class="method-button" @click="handleLink">
        <span class="icon">🔗</span>
        <div class="method-content">
          <h3>Add Link</h3>
          <div class="sub-options">
            <span>Website URL</span>
          </div>
        </div>
      </button>

      <button class="method-button" @click="handlePasteText">
        <span class="icon">📋</span>
        <div class="method-content">
          <h3>Paste Text</h3>
          <div class="sub-options">
            <span>Direct Input</span>
          </div>
        </div>
      </button>
    </div>

    <div v-if="showPasteModal" class="modal-overlay">
      <div class="modal">
        <h3>Paste Your Text</h3>
        <input
          v-model="textTitle"
          type="text"
          placeholder="Enter a title (optional)"
          class="title-input"
        />
        <textarea
          v-model="pastedText"
          placeholder="Paste your text here..."
          rows="10"
        ></textarea>
        <div class="modal-actions">
          <button class="secondary" @click="showPasteModal = false">
            Cancel
          </button>
          <button class="primary" @click="confirmPastedText">Add Text</button>
        </div>
      </div>
    </div>

    <div v-if="showLinkModal" class="modal-overlay">
      <div class="modal">
        <h3>Add Website Link</h3>
        <input
          v-model="linkTitle"
          type="text"
          placeholder="Enter a title (optional)"
          class="title-input"
        />
        <input
          v-model="linkUrl"
          type="url"
          placeholder="Enter website URL"
          class="title-input"
        />
        <div class="modal-actions">
          <button class="secondary" @click="showLinkModal = false">
            Cancel
          </button>
          <button class="primary" @click="confirmLink">Add Link</button>
        </div>
      </div>
    </div>

    <div v-if="sources.length > 0" class="sources-list">
      <h3>Added Sources</h3>
      <div class="source-items">
        <div v-for="source in sources" :key="source.id" class="source-item">
          <span class="source-icon">{{
            source.type.includes('text') ? '📄' : '📁'
          }}</span>
          <span class="source-name">{{ source.name }}</span>
          <button class="delete-button" @click="deleteSource(source.id)">
            ×
          </button>
        </div>
      </div>
    </div>

    <div class="generate-section" v-if="sources.length > 0">
      <button
        class="generate-button"
        @click="generateTopic"
        :disabled="isGenerating"
      >
        {{ isGenerating ? 'Generating...' : 'Generate Topic' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.sources-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;
}

header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.examples {
  color: #a0a0a0;
}

.input-methods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.method-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
}

.method-content {
  flex: 1;
}

.method-content h3 {
  margin: 0;
  font-size: 1rem;
}

.sub-options {
  font-size: 0.8rem;
  color: #a0a0a0;
  margin-top: 0.25rem;
}

.icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: #1e1e1e;
  border-radius: 20px;
  padding: 1.5rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal h3 {
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  color: #fff;
}

.title-input {
  width: calc(100% - 2rem);
  background: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.875rem 1rem;
  color: #fff;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.title-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.modal textarea {
  width: calc(100% - 2rem);
  background: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  color: #fff;
  margin: 0 0 1.5rem 0;
  resize: none;
  min-height: 150px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.modal textarea:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-actions button {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
}

.modal-actions .primary {
  background: #3b82f6;
  color: white;
}

.modal-actions .primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.modal-actions .secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-actions .secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.sources-list {
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 1.5rem;
}

.source-items {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
}

.source-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.source-icon {
  font-size: 1.25rem;
}

.source-name {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
}

.delete-button {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.delete-button:hover {
  color: rgba(255, 255, 255, 0.9);
}

.topic-name-input {
  margin-bottom: 2rem;
}

.generate-section {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.generate-button {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.generate-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.generate-button:not(:disabled):hover {
  background: #2563eb;
  transform: translateY(-1px);
}
</style>
