<script setup lang="ts">

definePageMeta({
  layout: 'project'
})

const form = reactive({
  projectId: '',
  title: '',
  content: ''
})

const isSubmitting = ref(false)
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

async function handleSubmit() {
  if (!form.projectId || !form.title || !form.content) {
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
</script>

<template>

  <ProjectHeader title="Project Detailer" subtitle="Add context to your project" />

  <form @submit.prevent="handleSubmit" class="form">
    <div class="field">
      <label for="projectId">Project ID</label>
      <input
        id="projectId"
        v-model="form.projectId"
        type="text"
        placeholder="e.g., my-novel, app-v2, game-project"
        :disabled="isSubmitting"
      />
      <span class="hint">Use a consistent ID for each project</span>
    </div>

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

    <button type="submit" :disabled="isSubmitting" class="submit-btn">
      <span v-if="isSubmitting">Adding...</span>
      <span v-else>Add to Knowledge Base</span>
    </button>
  </form>
</template>

<style scoped>
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

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(233, 69, 96, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
