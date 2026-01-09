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
  const isPdfFile = extension === '.pdf'

  if (!isTextFile) {
    message.value = { type: 'error', text: 'Please select a supported file (.txt, .pdf, .md)' }
    return
  }

  if (isPdfFile) {
    try {
      // Convert PDF to base64 and send to server for parsing
      const arrayBuffer = await file.arrayBuffer()
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )

      const result = await $fetch<{ text: string }>('/api/parsePdf', {
        method: 'POST',
        body: { pdfBase64: base64 }
      })

      selectedFile.value = file
      form.fileName = file.name
      form.content = result.text
      message.value = null
    } catch (error: any) {
      console.error('PDF parsing error:', error)
      message.value = { type: 'error', text: error.data?.statusMessage || 'Failed to parse PDF file' }
    }
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

      <FileBox v-else :file="selectedFile" @clearFile="clearFile" />
    </div>

    <MainButton v-if="selectedFile" :disabled="isSubmitting" @click="handleSubmit">
      <span v-if="isSubmitting">Adding...</span>
      <span v-else>Add to Knowledge Base</span>
    </MainButton>

    <!-- Message when no file -->
    <MessageBox class="standalone" v-if="message && !selectedFile" :type="message.type" :message="message.text" />
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
  border: none;
  padding: 0;
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

.message.standalone {
  margin-top: 0;
}
</style>
