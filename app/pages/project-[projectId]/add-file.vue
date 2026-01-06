<script setup lang="ts">
import MainButton from '@/components/MainButton.vue'
import type { IProject } from '../../../server/models/Project'

definePageMeta({
  layout: 'project'
})

const route = useRoute()
const project = ref<IProject | null>(null)

const projectId = computed(() => route.params.projectId as string)

const form = reactive({
  projectId: projectId.value,
  fileName: '',
  content: ''
})

const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const isSubmitting = ref(false)
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const acceptedTypes = ['.txt', '.pdf', '.md']

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    await processFile(input.files[0])
  }
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false

  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    await processFile(event.dataTransfer.files[0])
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const processFile = async (file: File) => {
  // Check if it's a text-based file
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  const isTextFile = acceptedTypes.includes(extension);

  if (!isTextFile) {
    message.value = { type: 'error', text: 'Please select a supported file (.txt, .pdf, .md)' }
    return
  }

  try {
    const content = await file.text();
    selectedFile.value = file
    form.fileName = file.name
    form.content = content
    message.value = null
  } catch (error) {
    message.value = { type: 'error', text: 'Failed to read file content' }
  }
}

const clearFile = () => {
  selectedFile.value = null
  form.fileName = ''
  form.content = ''
  message.value = null
}

const handleSubmit = async () => {
  if (!form.fileName || !form.content) {
    message.value = { type: 'error', text: 'Please select a file first' }
    return
  }

  isSubmitting.value = true
  message.value = null

  try {
    const result = await $fetch<{ message: string }>('/api/addFileContext', {
      method: 'POST',
      body: form
    })

    message.value = { type: 'success', text: result.message }
    clearFile()
  } catch (error: any) {
    message.value = {
      type: 'error',
      text: error.data?.statusMessage || 'Failed to add file'
    }
  } finally {
    isSubmitting.value = false
  }
}

const getProject = async () => {
  const response = await $fetch<IProject | null>('/api/getProject', {
    method: 'GET',
    query: {
      projectId: projectId.value
    }
  })
  project.value = response
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

onMounted(async () => {
  await getProject()
})
</script>

<template>
  <ProjectHeader :title="project?.title || 'Project Detailer'" :subtitle="'Add a text document to your project'" />

  <div class="add-file-container">
    <!-- Drop Zone -->
    <div class="drop-zone" :class="{ 'dragging': isDragging, 'has-file': selectedFile }" @drop="handleDrop"
      @dragover="handleDragOver" @dragleave="handleDragLeave">
      <template v-if="!selectedFile">
        <div class="drop-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="12" y2="12" />
            <line x1="15" y1="15" x2="12" y2="12" />
          </svg>
        </div>
        <p class="drop-text">Drag & drop a text file here</p>
        <p class="drop-hint">or</p>
        <label class="browse-button">
          Browse Files
          <input type="file" :accept="acceptedTypes.join(',')" @change="handleFileSelect" hidden />
        </label>
        <p class="accepted-types">
          Supported: {{ acceptedTypes.join(', ') }}
        </p>
      </template>

      <template v-else>
        <div class="file-preview">
          <div class="file-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div class="file-info">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
          </div>
          <button class="clear-button" @click="clearFile" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </template>
    </div>

    <MainButton  v-if="selectedFile" :disabled="isSubmitting" @click="handleSubmit">
      <span v-if="isSubmitting">Adding...</span>
      <span v-else>Add to Knowledge Base</span>
    </MainButton>

    <!-- Message when no file -->
    <div v-if="message && !selectedFile" :class="['message', message.type, 'standalone']">
      {{ message.text }}
    </div>
  </div>
</template>

<style scoped>
.add-file-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.drop-zone {
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.drop-zone:hover {
  border-color: rgba(233, 69, 96, 0.4);
  background: rgba(233, 69, 96, 0.05);
}

.drop-zone.dragging {
  border-color: #e94560;
  background: rgba(233, 69, 96, 0.1);
  transform: scale(1.01);
}

.drop-zone.has-file {
  border-style: solid;
  border-color: rgba(46, 213, 115, 0.4);
  background: rgba(46, 213, 115, 0.05);
  padding: 1.5rem;
  cursor: default;
}

.drop-icon {
  color: #606070;
  margin-bottom: 1rem;
}

.drop-zone.dragging .drop-icon {
  color: #e94560;
}

.drop-text {
  color: #e0e0e0;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.drop-hint {
  color: #606070;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.browse-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #e94560, #c23a51);
  color: white;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.browse-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(233, 69, 96, 0.3);
}

.accepted-types {
  color: #505060;
  font-size: 0.8rem;
  margin-top: 1.25rem;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon {
  color: #2ed573;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  text-align: left;
  min-width: 0;
}

.file-name {
  display: block;
  color: #e0e0e0;
  font-weight: 500;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  display: block;
  color: #707080;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.clear-button {
  background: rgba(255, 71, 87, 0.15);
  border: 1px solid rgba(255, 71, 87, 0.3);
  color: #ff4757;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.clear-button:hover {
  background: rgba(255, 71, 87, 0.25);
}

.message {
  padding: 0.875rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.message.standalone {
  margin-top: 0;
}

.message.success {
  background: rgba(46, 213, 115, 0.15);
  border: 1px solid rgba(46, 213, 115, 0.3);
  color: #2ed573;
}

.message.error {
  background: rgba(255, 71, 87, 0.15);
  border: 1px solid rgba(255, 71, 87, 0.3);
  color: #ff4757;
}
</style>
