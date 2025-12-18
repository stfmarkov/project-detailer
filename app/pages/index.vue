<script setup lang="ts">
import MainButton from '../components/MainButton.vue'
import type { IProject } from '../../server/models/Project'

definePageMeta({
  layout: 'project'
})

const route = useRoute()
const project = ref<IProject | null>(null)
const form = reactive({
  projectId: route.query.projectId as string,
  title: '',
  content: ''
})

const isSubmitting = ref(false)
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const handleSubmit = async () => {
  if (!form.title || !form.content) {
    message.value = { type: 'error', text: 'All fields are required' }
    return
  }

  isSubmitting.value = true
  message.value = null

  try {
    const response = await $fetch('/api/addContext', {
      method: 'POST',
      body: {
        projectId: form.projectId,
        title: form.title,
        content: form.content
      }
    })

    console.log(response)

    message.value = { type: 'success', text: 'Context added successfully!' }
    
    // Clear form except projectId (user likely adding multiple to same project)
    form.title = ''
    form.content = ''
  } catch (error: any) {
    message.value = { 
      type: 'error', 
      text: error.data?.statusMessage || 'Failed to add context' 
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  project.value = await $fetch<IProject | null>('/api/getProject', {
    method: 'GET',
    query: {
      projectId: form.projectId
    }
  })
  console.log(project.value)
})
</script>

<template>

  <ProjectHeader :title="project?.title || 'Project Detailer'" :subtitle="project?.category || 'Add context to your project'" />

  <form @submit.prevent="handleSubmit" class="form">
    <div class="field">
      <label for="title">Title</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        placeholder="e.g., Main Character - Sarah, Login Feature, Chapter 3 Plot"
        :disabled="isSubmitting"
      />
    </div>

    <div class="field">
      <label for="content">Content</label>
      <textarea
        id="content"
        v-model="form.content"
        rows="8"
        placeholder="Describe the detail, character, feature, concept... Be as detailed as you like."
        :disabled="isSubmitting"
      />
    </div>

    <div v-if="message" :class="['message', message.type]">
      {{ message.text }}
    </div>

    <MainButton :disabled="isSubmitting" @click="handleSubmit">
      <span v-if="isSubmitting">Adding...</span>
      <span v-else>Add to Knowledge Base</span>
    </MainButton>
  </form>
</template>

<style scoped>
  
.main-button {
  width: 100%;
}

.form {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  color: #e0e0e0;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.field input,
.field textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
}

.field input::placeholder,
.field textarea::placeholder {
  color: #606070;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: #e94560;
  box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.15);
}

.field input:disabled,
.field textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.field textarea {
  resize: vertical;
  min-height: 150px;
  line-height: 1.6;
}

.hint {
  display: block;
  color: #707080;
  font-size: 0.8rem;
  margin-top: 0.4rem;
}

.message {
  padding: 0.875rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
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
