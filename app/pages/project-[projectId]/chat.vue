<script setup lang="ts">
import type { IProject } from '../../../server/models/Project'
import { useGlobalStore } from '../../store/global'

const globalStore = useGlobalStore()
definePageMeta({
  layout: 'project'
})

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{ title: string; score: number }>
}

const project = ref<IProject | null>(null)
const route = useRoute()

const projectId = computed(() => route.params.projectId as string)
const question = ref('')
const messages = ref<Message[]>([])
const isLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

const sendMessage = async () => {
  if (!projectId.value.trim() || !question.value.trim() || isLoading.value) return

  const userQuestion = question.value
  question.value = ''

  // Add user message
  messages.value.push({
    role: 'user',
    content: userQuestion
  })

  isLoading.value = true
  scrollToBottom()

  try {
    const response = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        projectId: projectId.value,
        question: userQuestion
      }
    })

    messages.value.push({
      role: 'assistant',
      content: response.answer,
      sources: response.sources as Array<{ title: string; score: number }>
    })
  } catch (error: any) {
    messages.value.push({
      role: 'assistant',
      content: `Error: ${error.data?.statusMessage || 'Failed to get response'}`
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const clearChat = () => {
  messages.value = []
}

onMounted(async () => {
  globalStore.setDrawerChild('ChatSidebar')
  project.value = await $fetch<IProject | null>('/api/getProject', {
    method: 'GET',
    query: {
      projectId: projectId.value
    }
  })
})
</script>

<template>
  <ProjectHeader :title="project?.title || 'Project Detailer'" subtitle="Ask questions about your project" />
  

  <div class="chat-area">
    <div ref="chatContainer" class="messages">
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-icon">💬</div>
        <p>Ask a question about your project</p>
        <p class="empty-hint">The AI will answer based only on the context you've added</p>
      </div>

      <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
        <div class="message-content">
          {{ msg.content }}
        </div>
        <div v-if="msg.sources && msg.sources.length > 0" class="sources">
          <span class="sources-label">Sources:</span>
          <span v-for="(source, sIndex) in msg.sources" :key="sIndex" class="source-tag">
            {{ source.title }}
          </span>
        </div>
      </div>

      <div v-if="isLoading" class="message assistant loading">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="input-area">
      <input v-model="question" type="text" placeholder="Ask a question..." :disabled="isLoading || !projectId" />
      <MainButton :disabled="isLoading || !projectId || !question.trim()" @click="sendMessage">
        <span v-if="isLoading">Sending...</span>
        <span v-else>Send</span>
      </MainButton>
    </form>
  </div>

  <button v-if="messages.length > 0" @click="clearChat" class="clear-btn">
    Clear Chat
  </button>

</template>

<style scoped>
.project-select {
  margin-bottom: 1rem;
}

.project-select label {
  display: block;
  color: #a0a0b0;
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
}

.project-select input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 0.95rem;
}

.project-select input:focus {
  outline: none;
  border-color: #e94560;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  min-height: 0;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #606070;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
}

.empty-hint {
  font-size: 0.85rem;
  margin-top: 0.5rem !important;
}

.message {
  max-width: 85%;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  line-height: 1.5;
}

.message.user {
  align-self: flex-end;
  background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
  color: white;
}

.message.assistant {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.08);
  color: #e0e0e0;
}

.message-content {
  white-space: pre-wrap;
}

.sources {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.8rem;
}

.sources-label {
  color: #808090;
  margin-right: 0.5rem;
}

.source-tag {
  display: inline-block;
  background: rgba(233, 69, 96, 0.2);
  color: #e94560;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-right: 0.4rem;
  margin-top: 0.3rem;
}

.loading {
  padding: 1rem;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #606070;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {

  0%,
  60%,
  100% {
    transform: translateY(0);
  }

  30% {
    transform: translateY(-6px);
  }
}

.input-area {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
}

.input-area input {
  flex: 1;
  padding: 0.875rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
}

.input-area input:focus {
  outline: none;
  border-color: #e94560;
}

.input-area input:disabled {
  opacity: 0.5;
}

.input-area button {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.input-area button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-area button:hover:not(:disabled) {
  opacity: 0.9;
}

.clear-btn {
  margin-top: 1rem;
  padding: 0.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #808090;
  cursor: pointer;
  font-size: 0.85rem;
  transition: border-color 0.2s, color 0.2s;
}

.clear-btn:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: #a0a0b0;
}
</style>
